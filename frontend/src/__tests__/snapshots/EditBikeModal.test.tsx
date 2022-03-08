import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Bike } from '../../../../src/typedefs/bike';
import EditBikeModal from '../../components/EditBikeModal';

function edit() {
    // void function
}

function onClose() {
    // void function
}

const bike: Bike = {
    bikeId: 1,
    membershipAdmin: 'me',
    year: '2000',
    make: 'Honda',
    model: '250',
};

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('edit bike modal', () => {
    it('renders correctly', () => {
        const header = renderer.create(
            <BrowserRouter>
                <EditBikeModal bikeToEdit={bike} isOpen onClose={onClose} editBike={edit} />
            </BrowserRouter>,
        ).toJSON();
        expect(header).toMatchSnapshot();
    });
});
