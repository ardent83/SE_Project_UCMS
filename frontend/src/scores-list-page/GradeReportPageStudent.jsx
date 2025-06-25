import React, { useEffect } from "react";
import { More } from "iconsax-react";
import SearchBox from "./components/SearchBox.jsx";

import { formatToPersianNumber } from "./utils/formatters";
import { useStudentGradesData } from "./hooks/useStudentGradesData";
const statusColors = {
  قبول: "bg-green-200 text-green-800",
  رد: "bg-red-200 text-red-800", // Adjusted for better visual distinction
  نامشخص: "bg-gray-200 text-gray-700",
};

export default function GradeReportPageStudent() {
  const {
    overallScores, // List of all classes with overall scores
    detailedScores, // Detailed scores for the selected class
    selectedClassId,
    setSelectedClassId, // Function to select a class
    loading,
    error,
    searchQuery,
    setSearchQuery,
    // formatToPersianNumber, // No need to re-export from hook, import directly
  } = useStudentGradesData(); // Call the hook to get data and state management

  // FIX: Removed local mock data
  // const [studentCoursesData, setStudentCoursesData] = useState([...]);
  // const [studentSearchQuery, setStudentSearchQuery] = useState("");
  // const filteredStudentCourses = studentCoursesData.filter(...);

  // Function to handle click on a class row in the table
  const handleClassRowClick = (classId) => {
    setSelectedClassId(classId); // Update the selected class ID in the hook
  };

  // Find the currently selected class's overall score for display in the details card
  const currentSelectedClassOverallScore = overallScores.find(
    (score) => score.classId === selectedClassId
  );

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-400">در حال بارگذاری...</div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center text-gray-400 mt-12"
        data-testid="no-projects-message"
      >
        <img
          src="/Animation - 1750148058142.gif"
          alt="No results"
          className="w-80 h-80 mb-6"
        />
        <p className="text-gray-600 mb-4 font-bold text-lg">
          گزارش نمرات شما هنوز قابل مشاهده نیست!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Student Search Bar */}
      <div className="flex justify-end items-center mb-12 gap-6 relative z-20">
        {" "}
        {/* Changed justify-start to justify-end */}
        <SearchBox
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جست و جو نام درس"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grade Details Card (Visual Left in RTL) */}
        <div className="lg:w-1/3 bg-white p-7 rounded-xl shadow-xl border border-gray-100 flex-shrink-0 lg:order-first">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
            جزئیات نمره
          </h3>
          {/* Display details based on currentSelectedClassOverallScore and detailedScores */}
          {currentSelectedClassOverallScore ? (
            <div className="space-y-4 text-right">
              <p className="text-lg font-bold text-blue-700">
                درس: {currentSelectedClassOverallScore.classTitle}
              </p>
              <p className="text-lg font-bold text-gray-800">
                نمره نهایی:{" "}
                {formatToPersianNumber(currentSelectedClassOverallScore.score)}
              </p>
              {/* Removed status line as it's not directly from API in this context */}
              {/* Display detailed scores if available */}
              {detailedScores.length > 0 ? (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-bold mb-3 text-gray-800">
                    ریز نمرات:
                  </h4>
                  {detailedScores.map((entry) => (
                    <div
                      key={entry.entryId}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-gray-700">{entry.entryName}:</span>
                      <span className="font-semibold">
                        {formatToPersianNumber(entry.scoreInTotalScore)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-4">
                  جزئیات ریز نمره در دسترس نیست.
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-lg rounded-lg text-right">
              برای مشاهده جزئیات، یک درس را انتخاب کنید
            </div>
          )}
        </div>

        {/* Student's Main Grades Table (Visual Right in RTL) */}
        <div className="lg:flex-1 bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100 lg:order-last">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
            گزارش نمرات من
          </h3>
          <div className="overflow-y-auto max-h-[380px] relative z-10">
            <table className="w-full border-collapse text-center" dir="rtl">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-300 text-gray-400 text-sm">
                  <th className="py-3 px-4 text-center">درس</th>
                  <th className="py-3 px-4 text-center">نمره نهایی</th>
                  {/* Removed 'وضعیت' column as per previous discussion */}
                  <th className="py-3 px-4 text-center">جزئیات</th>{" "}
                  {/* This column remains */}
                </tr>
              </thead>
              <tbody>
                {overallScores.length > 0 ? ( // Use overallScores from hook
                  overallScores.map((course) => (
                    <tr
                      key={course.classId} // Use classId as key from API response
                      className={`border-b border-gray-100 hover:bg-gray-100 transition cursor-pointer ${
                        selectedClassId === course.classId ? "bg-blue-100" : "" // Highlight selected row
                      }`}
                      onClick={() => handleClassRowClick(course.classId)} // On row click, set selected class
                    >
                      <td className="py-3 px-4 text-center">
                        {course.classTitle}{" "}
                        {/* Use classTitle from API response */}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700 text-center">
                        {formatToPersianNumber(course.score)}{" "}
                        {/* Use score from API response */}
                      </td>
                      {/* Removed 'وضعیت' cell */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <More size="20" color="#495d72" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* Adjusted colSpan to 3 (درس, نمره نهایی, جزئیات) */}
                    <td
                      colSpan={3}
                      className="text-center py-8 text-gray-500 text-lg flex flex-col items-center justify-center"
                    >
                      {" "}
                      {/* Added flex classes */}
                      <img
                        src="/Animation - 1750148058142.gif"
                        alt="نتیجه‌ای یافت نشد"
                        className="w-80 h-80 mb-6"
                      />
                      نتیجه‌ای یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
