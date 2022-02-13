import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import SignUpModal from '../../components/SignUpModal';

function onClose() {
    // a void function
}

it('renders all props correctly', () => {
    const eventAttendees = [
        {
            name: 'testing',
        },
        {
            name: 'testing again',
        },
    ];
    const familyMembers = [
        {
            name: 'testing',
        },
        {
            name: 'testing again',
        },
    ];
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
