import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import MemberSummaryModal from '../../components/MemberSummaryModal';
import { Member } from '../../../../src/typedefs/member';
import { Bike } from '../../../../src/typedefs/bike';

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

describe('member summary modal', () => {
    it('renders all props correctly', () => {
        const modal = renderer.create(
            <MemberSummaryModal memberInfo={member} memberFamily={memberFamily} memberBikes={memberBikes} />,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });
});
