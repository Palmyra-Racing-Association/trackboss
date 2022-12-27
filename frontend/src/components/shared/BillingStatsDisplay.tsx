import { Box, HStack, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import React from 'react';
import { Bill } from '../../../../src/typedefs/bill';

interface billStatsProps {
    bill?: Bill,
}
export default function BillingStatsDisplay(props: billStatsProps) {
    const { bill } = props;

    return (
        <Box>
            <HStack>
                <Stat>
                    <StatLabel>
                        Points Earned in &nbsp;
                        {bill?.year}
                    </StatLabel>
                    <StatNumber>
                        {bill?.pointsEarned}
                        &nbsp;
                    </StatNumber>
                    <StatHelpText>
                        of
                        &nbsp;
                        {bill?.pointsThreshold}
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>
                        Amount Due
                    </StatLabel>
                    <StatNumber>
                        {`$${bill?.amount}`}
                    </StatNumber>
                    <StatHelpText>
                        {`$${bill?.amountWithFee} w/ PayPal`}
                    </StatHelpText>
                </Stat>
            </HStack>
            <Stat>
                <StatLabel>
                    Bill generated on
                </StatLabel>
                <StatHelpText>
                    {`${bill?.generatedDate}`}
                </StatHelpText>
            </Stat>
        </Box>
    );
}
BillingStatsDisplay.defaultProps = {
    bill: undefined,
};
