/* eslint-disable no-undef */
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Box, IconButton } from '@chakra-ui/react';
import { BsPrinter } from 'react-icons/bs';
import SignUpList from './SignUpList';

export default function ExamplePrint() {
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Box>
            <IconButton
                ml={10}
                mt={5}
                size="lg"
                aria-label="Print"
                background="orange.300"
                color="white"
                onClick={handlePrint}
                icon={<BsPrinter />}
            />
            <Box pl={10} pr={10}>
                <SignUpList ref={componentRef} />
            </Box>
        </Box>
    );
}
