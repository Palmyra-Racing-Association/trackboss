import { Box, Switch, Text, useToast } from '@chakra-ui/react';
import React from 'react';

interface wrappedSwitchProps {
    wrapperText: string,
    defaultChecked: boolean,
    // eslint-disable-next-line no-unused-vars
    onSwitchChange: (value: boolean) => void,
    maxWidth: number,
    locked?: boolean,
    toastMessage?: string,
    duration?: number,
}

export default function WrappedSwitchInput(props: wrappedSwitchProps) {
    const { wrapperText, defaultChecked, onSwitchChange, maxWidth, locked } = props;
    const toast = useToast();
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
                        if (props.toastMessage) {
                            toast({
                                containerStyle: {
                                    background: 'orange',
                                },
                                description: props.toastMessage,
                                status: 'success',
                                duration: props.duration,
                                isClosable: true,
                            });
                        }
                    }
                }
                isDisabled={locked}
            />
        </Box>
    );
}

WrappedSwitchInput.defaultProps = {
    locked: false,
    toastMessage: '',
    duration: 5000,
};
