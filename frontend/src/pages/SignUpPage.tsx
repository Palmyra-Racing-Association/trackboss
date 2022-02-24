import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Header from '../components/Header';
import { RouteComponentProps } from 'react-router-dom';

type pageParams = {
    date: string,
};

export default function SignUpPage({ match }: RouteComponentProps<pageParams>) {
    return(
        <Box>
            <Header title={`Sign Ups (${match.params.date})`} activeButtonId={2}/>
            <Heading>{match.params.date}</Heading>

        </Box>
    );

}