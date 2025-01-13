import React from 'react';
import { Box, Center, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { BsBackspace, BsSearch } from 'react-icons/bs';

interface dataSearchBoxProps {
    searchValue: string,
    // this eslint rule is a tough guy about the unused var but I like it for clarity so I disabled this rule.
    // eslint-disable-next-line no-unused-vars
    onTextChange: (value: string) => void,
}
export default function DataSearchBox(props: dataSearchBoxProps) {
    return (
        <Center>
            <Box maxWidth={500} padding={5}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <BsSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                        size="lg"
                        placeholder="Search..."
                        value={props.searchValue}
                        onChange={
                            (e) => {
                                props.onTextChange(e.target.value);
                            }
                        }
                    />
                    <InputRightElement
                        onClick={() => props.onTextChange('')}
                    >
                        <BsBackspace color="gray.300" />
                    </InputRightElement>
                </InputGroup>
            </Box>
        </Center>
    );
}
