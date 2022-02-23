import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import MemberSummaryModal from '../components/MemberSummaryModal';
import { Member } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import MemberList from '../components/MemberList';

const member: Member = {
    memberId: 1,
    membershipAdmin: 'true',
    active: true,
    memberType: 'admin',
    firstName: 'test',
    lastName: 'member',
    phoneNumber: '1234',
    email: 'user@example.com',
    uuid: '',
    occupation: 'secretary',
    birthdate: '',
    dateJoined: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    lastModifiedDate: '',
    lastModifiedBy: '',
};

const memberFamily: Member[] = [
    {
        memberId: 1,
        membershipAdmin: 'true',
        active: true,
        memberType: 'member',
        firstName: 'test',
        lastName: 'member',
        phoneNumber: '1234',
        email: 'user@example.com',
        uuid: '',
        occupation: '',
        birthdate: '',
        dateJoined: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    },
    {
        memberId: 2,
        membershipAdmin: 'string',
        active: true,
        memberType: 'member',
        firstName: 'Jon',
        lastName: 'Smith',
        phoneNumber: '1234',
        email: 'user@example.com',
        uuid: '',
        occupation: '',
        birthdate: '',
        dateJoined: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    },
];

const memberBikes: Bike[] = [
    {
        bikeId: 0,
        year: '2012',
        make: 'honda',
        model: 'shitbox',
        membershipAdmin: 'string',
    },
];

function MemberListPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <MemberSummaryModal memberInfo={member} memberFamily={memberFamily} memberBikes={memberBikes} />
            <Box pt="3em">
                <MemberList />
            </Box>
        </ChakraProvider>
    );
}

export default MemberListPage;
