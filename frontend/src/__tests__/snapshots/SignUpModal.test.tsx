import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import SignUpModal from '../../components/FamilySignUpModal';

function onClose() {
    // a void function
}

const eventAttendees = [
    {
        member_id: 1,
        name: 'testing',
    },
    {
        member_id: 2,
        name: 'testing again',
    },
];
const familyMembers = [
    {
        member_id: 1,
        name: 'testing',
    },
    {
        member_id: 2,
        name: 'testing again',
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

describe('sign up modal', () => {
    it('renders all props correctly', () => {
        const modal = render(
            <SignUpModal
                isOpen
                onClose={onClose}
                attendeesList={eventAttendees}
                familyMembers={familyMembers}
            />,
        );
        expect(modal).toMatchSnapshot();
    });
});
