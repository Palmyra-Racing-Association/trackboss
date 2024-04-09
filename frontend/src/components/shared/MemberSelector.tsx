import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { Member } from '../../../../src/typedefs/member';
import { UserContext } from '../../contexts/UserContext';
import { getMemberList, getMembersByMembership } from '../../controller/member';

interface MemberSelectorProps {
    isAdmin: boolean,
    // eslint-disable-next-line no-unused-vars
    setSelectedOption: (option: any) => void,
}

export default function MemberSelector(props: MemberSelectorProps) {
    const { state } = useContext(UserContext);

    const [eligibleMembers, setEligibleMembers] = useState<any[]>([]);
    const [selectedOption] = useState<any>();

    useEffect(() => {
        async function getData() {
            let activeMembers = await getMembersByMembership(state.token, state.user?.membershipId || 0);
            if (props.isAdmin) {
                activeMembers = await getMemberList(state.token) as Member[];
                activeMembers = activeMembers.filter((listedMember) => listedMember.active);
            }
            activeMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));
            const options = activeMembers.map((member) => {
                let memberName = `${member.lastName}, ${member.firstName}`;
                if (member.memberId !== member.membershipAdminId) {
                    memberName += '*';
                }
                const option = {
                    value: member.memberId,
                    label: memberName,
                };
                return option;
            });
            setEligibleMembers(options);
        }
        getData();
    }, []);

    return (
        <Select
            placeholder="Choose a member or start typing to narrow down the list"
            styles={
                {
                    option: (provided, optionState) => ({
                        ...provided,
                        backgroundColor: optionState.isSelected ? '#ffa24d' : 'white',
                        borderBottom: '1px solid #ffa24d',
                    }),
                }
            }
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            isSearchable
            isClearable
            backspaceRemovesValue
            options={eligibleMembers}
            value={selectedOption}
            onChange={
                async (e) => {
                    props.setSelectedOption(e);
                }
            }
        />
    );
}
