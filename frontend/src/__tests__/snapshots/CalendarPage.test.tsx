import { Box } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Header from '../../components/Header';
import Dashboard from '../../pages/Dashboard';
import EventCalendar from '../../components/EventCalendar';

const upcomingEvents = [
    {
        title: 'Test Event',
        start: new Date('2022-02-08T00:10:00'),
        end: new Date('2022-02-09T00:10:00'),
        type: 'Testing',
    },
];
jest.mock('../../components/EventCalendar', () => 'EventCalendar');

describe('calendar page', () => {
    it('renders correctly', () => {
        const cal = renderer.create(
            <BrowserRouter>
                <Header title="Calendar" activeButtonId={2} />
            <Box pl={20} pr={20} pt={20}>
                <EventCalendar events={upcomingEvents} />
            </Box>
            </BrowserRouter>,
        ).toJSON();
        expect(cal).toMatchSnapshot();
    });
});
