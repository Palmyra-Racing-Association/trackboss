import React from 'react';
import { Box } from '@chakra-ui/react';
import SignupButton from './SignupButton';

export default function SignupListRow(props: any) {
    return (
        <Box m={3}>
            <SignupButton
                jobId={props.data.jobId}
                member={props.data.member}
                memberId={props.data.memberId}
                start={props.data.start}
                refreshData={props.refreshData}
            />
        </Box>
    );
}
