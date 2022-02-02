import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box } from '@chakra-ui/react';

export default function WorkPointsCard() {
    return (
        <Box>
            <GaugeChart
                hideText
                id="gauge-chart"
                nrOfLevels={20}
                percent={0.86}
                colors={['#FF9F46', '#76CE6F']}
            />

        </Box>
    );
}
