import { http, HttpResponse } from 'msw';
import { db } from '../db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const studentHandlers = [
  http.get(`${API_BASE_URL}/api/StudentClass/student`, () => {
    return HttpResponse.json({ items: db.student.classes });
  }),

  http.get(`${API_BASE_URL}/api/StudentClass/student/:classId`, ({ params }) => {
    const { classId } = params;
    const details = db.student.classDetails[classId];
    if (!details) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(details);
  }),

  http.get(`${API_BASE_URL}/api/Exercise/Student`, () => {
    return HttpResponse.json(db.student.exercises);
  }),

  http.get(`${API_BASE_URL}/api/Project/Student`, () => {
    return HttpResponse.json(db.student.projects);
  }),
];