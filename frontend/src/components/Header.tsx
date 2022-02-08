/*eslint-disable*/
import React from 'react';
import {
    Center,
    Heading,
    HStack,
} from '@chakra-ui/react';

import HamburgerMenu from './HamburgerMenu';

interface pageProps {
    title: string;
    activeButtonId: number;
}

export default function Header(props:pageProps) {
    return (
        <div>
            <HStack bg="white" boxShadow="lg" padding="6" spacing="650" >
                <HamburgerMenu activeButtonId={props.activeButtonId} />
                <Center>
                    <Heading size="3xl">{props.title}</Heading>
                </Center>
            </HStack>
        </div>
    );
}
