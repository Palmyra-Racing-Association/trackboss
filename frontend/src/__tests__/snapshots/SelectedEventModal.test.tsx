import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
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

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('selected event modal', () => {
    it('renders all props correctly as admin', () => {
        const modal = render(
            <BrowserRouter>
                <SelectedEventModal
                    isOpen
                    onClose={onViewEventClose}
                    selectedEvent={selectedEvent}
                    onSignUpOpen={onSignUpOpen}
                    admin
                />
            </BrowserRouter>,
        );
        expect(modal).toMatchSnapshot();
    });

    it('renders all props correctly as not admin', () => {
        const modal = render(
            <BrowserRouter>
                <SelectedEventModal
                    isOpen
                    onClose={onViewEventClose}
                    selectedEvent={selectedEvent}
                    onSignUpOpen={onSignUpOpen}
                    admin={false}
                />
            </BrowserRouter>,
        );
        expect(modal).toMatchSnapshot();
    });
});
