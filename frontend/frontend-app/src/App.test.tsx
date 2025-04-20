import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./api/products', () => ({
  getProducts: jest.fn().mockResolvedValue([]),
  getProductById: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: () => <div>Route Component</div>,
  Navigate: () => <div>Navigate Component</div>
}));

describe('App', () => {
  test('renders app with router components', () => {
    render(<App />);
    expect(screen.getAllByText('Route Component').length).toBeGreaterThan(0);
  });
});
