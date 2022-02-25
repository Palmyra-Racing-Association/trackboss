/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import MemberSummaryModal from '../components/MemberSummaryModal';
import { Member } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import MemberList from '../components/MemberList';

function MemberListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <Box mt={0} pt={0}>
                <MemberList />
            </Box>
        </ChakraProvider>
    );
}

export default MemberListPage;
