import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Button,
    Divider,
    Heading,
    ModalFooter,
    SimpleGrid,

} from '@chakra-ui/react';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  attendeesList: any[],
  familyMembers: any[],
}

function signUp(attendingFamily: any[], member: any) {
    // Call controller to sign up member, then once it confirms...
    return attendingFamily.concat(member);
}

function undoSignUp(attendingFamily: any[], member: any) {
    // Call the controller to un-sign up, then once it confirms...
    const index = attendingFamily.indexOf(member);
    const unsignedMember = attendingFamily[index];
    return attendingFamily.filter((m) => m.member_id !== unsignedMember.member_id);
}

export default function SignUpModal(props: modalProps) {
    const [attendingFamily, setAttendingFamily] = useState<any>([]);
    useEffect(() => {
        async function setAttendance() {
            props.familyMembers.forEach((member) => {
                // If the family member is attending the event, then add them to the list of attendingFamily
                // (make their button orange)
                if (props.attendeesList.some((attendee: any) => JSON.stringify(member) === JSON.stringify(attendee))) {
                    attendingFamily.push(member);
                }
            });
            setAttendingFamily(attendingFamily);
        }
        setAttendance();
    }, []);

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading pl={2} pr={2} textAlign="left">Select members to sign up</Heading>
                <Divider mb={5} />
                <ModalCloseButton />
                <SimpleGrid spacing={2} columns={3}>
                    {
                        props.familyMembers.map((member) => (
                            <Button
                                key={member.member_id}
                                onClick={
                                    async () => {
                                        if (attendingFamily.includes(member)) {
                                            await setAttendingFamily(undoSignUp(attendingFamily, member));
                                        } else {
                                            await setAttendingFamily(signUp(attendingFamily, member));
                                        }
                                    }
                                }
                                m={3}
                                backgroundColor={
                                    attendingFamily.includes(member)
                                        ? 'orange.300' : 'grey.300'
                                }
                                _hover={{ bg: 'orange.100' }}
                            >
                                {member.name}
                            </Button>
                        ))
                    }
                </SimpleGrid>
                <Divider />
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="sm"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
