import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { db } from '../mocks/db';

vi.mock('../auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: db.student.profile,
    loading: false,
  }),
}));

const AllTheProviders = ({ children }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };