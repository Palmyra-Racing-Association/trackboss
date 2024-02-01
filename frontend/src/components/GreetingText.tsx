import React from 'react';
import {
    Center,
    Heading,
    Highlight,
    Text,
    VStack,
} from '@chakra-ui/react';

interface pageProps {
    name: string,
    billYear: number,
    billPaid?: boolean,
    insuranceAttested?: boolean,
}

// the below eslint-disable is needed because of the trailing space in the greeting
export default function Header(props: pageProps) {
    const { billPaid, insuranceAttested, billYear } = props;
    const allDone = (billPaid && insuranceAttested);
    let status = (allDone) ? 'complete' : 'incomplete';
    let highlightColor = 'green';
    if (!allDone) {
        highlightColor = 'red';
        if (!billPaid && !insuranceAttested) {
            status += '(payment, insurance)';
        } else if (!billPaid) {
            status += '(payment)';
        } else if (!insuranceAttested) {
            status += '(insurance)';
        }
    }
    return (
        <Center>
            <VStack>
                <Heading size="2xl">
                    Hi, {/*eslint-disable-line*/}
                    <Heading sx={{ display: 'inline' }} color="orange" size="2xl">
                        {props.name}
                    </Heading>
                </Heading>
                <Text fontSize="xl">
                    <Highlight
                        query={['complete', 'incomplete']}
                        styles={{ px: '2', py: '1', rounded: 'full', color: 'white', bg: highlightColor }}
                    >
                        {`${billYear + 1} renewal status: ${status}`}
                    </Highlight>
                </Text>
            </VStack>
        </Center>
    );
}
Header.defaultProps = {
    billPaid: true,
    insuranceAttested: true,
};
