import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import 'jest-location-mock';
import { App, AppWrapper } from '../../App';

jest.mock('react-gauge-chart', () => 'GaugeChart');

describe('AppWrapper', () => {
    it('renders correctly', () => {
        let appWrapper: ReactTestRenderer;
        act(() => {
            appWrapper = create(
                <BrowserRouter>
                    <AppWrapper />
                </BrowserRouter>,
            );
        });
        expect(appWrapper!.toJSON()).toMatchSnapshot();
    });
});

describe('App', () => {
    it('redirects correctly', () => {
        expect(window.location.href).toBe('http://localhost/');
        act(() => {
            create(
                <BrowserRouter>
                    <App />
                </BrowserRouter>,
            );
        });
        expect(window.location.href).toBe(
            // eslint-disable-next-line max-len
            `${process.env.REACT_APP_AUTH_URL}/login?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=email+openid+phone&redirect_uri=http://localhost`,
        );
    });

    it('correctly parses a key after a redirect', () => {
        window.location.hash = 'id_token=testing.tok.en&auth_token=iamanauthtoken&expires_in=3600&token_type=Bearer';
        let app: ReactTestRenderer;
        act(() => {
            app = create(
                <BrowserRouter>
                    <App />
                </BrowserRouter>,
            );
        });
        expect(app!.toJSON).toMatchSnapshot();
    });
});
