import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';

function MemberCommunicationsPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Member Communications" activeButtonId={9} />
            <Box mt={0} pt={0} />
        </ChakraProvider>
    );
}

export default MemberCommunicationsPage;
