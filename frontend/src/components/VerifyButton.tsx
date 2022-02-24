import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

interface buttonProps {
    verified: boolean,
}

export default function VerifyButton(props: buttonProps) {
    const [verified, setVerified] = useState(props.verified);

    const handleClick = () => {
        setVerified(!verified);
    };

    return (
        <Button
            size="lg"
            variant={verified ? 'verified' : 'unverified'}
            onClick={handleClick}
        >
            {verified ? 'Verified' : 'Verify'}
        </Button>
    );
}
