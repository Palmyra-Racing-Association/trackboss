import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import SignupButton from './SignupButton';

export default function SignupListRow(props: any) {
    return (
        <SimpleGrid columns={[1, null, 3]} spacing="10px">
            <SignupButton
                jobId={props.data.jobId}
                member={props.data.member}
                memberId={props.data.memberId}
                start={props.data.start}
                refreshData={props.refreshData}
            />
        </SimpleGrid>
    );
}
