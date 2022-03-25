import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberSummaryModal from '../../components/MemberSummaryModal';
import { Member } from '../../../../src/typedefs/member';

function onClose() {
    // void function
}

const member: Member = {
    memberId: 1,
    memberTypeId: 1,
    membershipId: 1,
    firstName: 'Squeak',
    lastName: 'Trainywhel',
    membershipAdmin: 'Squeak Trainywhel',
    uuid: '',
    active: true,
    memberType: 'admin',
    phoneNumber: '1234',
    email: 'user@example.com',
    occupation: 'secretary',
    birthdate: '',
    dateJoined: '',
    address: '',
    city: '',
    state: '',
    zip: '',
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
    it('renders all props correctly', () => {
        const modal = render(
            <BrowserRouter>
                <MemberSummaryModal
                    isOpen
                    onClose={onClose}
                    memberInfo={member}
                />
                ,
            </BrowserRouter>,

        );
        expect(modal).toMatchSnapshot();
    });
});
