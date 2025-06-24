export const db = {
  student: {
    profile: {
      firstName: "کاربر",
      lastName: "تست",
      role: { id: 2 },
    },
    classes: {
      items: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `کلاس ${i + 1}`,
        profileImageUrl: i % 3 === 0 ? `/images/classes/sample-${i}.jpg` : null,
        isActive: false,
        studentCount: (i + 1) * 5,
        schedules: [],
      })),
      totalPages: 3,
    },
    get classDetails() {
      const details = {};
      this.classes.items.forEach((cls) => {
        details[cls.id] = {
          ...cls,
          instructorFullName: `استاد ${cls.id}`,
          schedules: [
            { dayOfWeek: cls.id % 7, startTime: "14:30", endTime: "16:00" },
          ],
        };
      });
      return details;
    },
    exercises: {
      1: [
        {
          exerciseId: 1,
          title: "تمرین اول",
          classTitle: "کلاس ۱",
          endDate: "2025-07-10T23:59:59Z",
          status: 2,
        },
        {
          exerciseId: 2,
          title: "تمرین دوم",
          classTitle: "کلاس ۱",
          endDate: "2025-07-20T23:59:59Z",
          status: 1,
        },
      ],
      2: [
        {
          exerciseId: 3,
          title: "تمرین سوم",
          classTitle: "کلاس ۲",
          endDate: "2025-08-01T23:59:59Z",
          status: 0,
        },
      ],
      3: [
        {
          exerciseId: 4,
          title: "تمرین چهارم",
          classTitle: "کلاس ۳",
          endDate: "2025-08-05T23:59:59Z",
          status: 2,
        },
      ],
      4: [
        {
          exerciseId: 5,
          title: "تمرین پنجم",
          classTitle: "کلاس ۴",
          endDate: "2025-08-15T23:59:59Z",
          status: 1,
        },
        {
          exerciseId: 6,
          title: "تمرین ششم",
          classTitle: "کلاس ۴",
          endDate: "2025-08-25T23:59:59Z",
          status: 0,
        },
      ],
    },
    projects: Array.from({ length: 12 }, (_, i) => ({
      id: 100 + i,
      title: `پروژه ${i + 1}`,
      classTitle: `کلاس ${Math.floor(i / 2) + 1}`,
      dueDate: `2025-11-${(i % 28) + 1}T00:00:00Z`,
      dueTime: "18:00:00.0000000",
      status: i % 3,
    })),
  },
  auth: {
    // Auth related mock data...
  },
  classes: {
        '101': {
            title: 'کلاس قابل ویرایش',
            description: 'توضیحات اولیه کلاس',
            startDate: '2025-05-01',
            endDate: '2025-08-01',
            schedules: [
                { dayOfWeek: 2, startTime: '09:00:00', endTime: '11:00:00' }
            ]
        },
        '102': {
            title: null,
            description: null,
            startDate: null,
            endDate: null,
            schedules: null
        }
    }
};
