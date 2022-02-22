import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import MemberSummaryModal from '../components/MemberSummaryModal';

function MemberList() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <MemberSummaryModal />
        </ChakraProvider>
    );
}

export default MemberList;
