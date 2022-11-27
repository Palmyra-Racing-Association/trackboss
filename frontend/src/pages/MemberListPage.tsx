import React, { useContext } from 'react';
import { Box, Center, ChakraProvider, IconButton } from '@chakra-ui/react';
import { BsNewspaper, BsPrinter } from 'react-icons/bs';
import theme from '../theme';
import Header from '../components/Header';
import MemberList from '../components/MemberList';
import { getEligibleVoters, getMemberPointsExcel } from '../controller/workPoints';
import { UserContext } from '../contexts/UserContext';

function MemberListPage() {
    const { state } = useContext(UserContext);

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
                        mr={2}
                        onClick={
                            async () => {
                                const memberWorkListExcel = await getMemberPointsExcel(state.token);
                                const objectUrl = URL.createObjectURL(memberWorkListExcel);
                                window.location.href = objectUrl;
                            }
                        }
                        icon={<BsPrinter />}
                    />
                    <IconButton
                        size="lg"
                        aria-label="Eligible Voters"
                        background="orange.300"
                        color="white"
                        onClick={
                            async () => {
                                const memberWorkListExcel = await getEligibleVoters(state.token);
                                const objectUrl = URL.createObjectURL(memberWorkListExcel);
                                window.location.href = objectUrl;
                            }
                        }
                        icon={<BsNewspaper />}
                    />
                </Center>
                <MemberList />
            </Box>
        </ChakraProvider>
    );
}

export default MemberListPage;
