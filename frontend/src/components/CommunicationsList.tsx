import React from 'react';
import { Box, Button } from '@chakra-ui/react';

export default function CommunicationsList() {
    return (
        <Box mt={5} ml={5}>
            <Button
                backgroundColor="orange"
                color="white"
            >
                New Communication
            </Button>
        </Box>
    );
}
