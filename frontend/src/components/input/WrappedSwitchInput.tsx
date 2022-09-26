import { Box, Switch, Text } from '@chakra-ui/react';
import React from 'react';

interface wrappedSwitchProps {
    wrapperText: string,
    defaultChecked: boolean,
    // eslint-disable-next-line no-unused-vars
    onSwitchChange: (value: boolean) => void,
    maxWidth: number,
}

export default function WrappedSwitchInput(props: wrappedSwitchProps) {
    const { wrapperText, defaultChecked, onSwitchChange, maxWidth } = props;
    return (
        <Box maxWidth={maxWidth}>
            <Text fontSize="sm">{wrapperText}</Text>
            <Switch
                colorScheme="orange"
                defaultChecked={defaultChecked}
                size="lg"
                onChange={
                    (event) => {
                        onSwitchChange(event.currentTarget.checked);
                    }
                }
            />
        </Box>
    );
}
