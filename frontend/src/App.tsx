import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import DrawerExample from './components/menu';
import theme from './theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <DrawerExample />
        </ChakraProvider>
    );
}

export default App;
