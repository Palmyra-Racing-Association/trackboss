/*eslint-disable*/
import React from 'react';
import {
    Center,
    Heading,
    Text
} from '@chakra-ui/react';

import HamburgerMenu from './HamburgerMenu';

interface pageProps {
    name: string
}

export default function Header(props:pageProps) {
    return (
        <Center>
            <Heading fontFamily=''>Hi, <Heading color="orange">{props.name}!</Heading></Heading>
        </Center>
    );
}
