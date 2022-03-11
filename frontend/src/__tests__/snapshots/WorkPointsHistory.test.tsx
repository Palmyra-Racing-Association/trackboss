import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import WorkPointsHistory from '../../components/WorkPointsHistory';

describe('work points history', () => {
    it('renders all props correctly', () => {
        const header = renderer.create(
            <BrowserRouter>
                <WorkPointsHistory />
            </BrowserRouter>,
        ).toJSON();
        expect(header).toMatchSnapshot();
    });
});
