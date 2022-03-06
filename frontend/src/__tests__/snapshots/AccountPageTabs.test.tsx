import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import AccountPageTabs from '../../components/AccountPageTabs';

describe('account page tabs', () => {
    it('renders correctly', () => {
        const tabs = renderer.create(
            <BrowserRouter>
                <AccountPageTabs />
            </BrowserRouter>,
        );
        expect(tabs.toJSON()).toMatchSnapshot();
    });
});
