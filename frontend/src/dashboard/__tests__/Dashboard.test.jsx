import React from 'react';
import { render, screen } from '../../utils/test-utils';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import Dashboard from '../Dashboard';
import { server } from '../../mocks/server';
import { db } from '../../mocks/db';

describe('Dashboard Component', () => {
  test('should render all sections with correct data for a student', async () => {
    render(<Dashboard />);

    const firstClassTitle = db.student.classes.items[0].title;
    expect(await screen.findAllByText(firstClassTitle)).not.toHaveLength(0);

    const firstExerciseTitle = db.student.exercises['1'][0].title;
    expect(await screen.findByText(firstExerciseTitle)).toBeInTheDocument();
    
    const firstProjectTitle = db.student.projects[0].title;
    expect(await screen.findByRole('cell', { name: firstProjectTitle })).toBeInTheDocument();
  });

  test('should display an error message if the API fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      http.get('*/api/StudentClass/Student/classes', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<Dashboard />);

    expect(await screen.findByText('خطا در بارگذاری کلاس‌ها')).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});