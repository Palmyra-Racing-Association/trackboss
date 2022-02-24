import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import MemberSummaryModal from '../../components/MemberSummaryModal';
import { Member } from '../../../../src/typedefs/member';
import { Bike } from '../../../../src/typedefs/bike';

function onClose() {
    // void function
}

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

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('member summary modal', () => {
    it('renders all props correctly', () => {
        const modal = render(
            <MemberSummaryModal
                isOpen
                onClose={onClose}
                memberInfo={member}
                memberFamily={memberFamily}
                memberBikes={memberBikes}
            />,
        );
        expect(modal).toMatchSnapshot();
    });
});
