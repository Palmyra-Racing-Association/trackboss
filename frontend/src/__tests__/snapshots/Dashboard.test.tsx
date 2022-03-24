import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { server } from '../../mocks/server';

jest.mock('react-gauge-chart', () => 'GaugeChart');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('dashboard', () => {
    it('renders correctly', async () => {
        const { asFragment } = render((
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        ));
        await waitFor(() => screen.getByText('!'));
        expect(asFragment()).toMatchSnapshot();
    });
});
