import { classesHandlers } from './classes.handlers';
import { projectHandlers } from './project.handlers';
import { studentHandlers } from './student.handlers';
// import { authHandlers } from './auth.handlers';
// ... import all other handlers

// Combine all handlers into a single array.
export const handlers = [
  ...classesHandlers,
  ...projectHandlers,
  ...studentHandlers,
  // ...authHandlers,
];