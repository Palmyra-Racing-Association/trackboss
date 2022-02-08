import React from 'react';
import renderer from 'react-test-renderer';
import WorkPointsCard from '../../components/WorkPointsCard';

jest.mock('react-gauge-chart', () => 'GaugeChart');

it('renders correctly', () => {
    const workPointsCard = renderer.create(
            <WorkPointsCard percent={67} />
    ).toJSON();
    expect(workPointsCard).toMatchSnapshot();
});