import React from 'react';
import {
    Center,
    Heading,
} from '@chakra-ui/react';

interface pageProps {
    name: string
}

// the below eslint-disable is needed because of the trailing space in the greeting
export default function Header(props:pageProps) {
    return (
        <Center>
            <Heading size="4xl">
                Hi, {/*eslint-disable-line*/}
                <Heading sx={{ display: 'inline' }} color="orange" size="4xl">
                    {props.name}
                </Heading>
            </Heading>
        </Center>
    );
}
