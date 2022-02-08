import React from 'react';
import {
    Heading,
    Flex,
    Spacer,
    Box,
} from '@chakra-ui/react';

import HamburgerMenu from './HamburgerMenu';

interface pageProps {
    title: string;
    activeButtonId: number;
}

export default function Header(props:pageProps) {
    return (
        <div>
            <Flex bg="white" boxShadow="lg" padding="6">
                <HamburgerMenu activeButtonId={props.activeButtonId} />
                <Spacer />
                <Box>
                    <Heading pr={33} size="3xl">{props.title}</Heading>
                </Box>
                <Spacer />
            </Flex>
        </div>
    );
}
