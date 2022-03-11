import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import DeleteAlert from '../../components/DeleteAlert';

function remove() {
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

describe('delete alert', () => {
    it('renders correctly', () => {
        let modal: ReactTestRenderer;
        act(() => {
            modal = renderer.create(<DeleteAlert isOpen onClose={onClose} removeMethod={remove} />);
        });

        expect(modal!.toJSON).toMatchSnapshot();
    });
});
