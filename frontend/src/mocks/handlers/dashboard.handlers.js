import { http, HttpResponse } from 'msw';
import { db } from '../db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const dashboardHandlers = [
  http.get(`${API_BASE_URL}/api/StudentClass/Student/classes`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('Page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('PageSize') || '10', 10);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = db.student.classes.items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(db.student.classes.items.length / pageSize);
    return HttpResponse.json({
      items,
      totalPages,
      currentPage: page,
      pageSize,
      totalCount: db.student.classes.items.length,
    });
  }),

  http.get(`${API_BASE_URL}/api/StudentClass/student/:classId`, ({ params }) => {
    const { classId } = params;
    const details = db.student.classDetails[classId];
    if (details) {
      return HttpResponse.json(details);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/api/Exercise/Student/class/:classId`, ({ params }) => {
    const { classId } = params;
    const classExercises = db.student.exercises[classId] || [];
    return HttpResponse.json(classExercises);
  }),

  http.get(`${API_BASE_URL}/api/Project/Student`, () => {
    return HttpResponse.json(db.student.projects);
  }),

  http.get(`${API_BASE_URL}/api/Classes/instructor`, () => {
    return HttpResponse.json(db.instructor.classes);
  }),
];