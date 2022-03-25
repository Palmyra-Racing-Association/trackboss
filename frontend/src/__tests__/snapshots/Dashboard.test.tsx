import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { server } from '../../mocks/server';
import { UserContext } from '../../contexts/UserContext';
import { Member } from '../../../../src/typedefs/member';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function update() {
    // void function
}

const user: Member = {
    membershipId: 1,
    memberId: 7,
    membershipAdmin: 'Some Guy',
    uuid: 'someUuid',
    active: true,
    memberType: 'Admin',
    firstName: 'Martin',
    lastName: 'Martian',
    phoneNumber: '000-000-0000',
    occupation: 'Champion Fake Man',
    email: 'fake@man.com',
    birthdate: '1997-08-13',
    dateJoined: '2020-01-01',
    address: '1 Street Way',
    city: 'Rochester',
    state: 'NY',
    zip: '14467',
    lastModifiedDate: '2020-01-01',
    lastModifiedBy: 'Some Guy',
};

const context = { loggedIn: true, token: 'TestToken', user, storedUser: undefined };

jest.mock('react-gauge-chart', () => 'GaugeChart');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('dashboard', () => {
    it('renders correctly', async () => {
        const { asFragment } = render(
            <BrowserRouter>
                {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
                <UserContext.Provider value={{ state: context, update }}>
                    <Dashboard />
                </UserContext.Provider>
            </BrowserRouter>,
        );
        await waitFor(() => screen.getByText('Martin Martian'));
        expect(asFragment()).toMatchSnapshot();
    });
});
