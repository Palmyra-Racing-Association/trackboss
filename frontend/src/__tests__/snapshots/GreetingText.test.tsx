import React from 'react';
import renderer from 'react-test-renderer';
import GreetingText from '../../components/GreetingText';

it('renders correctly', () => {
    const greetingText = renderer.create(
        <GreetingText name="Martin" />,
    ).toJSON();
    expect(greetingText).toMatchSnapshot();
});
