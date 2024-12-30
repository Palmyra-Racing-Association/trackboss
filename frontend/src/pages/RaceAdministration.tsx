import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { FaMoneyCheck, FaTeamspeak } from 'react-icons/fa';

import theme from '../theme';
import Header from '../components/Header';
import EventSignupSheet from '../components/EventSignupSheet';
import PaidLaborList from '../components/PaidLaborList';
import CustomTabPanel from '../components/shared/CustomTabPanel';

function RaceAdministration() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Race Administration" activeButtonId={6} />
            <CustomTabPanel
                tabs={
                    [
                        { label: 'Event Job Structure', icon: <FaTeamspeak /> },
                        { label: 'Paid Labor', icon: <FaMoneyCheck /> },
                    ]
                }
                panels={[<EventSignupSheet />, <PaidLaborList />]}
            />
        </ChakraProvider>
    );
}

export default RaceAdministration;
