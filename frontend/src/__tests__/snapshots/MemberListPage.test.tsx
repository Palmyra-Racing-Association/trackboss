import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import MemberListPage from '../../pages/MemberListPage';

describe('Member List Page', () => {
    it('renders correctly', () => {
        const page = renderer.create(
            <BrowserRouter>
                <MemberListPage />
            </BrowserRouter>
        ).toJSON();
        expect(page).toMatchSnapshot();
    });
});