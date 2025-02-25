import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import NavMenu from '../components/NavMenu.jsx';

describe('NavMenu', () => {
  test('renders navigation menu with correct links', () => {
    render(
      <Router>
        <NavMenu />
      </Router>
    );

    // Check if the brand name is in the document
    expect(screen.getByText(/Time Share/i)).toBeInTheDocument();

    // Check if the Login link is in the document
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();

    // Check if the Calendar link is in the document
    expect(screen.getByRole('link', { name: /Calendar/i })).toBeInTheDocument();

    // Check if the Events link is in the document
    expect(screen.getByRole('link', { name: /Events/i })).toBeInTheDocument();
  });
});
 screen.debug();