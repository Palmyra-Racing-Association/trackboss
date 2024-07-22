import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import PaidLaborList from '../components/PaidLaborList';

function PaidLaborListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Paid Labor" activeButtonId={10} />
            <Box mt={0} pt={0}>
                <PaidLaborList />
            </Box>
        </ChakraProvider>
    );
}

export default PaidLaborListPage;
