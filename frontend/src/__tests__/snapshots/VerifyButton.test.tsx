import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import VerifyButton from '../../components/VerifyButton';

describe('VerifyButton component', () => {
    it('renders correctly', () => {
        let button: ReactTestRenderer;
        act(() => {
            button = renderer.create(<VerifyButton verified={true}/>);
        });
        
        expect(button!.toJSON()).toMatchSnapshot();
    });
});
