import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import DrawerExample from './components/menu';

function App() {
    return (
        <ChakraProvider>
            <DrawerExample />
        </ChakraProvider>
    );
}

export default App;
