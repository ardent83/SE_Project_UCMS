import { http, HttpResponse } from 'msw';
import { db } from '../db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const projectHandlers = [
  http.get(`${API_BASE_URL}/api/Project/Student`, () => {
    return HttpResponse.json(db.projects.list);
  }),
  // ... other handlers for Projects
];