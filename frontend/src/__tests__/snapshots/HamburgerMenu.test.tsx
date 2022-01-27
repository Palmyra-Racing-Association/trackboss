import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import HamburgerMenu from '../../components/HamburgerMenu';

it('renders correctly with no page selected', () => {
    const menu = renderer.create(
        <BrowserRouter>
            <HamburgerMenu activeButtonId={0} />
        </BrowserRouter>,
    ).toJSON();
    expect(menu).toMatchSnapshot();
});

it('renders correctly with Dashboard selected', () => {
    const menu = renderer.create(
        <BrowserRouter>
            <HamburgerMenu activeButtonId={1} />
        </BrowserRouter>,
    ).toJSON();
    expect(menu).toMatchSnapshot();
});

it('renders correctly with Calendar selected', () => {
    const menu = renderer.create(
        <BrowserRouter>
            <HamburgerMenu activeButtonId={2} />
        </BrowserRouter>,
    ).toJSON();
    expect(menu).toMatchSnapshot();
});

it('renders correctly with Members selected', () => {
    const menu = renderer.create(
        <BrowserRouter>
            <HamburgerMenu activeButtonId={3} />
        </BrowserRouter>,
    ).toJSON();
    expect(menu).toMatchSnapshot();
});

it('renders correctly with My Account selected', () => {
    const menu = renderer.create(
        <BrowserRouter>
            <HamburgerMenu activeButtonId={4} />
        </BrowserRouter>,
    ).toJSON();
    expect(menu).toMatchSnapshot();
});
