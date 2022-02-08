import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Dashboard  from '../../pages/Dashboard';
import WorkPointsCard from '../../components/WorkPointsCard';

jest.mock('react-gauge-chart', () => {
    return {
      'default': 'GaugeChart'
    }
  });


it('renders correctly', () => {
    const dash = renderer.create(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>,
    ).toJSON();
    expect(dash).toMatchSnapshot();
});