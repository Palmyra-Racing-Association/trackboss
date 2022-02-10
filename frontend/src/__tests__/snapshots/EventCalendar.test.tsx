/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Calendar, momentLocalizer, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';
import EventCalendar from '../../components/EventCalendar';

const upcomingEvents = [
    {
        title: 'Test Event',
        start: new Date('2022-02-08T00:10:00'),
        end: new Date('2022-02-09T00:10:00'),
        type: 'Testing',
    },
];

jest.mock('react-big-calendar', () => 'Calendar');
jest.mock('react-big-calendar', () => 'momentLocalizer');
// jest.mock('react-big-calendar', () => ({ momentLocalizer: jest.fn(() => DateLocalizer) }));

it('renders correctly', () => {
    const workPointsCard = renderer.create(
        <BrowserRouter>
            <EventCalendar events={upcomingEvents} />
        </BrowserRouter>,
    ).toJSON();
    expect(workPointsCard).toMatchSnapshot();
});
