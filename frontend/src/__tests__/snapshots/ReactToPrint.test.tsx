import React from 'react';
import renderer from 'react-test-renderer';
import ReactToPrint from '../../components/ReactToPrint';

describe('React to print component', () => {
    it('renders correctly', () => {
        const reactToPrint = renderer.create(
            <ReactToPrint />,
        ).toJSON();
        expect(reactToPrint).toMatchSnapshot();
    });
});
