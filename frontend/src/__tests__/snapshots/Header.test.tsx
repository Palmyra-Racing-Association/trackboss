import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Header from '../../components/Header';

it("renders correctly for Dashboard", () => {
    const header = renderer.create(
        <BrowserRouter>
            <Header title='Dashboard' activeButtonId={1}/>
        </BrowserRouter>
    ).toJSON();
    
    expect(header).toMatchSnapshot();
});

it("renders correctly for Calendar", () => {
    const header = renderer.create(
        <BrowserRouter>
            <Header title='Calendar' activeButtonId={2}/>
        </BrowserRouter>
    ).toJSON();
    
    expect(header).toMatchSnapshot();
});

it("renders correctly for Member List", () => {
    const header = renderer.create(
        <BrowserRouter>
            <Header title='Members' activeButtonId={3}/>
        </BrowserRouter>
    ).toJSON();
    
    expect(header).toMatchSnapshot();
});

it("renders correctly for Settings", () => {
    const header = renderer.create(
        <BrowserRouter>
            <Header title='General Info' activeButtonId={4}/>
        </BrowserRouter>
    ).toJSON();
    
    expect(header).toMatchSnapshot();
});
