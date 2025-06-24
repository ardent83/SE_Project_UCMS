import React, { useState, useEffect } from "react";
import { More } from "iconsax-react"; // Only More icon needed here, Activity is in parent
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx"; // Importing useAuth hook
// Import any other necessary hooks or utilities for Instructor view
// import { fetchInstructorGradesApi } from './utils/gradeApi'; // Example API import if needed

// Helper function to format numbers to Persian numerals
const formatToPersianNumber = (num) => {
    if (num === null || num === undefined || num === "") return "-";
    return Number(num).toLocaleString("fa-IR");
};

const statusColors = {
    "تکمیل": "bg-green-200 text-green-800",
    "در حال انجام": "bg-sky-200 text-sky-700",
    "شروع نشده": "bg-orange-200 text-orange-700",
};

export default function GradeReportPageInstructor() {
    const { user } = useAuth(); // Needed to filter mock data or pass to API hook
    const userRole = user?.role?.name || "guest"; // Should always be instructor in this component

    // Mock data for Instructor's grades
    const [gradesData, setGradesData] = useState([
        {
            id: 1,
            firstName: 'فاطمه',
            lastName: 'صیادزاده',
            quiz3: 12,
            phase1: 12,
            phase2: 12,
            midterm: 12,
            finalTerm: 12,
            overall: 12,
        },
        {
            id: 2,
            firstName: 'کیمیا',
            lastName: 'کبیری',
            quiz3: 14,
            phase1: 13,
            phase2: 14,
            midterm: 14,
            finalTerm: 14,
            overall: 14,
        },
        {
            id: 3,
            firstName: 'محمد مهدی',
            lastName: 'محسن پور',
            quiz3: 10,
            phase1: 1,
            phase2: 10,
            midterm: 8,
            finalTerm: 7,
            overall: 1,
        },
        {
            id: 4,
            firstName: 'علی',
            lastName: 'احمدی',
            quiz3: 18,
            phase1: 19,
            phase2: 17,
            midterm: 20,
            finalTerm: 19,
            overall: 18,
        },
        {
            id: 5,
            firstName: 'فاطمه زهرا',
            lastName: 'فتحیان',
            quiz3: 9,
            phase1: 7,
            phase2: 8,
            midterm: 6,
            finalTerm: 5,
            overall: 7,
        },
        {
            id: 6,
            firstName: 'حنانه',
            lastName: 'نوروطن',
            quiz3: 11,
            phase1: 10,
            phase2: 12,
            midterm: 11,
            finalTerm: 10,
            overall: 11,
        },
        {
            id: 7,
            firstName: 'زینب',
            lastName: 'صادقی',
            quiz3: 15,
            phase1: 16,
            phase2: 15,
            midterm: 17,
            finalTerm: 16,
            overall: 16,
        },
        {
            id: 8,
            firstName: 'بهار',
            lastName: 'مرادی',
            quiz3: 13,
            phase1: 14,
            phase2: 13,
            midterm: 12,
            finalTerm: 13,
            overall: 13,
        },
    ]);

    const detailedGrades = [
        { label: "کوییز ۳", score: 20, weight: 20 },
        { label: "فاز اول", score: 20, weight: 20 },
        { label: "فاز دوم", score: 20, weight: 25 },
        { label: "میان ترم", score: 20, weight: 25 },
        { label: "پایان ترم", score: 20, weight: 20 },
        { label: "نهایی", score: 20, weight: 100 },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    // Removed sortConfig state and handleSort function as they are for ProjectsPage
    // Removed loading/error states as these would come from a specific hook or API call
    // For now, keeping mock data directly

    const filteredGrades = gradesData.filter((grade) => {
        const lowerSearch = searchQuery.trim().toLowerCase();
        const matchesSearch =
            grade.firstName.toLowerCase().includes(lowerSearch) ||
            grade.lastName.toLowerCase().includes(lowerSearch);
        return matchesSearch;
    });

    const handlePrintClick = () => {
        console.log("Printing grade report...");
        // Add actual print logic here
    };

    return (
        <>
            {/* Search Bar and Print Button (for Instructor) */}
            <div className="flex flex-wrap justify-between items-center mb-12 gap-6 relative z-20 px-15">
                <SearchBox
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جست‌وجو نام دانشجو، نام خانوادگی"
                />
                <div className="flex gap-4 relative z-20">
                    <Button
                        buttonText={"دریافت گزارش"}
                        onClick={handlePrintClick}
                        leftIcon={false}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-auto border border-gray-300 shadow-sm"
                        rightIconComponent={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Detailed Grades Table (for Instructor) */}
            <div className="bg-white p-7 rounded-xl shadow-xl mb-12 overflow-x-auto border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                    جزئیات ریز نمرات
                </h3>
                <table className="min-w-full border-collapse text-center" dir="rtl">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-gray-300 text-gray-400 text-sm">
                            <th className="py-3 px-4"></th> {/* Empty header for the first column */}
                            {detailedGrades.map((item) => (
                                <th key={item.label} className="py-3 px-4">
                                    {item.label}
                                </th>
                            ))}
                            <th className="py-3 px-4">نهایی</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        <tr>
                            <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-900">
                                نمره از ۲۰
                            </td>
                            {detailedGrades.map((item, index) => (
                                <td
                                    key={index}
                                    className="py-3 px-4 whitespace-nowrap text-gray-700"
                                >
                                    {formatToPersianNumber(item.score)}
                                </td>
                            ))}
                            <td className="py-3 px-4 whitespace-nowrap text-gray-700 font-bold">
                                {formatToPersianNumber(20)}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-900">
                                سهم در نمره نهایی از ۱۰۰
                            </td>
                            {detailedGrades.map((item, index) => (
                                <td
                                    key={index}
                                    className="py-3 px-4 whitespace-nowrap text-gray-700"
                                >
                                    {formatToPersianNumber(item.weight)}
                                </td>
                            ))}
                            <td className="py-3 px-4 whitespace-nowrap text-gray-700 font-bold">
                                {formatToPersianNumber(100)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Main Grades Table (for Instructor) */}
            <div className="bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                    گزارش نمرات دانشجویان
                </h3>
                <div
                    className="overflow-y-auto max-h-[380px] relative z-10"
                    dir="ltr"
                >
                    <table className="w-full border-collapse text-center">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b border-gray-300 text-gray-400 text-sm">
                                <th className="py-3 px-4">نهایی</th>
                                <th className="py-3 px-4">پایان ترم</th>
                                <th className="py-3 px-4">میان ترم</th>
                                <th className="py-3 px-4">فاز دوم</th>
                                <th className="py-3 px-4">فاز اول</th>
                                <th className="py-3 px-4">کوییز ۳</th>
                                <th className="py-3 px-4">نام خانوادگی</th>
                                <th className="py-3 px-4">نام</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGrades.length > 0 ? (
                                filteredGrades.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-gray-100 hover:bg-gray-100 transition"
                                    >
                                        <td className="py-3 px-4 font-bold text-blue-700">
                                            {formatToPersianNumber(student.overall)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatToPersianNumber(student.finalTerm)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatToPersianNumber(student.midterm)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatToPersianNumber(student.phase2)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatToPersianNumber(student.phase1)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatToPersianNumber(student.quiz3)}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {student.lastName}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {student.firstName}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-8 text-gray-500 text-lg"
                                    >
                                        نتیجه‌ای یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
