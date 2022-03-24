import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { server } from '../../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('react-gauge-chart', () => 'GaugeChart');

describe('dashboard', () => {
    it('renders correctly', async () => {
        const { asFragment } = render((
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        ));
        await waitFor(() => screen.getByText('Hi, Martin Martian'));
        expect(asFragment()).toMatchSnapshot();
    });
});
