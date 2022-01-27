import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';

function Dashboard() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Dashboard" activeButtonId={1} />
        </ChakraProvider>
    );
}

export default Dashboard;
