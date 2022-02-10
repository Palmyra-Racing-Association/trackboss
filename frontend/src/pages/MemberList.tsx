import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';

function MemberList() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
        </ChakraProvider>
    );
}

export default MemberList;
