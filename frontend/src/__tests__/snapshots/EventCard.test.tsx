import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import EventCard from '../../components/EventCard';
import '@testing-library/jest-dom/extend-expect';

describe('event card', () => {
    it('renders all props correctly', () => {
        const header = renderer.create(
            <BrowserRouter>
                <EventCard date="Dec 19th" name="pick rocks, kid" />
            </BrowserRouter>,
        ).toJSON();
        expect(header).toMatchSnapshot();
    });
});
