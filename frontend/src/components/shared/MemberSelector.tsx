import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { Member } from '../../../../src/typedefs/member';
import { UserContext } from '../../contexts/UserContext';
import { getMemberList, getMembersByMembership } from '../../controller/member';

interface MemberSelectorProps {
    isAdmin: boolean,
    disabled: boolean,
    // eslint-disable-next-line no-unused-vars
    setSelectedOption: (option: any) => void,
    membershipId?: number,
}

export default function MemberSelector(props: MemberSelectorProps) {
    const { state } = useContext(UserContext);

    const [eligibleMembers, setEligibleMembers] = useState<any[]>([]);
    const [selectedOption] = useState<any>();

    useEffect(() => {
        async function getData() {
            const membershipId = props.membershipId || state.user?.membershipId || 0;
            let activeMembers = await getMembersByMembership(state.token, membershipId);
            if (props.isAdmin) {
                activeMembers = await getMemberList(state.token) as Member[];
            }
            activeMembers = activeMembers.filter((listedMember) => listedMember.active);
            activeMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));
            const options = activeMembers.map((member) => {
                let memberName = `${member.lastName}, ${member.firstName}`;
                if (member.memberId !== member.membershipAdminId) {
                    memberName += `* (${member.membershipAdmin})`;
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
            isDisabled={props.disabled && !props.isAdmin}
            onChange={
                async (e) => {
                    props.setSelectedOption(e);
                }
            }
        />
    );
}
MemberSelector.defaultProps = {
    membershipId: undefined,
};
