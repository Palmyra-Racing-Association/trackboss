import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, create } from 'react-test-renderer';
import 'jest-location-mock';
import ReactDOM, { render } from 'react-dom';
import { App, AppWrapper } from '../../App';

jest.mock('react-gauge-chart', () => 'GaugeChart');

let container: Node | null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    if (container !== null) {
        document.body.removeChild(container);
    }
    container = null;
});

describe('AppWrapper', () => {
    it('renders correctly', () => {
        const appWrapper = create(
            <BrowserRouter>
                <AppWrapper />
            </BrowserRouter>,
        ).toJSON();
        expect(appWrapper).toMatchSnapshot();
    });
});

describe('App', () => {
    it('redirects correctly', () => {
        expect(window.location.href).toBe('http://localhost/');
        create(
            <BrowserRouter>
                <App />
            </BrowserRouter>,
        );
        expect(window.location.href).toBe(
            // eslint-disable-next-line max-len
            `${process.env.REACT_APP_AUTH_URL}/login?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=email+openid+phone&redirect_uri=${window.location.origin}`
        );
    });

    it('correctly parses a key after a redirect', () => {
        window.location.hash = 'id_token=testing.tok.en&auth_token=iamanauthtoken&expires_in=3600&token_type=Bearer';
        act(() => {
            render(<App />, container);
        });
    });
});
