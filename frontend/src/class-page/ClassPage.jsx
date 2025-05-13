import React, { useEffect, useState } from "react";
import ClassHeader from "./ClassHeader";
import {
    getClassInfoForInstructor,
    getClassInfoForStudent,
    getStudentOfClassForInstructor,
    getStudentOfClassForStudent
} from './classPageApi.js';
import { useParams } from "react-router-dom";
import Exams from "./components/exam/Exams.jsx";
import AboutCard from "./components/AboutCard.jsx";
import Members from "./components/member/Members.jsx";
import Assignment from "./components/assignment-project/Assignment.jsx";
import AssignmentProject from "./components/assignment-project/AssignmentProject.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";

// داده‌های ثابت جدا از کامپوننت
const assignmentsData = [
    { name: "تمرین 1", number: 5, endDate: new Date("2025-04-20") },
    { name: "تمرین 2", number: 3, endDate: new Date("2025-04-25") },
    { name: "تمرین 3", number: 10, endDate: new Date("2025-04-18") },
    { name: "تمرین 4", number: 8, endDate: new Date("2025-04-30") },
];

const assignmentProjectsData = [
    { name: "پروژه 1", endDate: new Date("2025-05-10") },
    { name: "پروژه 2", endDate: new Date("2025-05-15") },
    { name: "پروژه 3", endDate: new Date("2025-05-20") },
];

const examsData = [
    { color: "var(--color-light-lavender)", title: "کوییز کلاسی 1", date: "شنبه ۱۸ اسفند", time: "۱۰:۰۰-۱۱:۰۰", location: "دانشکده فنی مهندس، کلاس ۱۶" },
    { color: "var(--color-pale-yellow)", title: "امتحان میان‌ترم", date: "یکشنبه ۲۶ فروردین", time: "۱۴:۰۰-۱۶:۰۰", location: "سالن امتحانات مرکزی" },
    { color: "var(--color-sky-blue)", title: "کوییز کلاسی 2", date: "دوشنبه ۲۷ فروردین", time: "۱۰:۰۰-۱۱:۰۰", location: "دانشکده فنی مهندس، کلاس ۱۶" },
    { color: "var(--color-light-green)", title: "امتحان پایان‌ترم", date: "شنبه ۱۰ خرداد", time: "۰۹:۰۰-۱۲:۰۰", location: "سالن امتحانات مرکزی" },
    { color: "var(--color-light-lavender)", title: "کوییز کلاسی 1", date: "شنبه ۱۸ اسفند", time: "۱۰:۰۰-۱۱:۰۰", location: "دانشکده فنی مهندس، کلاس ۱۶" },
    { color: "var(--color-pale-yellow)", title: "امتحان میان‌ترم", date: "یکشنبه ۲۶ فروردین", time: "۱۴:۰۰-۱۶:۰۰", location: "سالن امتحانات مرکزی" },
];

const dayOfWeekMap = {
    0: "شنبه", 1: "یکشنبه", 2: "دوشنبه",
    3: "سه‌شنبه", 4: "چهارشنبه", 5: "پنج‌شنبه", 6: "جمعه",
};

const formatSchedule = (schedules) => {
    if (!Array.isArray(schedules) || schedules.length === 0) return { days: "", times: "" };

    const days = schedules.map(s => dayOfWeekMap[s.dayOfWeek]).join(" و ");
    const times = schedules.map(s => {
        const start = s.startTime.slice(0, 5);
        const end = s.endTime.slice(0, 5);
        return `${end}-${start}`;
    }).join(" و ");

    return { days, times };
};

export default function ClassPage() {
    const { user } = useAuth();
    const userRole = user?.data?.role?.name || "guest";
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [classStudents, setClassStudents] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let info, students;

                if (userRole === "Instructor") {
                    [info, students] = await Promise.all([
                        getClassInfoForInstructor(classId),
                        getStudentOfClassForInstructor(classId)
                    ]);
                } else if (userRole === "Student") {
                    [info, students] = await Promise.all([
                        getClassInfoForStudent(classId),
                        getStudentOfClassForStudent(classId)
                    ]);
                }

                setClassInfo(info);
                setClassStudents(students);
            } catch (error) {
                console.error("خطا در دریافت اطلاعات کلاس:", error);
            }
        };

        fetchData();
    }, [classId, userRole]);

    if (!classInfo) return <div>is loading ...</div>;

    const { days, times } = formatSchedule(classInfo.schedules);

    return (
        <div className="flex w-full max-w-277.5 py-4 h-fit flex-col justify-start items-center gap-4">
            <ClassHeader
                title={classInfo.title}
                instructor={userRole === "Student" ? classInfo.instructorFullName : null}
                startDate={classInfo.startDate}
                endDate={classInfo.endDate}
                days={days}
                times={times}
            />

            <div className="w-full flex h-full justify-between gap-2 items-start shrink-0 pl-[0.84706rem]">
                <div className="w-full max-w-[45.8rem] gap-5 flex flex-col items-start">
                    <Exams exams={examsData} />
                    <div className="w-full flex justify-between gap-2 items-start flex-[1_0_0]">
                        <Assignment assignments={assignmentsData} />
                        <AssignmentProject assignments={assignmentProjectsData} />
                    </div>
                </div>
                <div className="w-full max-w-88 flex flex-col items-start gap-3">
                    <AboutCard description={classInfo.description} />
                    <Members members={classStudents} />
                </div>
            </div>
        </div>
    );
}
