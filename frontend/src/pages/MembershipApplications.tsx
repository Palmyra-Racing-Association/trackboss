import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import MembershipApplicationList from '../components/MembershipApplicationList';

function MembershipApplications() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Membership Applications" activeButtonId={6} />
            <Box mt={0} pt={0}>
                <MembershipApplicationList />
            </Box>
        </ChakraProvider>
    );
}

export default MembershipApplications;
