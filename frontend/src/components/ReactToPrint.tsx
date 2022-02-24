import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Box } from '@chakra-ui/react';
import MemberList from './MemberList';

export default function ExamplePrint() {
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Box>
            <MemberList ref={componentRef} />
            <Button onClick={handlePrint}>Print this out!</Button>
        </Box>
    );
}
