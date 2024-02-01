/* eslint-disable max-len */
import React, { useState } from 'react';
import {
    Alert, AlertIcon, Button, Divider, Grid, GridItem, Heading, Link, ListItem, Modal, ModalContent, ModalFooter,
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
    const { membershipApplication, isOpen, onClose } = props;

    const [applicantNotes, setApplicantNotes] = useState<string>(membershipApplication.sharedNotes || '');
    const [internalNotes, setInternalNotes] = useState<string>(membershipApplication.internalNotes || '');
    const isInReview = (membershipApplication.status === 'Review');

    return (
        <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent m={3}>
                <Heading ml={3}>
                    Application -
                    &nbsp;
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
                                    {membershipApplication.receivedDate.toString()}
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
                                    <Text>Notes to applicant (emailed to applicant)</Text>
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
                                    <Text>Internal PRA Notes (not shared)</Text>
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
                    <Alert status="warning">
                        <AlertIcon />
                        Clicking the Accept or Reject buttons sends emails to the applicant, and also finalizes their
                        application status.
                    </Alert>
                </SimpleGrid>
                <ModalFooter>
                    <Grid templateColumns="repeat(3, 2fr)" gap={3}>
                        <GridItem>
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
                        </GridItem>
                        <GridItem>
                            <Button
                                backgroundColor="orange.300"
                                color="white"
                                variant="ghost"
                                size="lg"
                                disabled={!isInReview}
                                onClick={
                                    async () => {
                                        await reviewMembershipApplication(props.token, membershipApplication.id, internalNotes, applicantNotes);
                                        props.addAction();
                                        onClose();
                                    }
                                }
                            >
                                Review
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Button
                                color="red"
                                variant="ghost"
                                size="lg"
                                disabled={!isInReview}
                                onClick={
                                    async () => {
                                        await rejectMembershipApplication(props.token, membershipApplication.id, internalNotes, applicantNotes);
                                        props.addAction();
                                        onClose();
                                    }
                                }
                            >
                                Reject
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Button
                                color="green"
                                variant="ghost"
                                size="lg"
                                disabled={!isInReview}
                                onClick={
                                    async () => {
                                        await acceptMembershipApplication(props.token, membershipApplication.id, internalNotes, applicantNotes);
                                        props.addAction();
                                        onClose();
                                    }
                                }
                            >
                                Accept
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Button
                                color="green"
                                size="lg"
                                variant="ghost"
                                disabled={!isInReview}
                                onClick={
                                    async () => {
                                        await acceptMembershipApplication(props.token, membershipApplication.id, internalNotes, applicantNotes, true);
                                        props.addAction();
                                        onClose();
                                    }
                                }
                            >
                                Accept as Guest
                            </Button>
                        </GridItem>
                    </Grid>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
