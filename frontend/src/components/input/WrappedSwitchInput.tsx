import { Box, Switch, Text } from '@chakra-ui/react';
import React from 'react';

interface wrappedSwitchProps {
    wrapperText: string,
    defaultChecked: boolean,
    // eslint-disable-next-line no-unused-vars
    onSwitchChange: (value: boolean) => void,
}

export default function WrappedSwitchInput(props: wrappedSwitchProps) {
    const { wrapperText, defaultChecked, onSwitchChange } = props;
    return (
        <Box maxWidth={100}>
            <Text fontSize="sm">{wrapperText}</Text>
            <Switch
                colorScheme="orange"
                defaultChecked={defaultChecked}
                size="lg"
                onChange={
                    (value) => {
                        onSwitchChange(!value);
                    }
                }
            />
        </Box>
    );
}
