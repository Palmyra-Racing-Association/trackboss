import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import WorkPointsCard from '../../components/WorkPointsCard';

jest.mock('react-gauge-chart', () => 'GaugeChart');

describe('workpoints card', () => {
    it('renders correctly', () => {
        const workPointsCard = renderer.create(
            <BrowserRouter>
                <WorkPointsCard percent={67} />
            </BrowserRouter>,
        ).toJSON();
        expect(workPointsCard).toMatchSnapshot();
    });
});
