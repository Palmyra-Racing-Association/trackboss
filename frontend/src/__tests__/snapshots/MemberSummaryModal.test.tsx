import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberSummaryModal from '../../components/MemberSummaryModal';
import { Member } from '../../../../src/typedefs/member';
import { server } from '../../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function onClose() {
    // void function
}

const member: Member = {
    memberId: 1,
    membershipId: 1,
    memberTypeId: 1,
    firstName: 'Squeak',
    lastName: 'Trainywhel',
    membershipAdmin: 'Squeak Trainywhel',
    uuid: '',
    active: true,
    memberType: 'Admin',
    phoneNumber: '223-321-4438',
    occupation: 'Software Engineer',
    email: 'squeaky@trainingwheels.com',
    birthdate: '1981-08-13',
    dateJoined: '2016-10-18',
    address: '25 Laurel Hill',
    city: 'North Las Vegas',
    state: 'NV',
    zip: '59294',
    lastModifiedDate: '',
    lastModifiedBy: '',
};

// Necessary to mock the chakra-ui modal portal, so that the renderer can target the modal instead of the page
const divWithChildrenMock = (children: any, identifier: any) => <div data-testId={identifier}>{children}</div>;
jest.mock('@chakra-ui/react', () => (
    {
        ...jest.requireActual('@chakra-ui/react'),
        PortalManager: jest.fn(({ children }) => divWithChildrenMock(children, 'portal')),
    }
));

describe('member summary modal', () => {
    it('renders all props correctly', async () => {
        const { asFragment } = render((
            <BrowserRouter>
                <MemberSummaryModal
                    isOpen
                    onClose={onClose}
                    memberInfo={member}
                />
            </BrowserRouter>
        ));
        await waitFor(() => screen.getByText('Squeak Trainywhel (you)'));
        expect(asFragment()).toMatchSnapshot();
    });
});
