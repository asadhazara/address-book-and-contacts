import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import AddressBook from '.';

const setup = () => {
  const wrapper = render(<AddressBook />);

  return { wrapper };
};

test('renders the correct content', () => {
  const {
    wrapper: { getByText, getByLabelText },
  } = setup();

  getByText(/ADDRESS BOOK/i);
  getByText('Work');
  getByText('Private');
  getByLabelText('Add Contact');
});

test('allows users to add contacts', () => {
  const {
    wrapper: { getByLabelText, getByText },
  } = setup();

  const addButton = getByLabelText('Add Contact');

  fireEvent.click(addButton);
  getByText('Save');
});

test('allows users to change status filter', () => {
  const {
    wrapper: { getByText },
  } = setup();

  const privateStatusButton = getByText('Private');

  expect(privateStatusButton).not.toHaveClass('Button--success');
  fireEvent.click(privateStatusButton);
  expect(privateStatusButton).toHaveClass('Button--success');
});
