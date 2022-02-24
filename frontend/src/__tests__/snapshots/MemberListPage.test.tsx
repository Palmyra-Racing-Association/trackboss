import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import MemberListPage from '../../pages/MemberListPage';

describe('Member List Page', () => {
    it('renders correctly', () => {
        let page;
        act(() => {
            page = renderer.create(
                <BrowserRouter>
                    <MemberListPage />
                </BrowserRouter>,
            );
        });
        expect(page.toJSON()).toMatchSnapshot();
    });
});
