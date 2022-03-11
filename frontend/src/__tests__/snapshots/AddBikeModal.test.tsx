import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import AddBikeModal from '../../components/AddBikeModal';

function add() {
    // void function
}

function onClose() {
    // void function
}

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('add bike modal', () => {
    it('renders correctly', () => {
        const header = renderer.create(
            <BrowserRouter>
                <AddBikeModal isOpen onClose={onClose} addBike={add} />
            </BrowserRouter>,
        ).toJSON();
        expect(header).toMatchSnapshot();
    });
});
