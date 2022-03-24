import React from 'react';
import { waitFor, screen, render } from '@testing-library/react';
import MemberList from '../../components/MemberList';
import { server } from '../../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Member List component', () => {
    it('renders correctly', async () => {
        const { asFragment } = render((
            <MemberList />
        ));
        await waitFor(() => screen.getByText('Name'));
        expect(asFragment()).toMatchSnapshot();
    });
});
