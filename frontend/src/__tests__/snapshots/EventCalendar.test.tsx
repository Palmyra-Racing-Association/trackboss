import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import EventCalendar from '../../components/EventCalendar';

const upcomingEvents = [
    {
        title: 'Test Event',
        start: new Date('2022-02-08T00:10:00'),
        end: new Date('2022-02-09T00:10:00'),
        type: 'Testing',
    },
];

jest.mock('react-big-calendar', () => 'BigCalendar');

it('renders correctly', () => {
    const workPointsCard = renderer.create(
        <BrowserRouter>
            <EventCalendar events={upcomingEvents} />
        </BrowserRouter>,
    ).toJSON();
    expect(workPointsCard).toMatchSnapshot();
});
