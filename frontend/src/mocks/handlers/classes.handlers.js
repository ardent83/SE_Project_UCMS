import { http, HttpResponse } from 'msw';
import { db } from '../db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const classesHandlers = [
  http.get(`${API_BASE_URL}/api/Classes/instructor`, () => {
    return HttpResponse.json({ items: db.classes.list });
  }),

  http.get(`${API_BASE_URL}/Classes/instructor/:classId`, ({ params }) => {
    const { classId } = params;
    const details = db.classes.details[classId];
    return HttpResponse.json(details);
  }),

  // ... other handlers for Classes
];