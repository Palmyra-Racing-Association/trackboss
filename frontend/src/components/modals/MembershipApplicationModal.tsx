/* eslint-disable max-len */
import React, { useState } from 'react';
import {
    Button, Divider, Heading, Link, ListItem, Modal, ModalContent, ModalFooter,
    ModalOverlay, OrderedList, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, VStack,
} from '@chakra-ui/react';
import { MembershipApplication } from '../../../../src/typedefs/membershipApplication';
import NameAddressDisplay from '../shared/NameAddressDisplay';
import { acceptMembershipApplication, rejectMembershipApplication, reviewMembershipApplication } from '../../controller/membershipApplication';

interface appModalProps {
    // your data goes here.
    membershipApplication: MembershipApplication,
    isOpen: boolean,
    // typically the chakra useDisclosure passed from the parent.
    onClose: () => void,
    // callback function for throwing data back to the parent.
    addAction: () => void,
    token: string,
}

export default function MembershipApplicationModal(props: appModalProps) {
    const [applicantNotes, setApplicantNotes] = useState<string>();
    const [internalNotes, setInternalNotes] = useState<string>();

    const { membershipApplication, isOpen, onClose } = props;
    props.addAction();
    return (
        <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading>
                    Application -
                    {membershipApplication.firstName}
                    &nbsp;
                    {membershipApplication.lastName}
                </Heading>
                <Divider />
                <SimpleGrid columns={[1, 1, 1]} spacing={0.5} m={3}>
                    <Tabs variant="soft-rounded" bg="white" colorScheme="orange">
                        <TabList>
                            <Tab>Application Info</Tab>
                            <Tab>Personal Info</Tab>
                            <Tab>Family Members</Tab>
                            <Tab>Notes</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Text size="lg">
                                    Application ID:
                                    &nbsp;
                                    {membershipApplication.id}
                                </Text>
                                <Text size="lg">
                                    Application received at
                                    &nbsp;
                                    {membershipApplication.receivedDate}
                                </Text>
                                <Link
                                    isExternal
                                    href={membershipApplication.googleLink}
                                >
                                    Link to Google results for
                                    &nbsp;
                                    {membershipApplication.firstName}
                                </Link>
                            </TabPanel>
                            <TabPanel>
                                <NameAddressDisplay
                                    addressContainer={membershipApplication}
                                />
                                <Text size="md">
                                    {membershipApplication.occupation}
                                </Text>
                                <Text size="md">
                                    Recommended by
                                    &nbsp;
                                    {membershipApplication.recommendedBy}
                                </Text>
                            </TabPanel>
                            <TabPanel>
                                {
                                    (membershipApplication.familyMember0FirstName && (
                                        <OrderedList>
                                            <ListItem>
                                                {membershipApplication.familyMember0FirstName}
                                                &nbsp;
                                                {membershipApplication.familyMember0LastName}
                                                &nbsp;
                                                {membershipApplication.familyMember0Age}
                                            </ListItem>
                                            <ListItem>
                                                {membershipApplication.familyMember1FirstName}
                                                &nbsp;
                                                {membershipApplication.familyMember1LastName}
                                                &nbsp;
                                                {membershipApplication.familyMember1Age}
                                            </ListItem>
                                            <ListItem>
                                                {membershipApplication.familyMember2FirstName}
                                                &nbsp;
                                                {membershipApplication.familyMember2LastName}
                                                &nbsp;
                                                {membershipApplication.familyMember2Age}
                                            </ListItem>
                                            <ListItem>
                                                {membershipApplication.familyMember3FirstName}
                                                &nbsp;
                                                {membershipApplication.familyMember3LastName}
                                                &nbsp;
                                                {membershipApplication.familyMember3Age}
                                            </ListItem>
                                            <ListItem>
                                                {membershipApplication.familyMember4FirstName}
                                                &nbsp;
                                                {membershipApplication.familyMember4LastName}
                                                &nbsp;
                                                {membershipApplication.familyMember4Age}
                                            </ListItem>
                                        </OrderedList>
                                    )
                                    )
                                }
                            </TabPanel>
                            <TabPanel>
                                <VStack spacing={2}>
                                    <Textarea
                                        placeholder="Notes to applicant (sent in email)"
                                        onChange={
                                            (e) => {
                                                setApplicantNotes(e.target.value);
                                            }
                                        }
                                    >
                                        {applicantNotes}
                                    </Textarea>
                                    <Textarea
                                        placeholder="Internal PRA notes (not shared)"
                                        onChange={
                                            (e) => {
                                                setInternalNotes(e.target.value);
                                            }
                                        }
                                    >
                                        {internalNotes}
                                    </Textarea>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </SimpleGrid>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                    <Button
                        backgroundColor="orange.300"
                        color="white"
                        variant="ghost"
                        size="lg"
                        onClick={
                            async () => {
                                await reviewMembershipApplication(props.token, membershipApplication.id);
                                props.addAction();
                                onClose();
                            }
                        }
                    >
                        Review
                    </Button>
                    <Button
                        color="red"
                        variant="ghost"
                        size="lg"
                        onClick={
                            async () => {
                                await rejectMembershipApplication(props.token, membershipApplication.id);
                                props.addAction();
                                onClose();
                            }
                        }
                    >
                        Reject
                    </Button>
                    <Button
                        color="green"
                        variant="ghost"
                        size="lg"
                        onClick={
                            async () => {
                                await acceptMembershipApplication(props.token, membershipApplication.id);
                                props.addAction();
                                onClose();
                            }
                        }
                    >
                        Accept
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
