import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import WorkPointsCard from '../../components/WorkPointsCard';
import GaugeChart from 'react-gauge-chart';

jest.mock('react-gauge-chart', () => 'GaugeChart');


it('renders correctly', () => {
    const workPointsCard = renderer.create(
            <WorkPointsCard percent={67} />
    ).toJSON();
    expect(workPointsCard).toMatchSnapshot();
});