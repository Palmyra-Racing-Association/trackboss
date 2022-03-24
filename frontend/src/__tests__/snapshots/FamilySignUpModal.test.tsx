import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import FamilySignUpModal from '../../components/FamilySignUpModal';
import { Member } from '../../../../src/typedefs/member';
import { PatchJobRequest } from '../../../../src/typedefs/job';
import { Event } from '../../../../src/typedefs/event';

function onClose() {
    // a void function
}

const memberFamily: Member[] = [
    {
        membershipId: 1,
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
        membershipId: 1,
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

async function signUpForJob(patchInfo: { jobId: number, editedJob: PatchJobRequest }) {
    console.log(patchInfo);
}

const selectedEvent: Event = {
    eventId: 1,
    start: 'test',
    end: 'test',
    eventType: 'test',
    title: 'test',
    eventDescription: 'test',
};

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('sign up modal', () => {
    it('renders all props correctly', () => {
        const modal = render(
            <FamilySignUpModal
                isOpen
                onClose={onClose}
                familyMembers={memberFamily}
                selectedEvent={selectedEvent}
                signUpForJob={signUpForJob}
            />,
        );
        expect(modal).toMatchSnapshot();
    });
});
