import React from 'react';
import { useParams } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Header from '../components/Header';
import ReactToPrint from '../components/ReactToPrint';
import theme from '../theme';

type pageParams = {
    date: string,
};

export default function SignUpPage() {
    const { date } = useParams<pageParams>();
    return (
        <ChakraProvider theme={theme}>
            <Header title={`Sign Ups (${date})`} activeButtonId={2} />
            {/* ReacToPrint wraps the SignUpList component, to allow printing */}
            <ReactToPrint />
        </ChakraProvider>
    );
}
