import React, { useState } from 'react';
import { Button, Heading, HStack, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';
import _ from 'lodash';

interface YearsDropDownProps {
    years: number[],
    header: string,
    // eslint-disable-next-line no-unused-vars
    setYear: (value: number) => void,
    initialYear: number,
}

export default function YearsDropDown(props: YearsDropDownProps) {
    const currentYear = (new Date()).getFullYear();
    const [year, setYear] = useState<number>(props.initialYear);
    if (!props.years || (props.years.length === 0)) {
        props.years.push(currentYear);
    }

    return (
        <HStack align="center">
            <Menu>
                <MenuButton bg="orange" color="white" as={Button} rightIcon={<BsChevronDown />}>
                    Past Years
                </MenuButton>
                <MenuList>
                    {
                        // eslint-disable-next-line arrow-body-style
                        _.map(props.years, (listYear) => (
                            <MenuItem
                                key={listYear}
                                onClick={
                                    () => {
                                        props.setYear(listYear);
                                        setYear(listYear);
                                    }
                                }
                            >
                                {listYear}
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>
            <Heading>
                {props.header}
                (
                {year}
                )
            </Heading>
        </HStack>
    );
}
