import React from 'react';
import { render, screen, within } from '../../utils/test-utils'; 
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';

import Dashboard from '../Dashboard';
import { server } from '../../mocks/server';
import { db } from '../../mocks/db';

describe('Dashboard Component', () => {
  
  test('should render all sections with correct data, including duplicates for exercises', async () => {
    render(<Dashboard />);

    const classListSection = await screen.findByTestId('class-list-section');
    const exerciseListSection = await screen.findByTestId('exercise-list-section');
    const projectListSection = await screen.findByTestId('project-list-section');

    expect(
      within(classListSection).getByText(db.student.classes[0].title)
    ).toBeInTheDocument();
    expect(
      within(classListSection).getByText(db.student.classes[1].title)
    ).toBeInTheDocument();

    const exerciseTitles = within(exerciseListSection).getAllByText(
      db.student.exercises[0].title
    );
    expect(exerciseTitles).toHaveLength(2);


    expect(
      within(projectListSection).getByText(db.student.projects[0].title)
    ).toBeInTheDocument();
  });

  test('should display an error message if the class list API fails', async () => {
    server.use(
      http.get('*/api/StudentClass/student', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<Dashboard />);

    expect(await screen.findByText('خطا در بارگذاری کلاس‌ها')).toBeInTheDocument();
  });
});