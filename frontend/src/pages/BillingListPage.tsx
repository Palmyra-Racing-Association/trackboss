import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import DuesAndWaiversList from '../components/shared/DuesAndWaiversList';

function BillingListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Member Billing" activeButtonId={8} />
            <Box mt={0} pt={0}>
                <DuesAndWaiversList />
            </Box>
        </ChakraProvider>
    );
}

export default BillingListPage;
