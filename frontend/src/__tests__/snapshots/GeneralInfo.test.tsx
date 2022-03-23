import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import GeneralInfo from '../../components/GeneralInfo';
import { Member } from '../../../../src/typedefs/member';

const member: Member = {
    memberId: 1,
    membershipAdmin: 'true',
    active: true,
    memberType: 'Admin',
    firstName: 'test',
    lastName: 'member',
    phoneNumber: '1234',
    email: 'user@example.com',
    uuid: '',
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

const nonAdminMember: Member = {
    memberId: 1,
    membershipAdmin: 'true',
    active: true,
    memberType: 'user',
    firstName: 'test',
    lastName: 'member',
    phoneNumber: '1234',
    email: 'user@example.com',
    uuid: '',
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

describe('general info', () => {
    it('renders all props correctly as admin', () => {
        const modal = render(
            <GeneralInfo user={member} />,
        );
        expect(modal).toMatchSnapshot();
    });

    it('renders all props correctly as not admin', () => {
        const modal = render(
            <GeneralInfo user={nonAdminMember} />,
        );
        expect(modal).toMatchSnapshot();
    });
});
