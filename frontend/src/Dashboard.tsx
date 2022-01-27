import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Header from './components/Header';

function Dashboard() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Dashboard" />
        </ChakraProvider>
    );
}

export default Dashboard;
