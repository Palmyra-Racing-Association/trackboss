import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import SignUpPage from '../../pages/SignUpPage';

describe('SignUp page', () => {
    it('renders correctly', () => {
        let list: ReactTestRenderer;
        act(() => {
            list = renderer.create(
                <BrowserRouter>
                    <SignUpPage />
                </BrowserRouter>,
            );
        });
        expect(list!.toJSON()).toMatchSnapshot();
    });
});
