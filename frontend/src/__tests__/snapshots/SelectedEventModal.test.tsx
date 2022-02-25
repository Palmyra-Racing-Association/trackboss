import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import SelectedEventModal from '../../components/SelectedEventModal';

function onViewEventClose() {
    // a void function
}

function onSignUpOpen() {
    // a void function
}

const selectedEvent = {
    title: 'Race Day',
    start: new Date('2022-02-11T03:10:00'),
    end: new Date('2022-02-12T14:10:00'),
    type: 'race',
};

describe('selected event modal', () => {
    it('renders all props correctly as admin', () => {
        const modal = renderer.create(
            <SelectedEventModal
                isOpen
                onClose={onViewEventClose}
                selectedEvent={selectedEvent}
                onSignUpOpen={onSignUpOpen}
                admin
            />,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });

    it('renders all props correctly as not admin', () => {
        const modal = renderer.create(
            <BrowserRouter>
                <SelectedEventModal
                    isOpen
                    onClose={onViewEventClose}
                    selectedEvent={selectedEvent}
                    onSignUpOpen={onSignUpOpen}
                    admin={false}
                />
            </BrowserRouter>,
        ).toJSON();
        expect(modal).toMatchSnapshot();
    });
});
