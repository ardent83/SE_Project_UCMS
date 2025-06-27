import React from "react";
import { useAuth } from "../auth/context/AuthContext.jsx";
import GradeReportPageInstructor from "./GradeReportPageInstructor.jsx";
import GradeReportPageStudent from "./GradeReportPageStudent.jsx";
import { Activity } from "iconsax-react";

export default function GradeReportPage() {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";

    return (
        <div
            dir="rtl"
            className="w-full max-w-[90rem] mx-auto py-10 px-6 sm:px-8 lg:px-10 text-gray-800"
        >
            <h2 className="text-3xl font-extrabold mt-6 mb-10 flex items-center border-b border-gray-200 pb-8 gap-3 justify-start --color-big-stone-950">
                <div className="flex items-center gap-2 self-stretch z-10 relative">
                    <Activity size="32" color="#0c1e33" variant="Bold" />
                </div>
                <span>گزارش نمرات</span>
            </h2>

            {userRole === "Instructor" ? (
                <GradeReportPageInstructor />
            ) : userRole === "Student" ? (
                <GradeReportPageStudent />  
            ) : (
                <div className="text-center py-10 text-gray-500 text-xl">
                    شما دسترسی لازم برای مشاهده این صفحه را ندارید.
                </div>
            )}
        </div>
    );
}
