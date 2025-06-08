export const db = {
  student: {
    profile: {
      firstName: "Ali",
      lastName: "Rezaei",
      role: { id: 2 },
    },
    classes: [
      { id: 101, title: "Advanced Programming" },
      { id: 102, title: "Software Engineering" },
    ],
    classDetails: {
      101: {
        id: 101,
        title: "Advanced Programming",
        instructorFullName: "Dr. Akbari",
        schedules: [],
      },
      102: {
        id: 102,
        title: "Software Engineering",
        instructorFullName: "Dr. Mohammadi",
        schedules: [],
      },
    },
    exercises: [
      {
        exerciseId: 201,
        title: "Exercise 1",
        classTitle: "Advanced Programming",
        status: 0,
        endDate: "2025-09-01T12:00:00Z",
      },
    ],
    projects: [
      {
        id: 301,
        title: "Registration System Project",
        classTitle: "Software Engineering",
        status: 1,
        dueDate: "2025-10-15T23:59:59Z",
      },
    ],
  },
  auth: {
    // Auth related mock data...
  },
  classes: {
    list: [
      { id: 101, title: "Advanced Programming" },
      { id: 102, title: "Software Engineering" },
    ],
    details: {
      101: {
        id: 101,
        title: "Advanced Programming",
        instructorFullName: "Dr. Akbari",
        schedules: [],
      },
      102: {
        id: 102,
        title: "Software Engineering",
        instructorFullName: "Dr. Mohammadi",
        schedules: [],
      },
    },
  },
  exams: {
    // Exam related mock data...
  },
  exercises: {
    list: [
      {
        exerciseId: 201,
        title: "Exercise 1",
        classTitle: "Advanced Programming",
        status: 0,
        endDate: "2025-09-01T12:00:00Z",
      },
    ],
  },
  projects: {
    list: [
      {
        id: 301,
        title: "Registration System Project",
        classTitle: "Software Engineering",
        status: 1,
        dueDate: "2025-10-15T23:59:59Z",
      },
    ],
  },
  instructor: {
    // ...
  },
};
