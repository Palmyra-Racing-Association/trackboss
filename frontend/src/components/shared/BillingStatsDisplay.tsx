import { Box, HStack, Link, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
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
                    <StatNumber>
                        {bill?.membershipType}
                    </StatNumber>
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
                        {`$${bill?.amountWithFee} w/ Square`}
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
            <Link
                href={bill?.squareLink}
                target="_blank"
            >
                Square link
            </Link>
        </Box>
    );
}
BillingStatsDisplay.defaultProps = {
    bill: undefined,
};
