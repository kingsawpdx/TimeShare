import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage.jsx';

describe('HomePage', () => {
  test('renders login form', () => {
    render(<HomePage />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays an error message when fields are empty', () => {
    render(<HomePage />);

    const loginButton = screen.getByRole('button', { name: /login/i });

    // Submit the form without filling out the fields
    fireEvent.click(loginButton);

    // Check if the error message is displayed
    expect(
      screen.getByText(/please fill out both fields\./i)
    ).toBeInTheDocument();
  });

  test('does not display an error message when fields are filled', () => {
    render(<HomePage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill out the form fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Submit the form
    fireEvent.click(loginButton);

    // Check if the error message is not displayed
    expect(
      screen.queryByText(/please fill out both fields\./i)
    ).not.toBeInTheDocument();
  });
});
