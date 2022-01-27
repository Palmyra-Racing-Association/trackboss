import React from 'react';
import {
    Heading,
    HStack,
} from '@chakra-ui/react';

import HamburgerMenu from './HamburgerMenu';

interface pageProps {
    title: string;
}

export default function Header(props:pageProps) {
    return (
        <div>
            <HStack boxShadow="lg" padding="6" spacing="650">
                <HamburgerMenu />
                <Heading size="3xl">{props.title}</Heading>
            </HStack>
        </div>
    );
}
