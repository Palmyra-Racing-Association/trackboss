import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { UserContext } from '../../contexts/UserContext';
import { getMembershipTypeCounts } from '../../controller/memberType';

interface MembershipTypeSelectorProps {
    isAdmin: boolean,
    currentType: string,
    // eslint-disable-next-line no-unused-vars
    setSelectedOption: (option: any) => void,
}

export default function MembershipTypeSelector(props: MembershipTypeSelectorProps) {
    const { state } = useContext(UserContext);

    const [membershipTypeOptions, setMembershipTypeOptions] = useState<any[]>([]);
    const [selectedOption] = useState<any>();

    useEffect(() => {
        async function getData() {
            const memberTypes = await getMembershipTypeCounts(state.token);
            memberTypes.sort((a, b) => a.type.localeCompare(b.type));
            const options = memberTypes.map((type) => {
                const option = {
                    value: type.memberTypeId,
                    label: type.type,
                };
                return option;
            });
            setMembershipTypeOptions(options);
        }
        getData();
    }, []);

    return (
        <Select
            styles={
                {
                    option: (provided, optionState) => ({
                        ...provided,
                        backgroundColor: optionState.isSelected ? '#ffa24d' : 'white',
                        borderBottom: '1px solid #ffa24d',
                    }),
                }
            }
            placeholder={props.currentType}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            isDisabled={!props.isAdmin}
            isSearchable
            isClearable
            backspaceRemovesValue
            options={membershipTypeOptions}
            value={selectedOption}
            onChange={
                async (e) => {
                    props.setSelectedOption(e.value);
                }
            }
        />
    );
}
