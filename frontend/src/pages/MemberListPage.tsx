import React from 'react';
import { Box, Center, ChakraProvider, IconButton } from '@chakra-ui/react';
import { BsPrinter } from 'react-icons/bs';
import theme from '../theme';
import Header from '../components/Header';
import MemberList from '../components/MemberList';

function MemberListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <Box mt={0} pt={0}>
                <Center>
                    <IconButton
                        size="lg"
                        aria-label="Print"
                        background="orange.300"
                        color="white"
                        onClick={
                            async () => {
                                alert('download member list sir');
                                // const signupListExcel = await getSignupListExcel(state.token, props.eventId);
                                // const objectUrl = URL.createObjectURL(signupListExcel);
                                // window.location.href = objectUrl;
                            }
                        }
                        icon={<BsPrinter />}
                    />
                </Center>
                <MemberList />
            </Box>
        </ChakraProvider>
    );
}

export default MemberListPage;
