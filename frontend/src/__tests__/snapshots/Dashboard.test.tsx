import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Dashboard from '../../pages/Dashboard';

jest.mock('react-gauge-chart', () => 'GaugeChart');

it('renders correctly', () => {
    const dash = renderer.create(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>,
    ).toJSON();
    expect(dash).toMatchSnapshot();
});
