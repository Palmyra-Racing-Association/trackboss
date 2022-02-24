import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MemberList from '../../components/MemberList';

describe('Member List component', () => {
    it('renders correctly', () => {
        let list: TestRenderer;
        act(() => {
            list = renderer.create(<MemberList />);
        });
        
        expect(list!.toJSON()).toMatchSnapshot();
    });
});
