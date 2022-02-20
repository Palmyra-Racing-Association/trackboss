import React from 'react';
import renderer from 'react-test-renderer';
import CreateEventModal from '../../components/CreateEventModal';
import '@testing-library/jest-dom/extend-expect';

Date.now = jest.fn(() => 1487076708000)

it('renders all props correctly', () => {
    const modal = renderer.create(
        <CreateEventModal />,
    ).toJSON();
    expect(modal).toMatchSnapshot();
});
