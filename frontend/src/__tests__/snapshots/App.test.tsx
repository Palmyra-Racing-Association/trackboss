import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { AppWrapper } from '../../App';

jest.mock('react-gauge-chart', () => 'GaugeChart');

describe('AppWrapper', () => {
    it('renders correctly', () => {
        const appWrapper = renderer.create(
            <BrowserRouter>
                <AppWrapper />
            </BrowserRouter>,
        ).toJSON();
        expect(appWrapper).toMatchSnapshot();
    });
});
