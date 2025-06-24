import React, { useState } from "react";
import { More } from "iconsax-react"; // Only More icon needed here
import SearchBox from "./components/SearchBox.jsx";

// Helper function to format numbers to Persian numerals
const formatToPersianNumber = (num) => {
  if (num === null || num === undefined || num === "") return "-";
  return Number(num).toLocaleString("fa-IR");
};

const statusColors = {
  قبول: "bg-green-200 text-green-800",
  رد: "bg-red-220 text-red-800", // Adjusted for better visual distinction
  نامشخص: "bg-gray-200 text-gray-700",
};

export default function GradeReportPageStudent() {
  // Mock data for a student's courses and their grades
  // In a real application, this would come from an API endpoint specific to the logged-in student
  const [studentCoursesData, setStudentCoursesData] = useState([
    { id: 1, course: "مهندسی نرم افزار", finalGrade: 12, status: "قبول" },
    { id: 2, course: "برنامه نویسی وب", finalGrade: null, status: "نامشخص" },
    { id: 3, course: "داده کاوی", finalGrade: 10, status: "رد" },
    { id: 4, course: "هوش محاسباتی", finalGrade: 12, status: "قبول" },
    { id: 5, course: "مبانی هوش", finalGrade: null, status: "نامشخص" },
    { id: 6, course: "جبر خطی", finalGrade: null, status: "نامشخص" },
    { id: 7, course: "یادگیری ماشین", finalGrade: 10, status: "رد" },
  ]);

  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const filteredStudentCourses = studentCoursesData.filter((course) => {
    const lowerSearch = studentSearchQuery.trim().toLowerCase();
    return course.course.toLowerCase().includes(lowerSearch);
  });

  return (
    <>
      {/* Student Search Bar */}
      <div className="flex justify-start items-center mb-12 gap-6 relative z-20 px-15">
        <SearchBox
          value={studentSearchQuery}
          onChange={(e) => setStudentSearchQuery(e.target.value)}
          placeholder="جست و جو نام درس"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Student's Main Grades Table (Visual Right in RTL) */}
        <div className="lg:flex-1 bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100 lg:order-first">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
            گزارش نمرات من
          </h3>
          <div className="overflow-y-auto max-h-[380px] relative z-10">
            <table className="w-full border-collapse text-center" dir="rtl">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-300 text-gray-400 text-sm">
                  <th className="py-3 px-4 text-center">درس</th>
                  <th className="py-3 px-4 text-center">نمره نهایی</th>
                  <th className="py-3 px-4 text-center">وضعیت</th>
                  <th className="py-3 px-4 text-center">جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudentCourses.length > 0 ? (
                  filteredStudentCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-gray-100 hover:bg-gray-100 transition"
                    >
                      <td className="py-3 px-4 text-center">{course.course}</td>
                      <td className="py-3 px-4 font-bold text-blue-700 text-center">
                        {formatToPersianNumber(course.finalGrade)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[course.status]
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <More size="20" color="#495d72" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
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

        {/* Grade Details Card (Visual Left in RTL) */}
        <div className="lg:w-1/3 bg-white p-7 rounded-xl shadow-xl border border-gray-100 flex-shrink-0 lg:order-last">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
            جزئیات نمره
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-400 text-lg rounded-lg text-right">
            برای مشاهده جزئیات، یک درس را انتخاب کنید
          </div>
        </div>

      </div>
    </>
  );
}
