import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import SignUpModal from '../../components/SignUpModal';

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

describe('sign up modal', () => {
    it('renders all props correctly', () => {
        const modal = renderer.create(
            <SignUpModal
                isOpen
                onClose={onClose}
                attendeesList={eventAttendees}
                familyMembers={familyMembers}
            />,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });
});
