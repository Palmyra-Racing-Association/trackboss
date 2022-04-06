import { Box, Button } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';

import { setVerifiedState } from '../controller/job';
import { UserContext } from '../contexts/UserContext';

interface buttonProps {
    verified: boolean,
    jobId: number,
    member: string,
}

export default function VerifyButton(props: buttonProps) {
    const { state } = useContext(UserContext);
    const [verified, setVerified] = useState(props.verified);
    const [jobId] = useState(props.jobId);
    const handleClick = () => {
        setVerified(!verified);
        setVerifiedState(state.token, jobId, !verified);
    };
    let verifyButton;
    if (props.member) {
        verifyButton = (
            <Button
                size="lg"
                variant={verified ? 'verified' : 'unverified'}
                onClick={handleClick}
                isDisabled={!props.member}
            >
                {verified ? 'Verified' : 'Verify'}
            </Button>
        );
    } else {
        verifyButton = (
            <Box />
        );
    }
    return verifyButton;
}
