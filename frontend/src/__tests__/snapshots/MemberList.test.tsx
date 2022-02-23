import React from 'react';
import renderer from 'react-test-renderer';
import MemberList from '../../components/MemberList';

describe('Member List component', () => {
    it('renders correctly', () => {
        const list = renderer.create(<MemberList />).toJSON();
        expect(list).toMatchSnapshot();
    });
});
