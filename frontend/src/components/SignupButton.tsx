import { Button, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { signupForJob, removeSignup } from '../controller/job';
import { UserContext } from '../contexts/UserContext';

interface buttonProps {
    jobId: number,
    member: string,
    start: string,
    memberId: number,
    refreshData: any,
}

export default function SignupButton(props: buttonProps) {
    const { state } = useContext(UserContext);
    const [member, setMember] = useState(props.member);
    const [jobMemberId] = useState(props.memberId);

    const [jobId] = useState(props.jobId);
    const toast = useToast();
    const handleClick = async () => {
        if (Date.parse(props.start) >= Date.now()) {
            setMember(`${state.user?.firstName} ${state.user?.lastName}`);
            const memberId = state?.user?.memberId;
            if (memberId) {
                await signupForJob(state.token, jobId, memberId);
            }
            await props.refreshData();
        } else {
            toast({
                containerStyle: {
                    background: 'orange',
                },
                // eslint-disable-next-line max-len
                title: 'This event has already passed, and is no longer eligible for signups',
                description: `Job ID ${props.jobId}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    let signupButton;
    if (!member) {
        signupButton = (
            <Button
                // variant={verified ? 'verified' : 'unverified'}
                aria-label="Sign Up"
                background="orange.300"
                color="white"
                onClick={handleClick}
            >
                Signup &nbsp;
                {state.user?.firstName}
            </Button>
        );
    } else {
        // I can delete my own signups, and of course admins can delete everyone's signups.
        const allowDelete = (
            (state?.user?.memberId === jobMemberId) ||
            (state.user?.memberType === 'Admin')
        );
        signupButton = (
            <Button
                aria-label="Remove"
                background="red"
                color="white"
                onClick={
                    async () => {
                        await removeSignup(state.token, jobId);
                        setMember('');
                        await props.refreshData();
                    }
                }
                disabled={!allowDelete}
            >
                Remove Signup
            </Button>
        );
    }
    return signupButton;
}
