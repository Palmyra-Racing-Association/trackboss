import { Button, IconButton } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { signupForJob, removeSignup } from '../controller/job';
import { UserContext } from '../contexts/UserContext';

interface buttonProps {
    jobId: number,
    member: string,
    memberId: number,
}

export default function SignupButton(props: buttonProps) {
    const { state } = useContext(UserContext);
    const [member, setMember] = useState(props.member);
    const [jobMemberId] = useState(props.memberId);

    const [jobId] = useState(props.jobId);
    const handleClick = async () => {
        setMember(`${state.user?.firstName} ${state.user?.lastName}`);
        const memberId = state?.user?.memberId;
        if (memberId) {
            signupForJob(state.token, jobId, memberId);
        }
    };
    let signupButton;
    if (!member) {
        signupButton = (
            <Button
                // variant={verified ? 'verified' : 'unverified'}
                background="orange.300"
                color="white"
                onClick={handleClick}
            >
                Sign up!
            </Button>
        );
    } else {
        // I can delete my own signups, and of course admins can delete everyone's signups.
        const allowDelete = (
            (state?.user?.memberId === jobMemberId) ||
            (state.user?.memberType === 'Admin')
        );
        signupButton = (
            <>
                {member}
                &nbsp;
                <IconButton
                    aria-label="Remove"
                    background="red"
                    color="white"
                    icon={<BsFillTrashFill />}
                    onClick={
                        async () => {
                            await removeSignup(state.token, jobId);
                            setMember('');
                        }
                    }
                    disabled={!allowDelete}
                >
                    Remove
                </IconButton>
            </>
        );
    }
    return signupButton;
}
