import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ImportantLinksCard from '../../components/ImportantLinksCard';

it('header renders correctly', () => {
    render(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(screen.getByText('Important Links')).toBeInTheDocument();
});

it('member rules link renders correctly', () => {
    render(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(screen.getByText('Member Rules').closest('a'))
        .toHaveAttribute('href', 'https://palmyramx.com/pages/track-rules');
});

it('palmyra racing twitter link renders correctly', () => {
    render(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(screen.getByText('Twitter').closest('a'))
        .toHaveAttribute('href', 'https://twitter.com/palmyramx');
});

it('palmyra racing facebook link renders correctly', () => {
    render(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(screen.getByText('Facebook').closest('a'))
        .toHaveAttribute('href', 'https://www.facebook.com/palmyramx/');
});

it('palmyra racing instagram link renders correctly', () => {
    render(
        <BrowserRouter>
            <ImportantLinksCard />
        </BrowserRouter>,
    );
    expect(screen.getByText('Instagram').closest('a'))
        .toHaveAttribute('href', 'https://www.instagram.com/palmyramx_hogback_hill/?hl=en');
});
