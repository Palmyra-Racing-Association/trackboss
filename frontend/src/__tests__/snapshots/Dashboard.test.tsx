import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import Dashboard from '../../pages/Dashboard';

jest.mock('react-gauge-chart', () => 'GaugeChart');

describe('dashboard', () => {
    it('renders correctly', () => {
        let dash: ReactTestRenderer;
        act(() => {
            dash = renderer.create(
                <BrowserRouter>
                    <Dashboard />
                </BrowserRouter>,
            );
        });
        expect(dash!.toJSON()).toMatchSnapshot();
    });
});
