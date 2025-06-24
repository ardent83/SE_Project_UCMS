import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { db } from '../mocks/db';

vi.mock('../auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: db.student.profile,
    loading: false,
  }),
}));

/**
 * A custom render function for tests that require a router.
 * @param {React.ReactElement} ui - The component you want to test.
 * @param {object} options - Additional configuration options.
 * @param {string} options.initialRoute - The initial route for the router.
 * @param {React.ReactElement} options.routes - A set of <Route> components to define the available routes.
 */

const renderWithRouter = (ui, { initialRoute = '/', routes = <></>, ...renderOptions } = {}) => {
    const Wrapper = ({ children }) => (
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/" element={children} />
                {routes}
            </Routes>
        </MemoryRouter>
    );

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderWithRouter as render };