import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BsTools } from 'react-icons/bs';
import { FaMoneyCheck, FaTeamspeak } from 'react-icons/fa';

import theme from '../theme';
import Header from '../components/Header';
import EventSignupSheet from '../components/EventSignupSheet';
import PaidLaborList from '../components/PaidLaborList';
import CustomTabPanel from '../components/shared/CustomTabPanel';
import SiteSettings from '../components/tabpanels/SiteSettings';

function RaceAdministration() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Club Administration" activeButtonId={6} />
            <CustomTabPanel
                tabs={
                    [
                        { label: 'Event Job Structure', icon: <FaTeamspeak /> },
                        { label: 'Paid Labor', icon: <FaMoneyCheck /> },
                        { label: 'Site Settings', icon: <BsTools /> },
                    ]
                }
                panels={[<EventSignupSheet />, <PaidLaborList />, <SiteSettings />]}
            />
        </ChakraProvider>
    );
}

export default RaceAdministration;
