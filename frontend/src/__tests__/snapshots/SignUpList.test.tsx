import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import SignUpList from '../../components/SignUpList';

describe('SignUpList component', () => {
    it('renders correctly', () => {
        let list: ReactTestRenderer;
        act(() => {
            list = renderer.create(<SignUpList eventId="1" />);
        });
        expect(list!.toJSON()).toMatchSnapshot();
    });
});
