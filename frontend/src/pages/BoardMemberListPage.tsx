import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import BoardMemberList from '../components/BoardMemberList';

function BoardMemberListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Board Members" activeButtonId={5} />
            <Box mt={0} pt={0}>
                <BoardMemberList />
            </Box>
        </ChakraProvider>
    );
}

export default BoardMemberListPage;
