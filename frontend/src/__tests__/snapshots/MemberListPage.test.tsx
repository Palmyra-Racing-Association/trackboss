import React from 'react';
import { waitFor, screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberListPage from '../../pages/MemberListPage';

describe('Member List Page', () => {
    it('renders correctly', async () => {
        const { asFragment } = render((
            <BrowserRouter>
                <MemberListPage />
            </BrowserRouter>
        ));
        await waitFor(() => screen.getByText('Name'));
        expect(asFragment()).toMatchSnapshot();
    });
});
