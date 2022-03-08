import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import FamilyAndBikes from '../../components/FamilyAndBikes';
import { Member } from '../../../../src/typedefs/member';
import { Bike } from '../../../../src/typedefs/bike';

const memberFamily: Member[] = [
    {
        memberId: 1,
        membershipAdmin: 'true',
        active: true,
        memberType: 'admin',
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: '1',
        email: 'user@example.com',
        uuid: '',
        occupation: '',
        birthdate: '',
        dateJoined: 'August 12, 2006',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    },
    {
        memberId: 2,
        membershipAdmin: 'true',
        active: true,
        memberType: 'admin',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '2',
        email: 'user@example.com',
        uuid: '',
        occupation: '',
        birthdate: '',
        dateJoined: 'August 12, 2006',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    },
];

const memberBikes: Bike[] = [
    {
        bikeId: 1,
        year: '2012',
        make: 'honda',
        model: 'rust-bucket',
        membershipAdmin: 'string',
    },
    {
        bikeId: 2,
        year: '2022',
        make: 'yamaha',
        model: '',
        membershipAdmin: 'string',
    },
];

describe('family and bikes', () => {
    it('renders all props correctly as admin', () => {
        let component: ReactTestRenderer;
        act(() => {
            component = renderer.create(<FamilyAndBikes memberBikes={memberBikes} memberFamily={memberFamily} admin />);
        });

        expect(component!.toJSON).toMatchSnapshot();
    });

    it('renders all props correctly as not admin', () => {
        let component: ReactTestRenderer;
        act(() => {
            component = renderer.create(
                <FamilyAndBikes
                    memberBikes={memberBikes}
                    memberFamily={memberFamily}
                    admin={false}
                />,
            );
        });

        expect(component!.toJSON).toMatchSnapshot();
    });
});
