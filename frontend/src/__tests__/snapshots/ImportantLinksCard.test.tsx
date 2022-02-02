import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ImportantLinksCard from '../../components/ImportantLinksCard';

it('renders correctly for Dashboard', () => {
    const importantLinksCard = renderer.create(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(importantLinksCard).toMatchSnapshot();
});
