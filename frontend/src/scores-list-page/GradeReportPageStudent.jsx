import React from "react";
import { InfoCircle } from "iconsax-react";
import SearchBox from "./components/SearchBox.jsx";
import GradeEntryItem from "./components/GradeEntryItem.jsx";

import { formatToPersianNumber } from "./utils/formatters";
import { useStudentGradesData } from "./hooks/useStudentGradesData";

const statusColors = {
  قبول: "bg-green-200 text-green-800",
  رد: "bg-red-200 text-red-800",
  نامشخص: "bg-gray-200 text-gray-700",
};

export default function GradeReportPageStudent() {
  const {
    overallScores,
    detailedScores,
    selectedClassId,
    setSelectedClassId,
    loading,
    error,
    searchQuery,
    setSearchQuery,
  } = useStudentGradesData();

  const handleClassRowClick = (classId) => {
    setSelectedClassId(classId);
  };

  const currentSelectedClassOverallScore = overallScores.find(
    (score) => score.classId === selectedClassId
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700">
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-lg">در حال بارگذاری نمرات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-white text-red-500 mt-12 px-4"
        data-testid="error-message"
      >
        <InfoCircle size="48" className="mb-4" />
        <p className="text-xl font-bold mb-4">خطا در بارگذاری اطلاعات!</p>
        <p className="text-gray-600 text-center">
          {error || "متاسفانه خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید."}
        </p>
        <img
          src="/Animation - 1750148058142.gif"
          alt="Error occurred"
          className="w-20 h-20 mb-6 mt-8"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white min-h-screen text-gray-800">
      {/* Student Search Bar - Always to the right */}
      <div className="flex justify-start items-center mb-9 relative z-20 px-15">
        <SearchBox
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جست و جو نام درس"
          className="w-full max-w-xs"
          inputClassName="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right w-full"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        {/* Overall Grades Table (Visual Left in RTL - Smaller width: 35%) */}
        <div className="flex-none bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100 lg:order-first lg:w-[calc(35%-0.75rem)] lg:max-w-[calc(35%-0.75rem)]">
          <h3 className="text-xl font-bold mb-6 text-gray-800 text-right">
            گزارش نمرات من
          </h3>

          {overallScores.length > 0 ? (
            <div className="overflow-y-auto max-h-[380px] relative z-10 custom-scrollbar">
              <table className="w-full border-collapse" dir="rtl">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-200 text-gray-500 text-sm">
                    <th className="py-3 px-4 text-center">درس</th>
                    <th className="py-3 px-4 text-center">نمره نهایی</th>
                  </tr>
                </thead>
                <tbody>
                  {overallScores.map((course) => (
                    <tr
                      key={course.classId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                        selectedClassId === course.classId ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleClassRowClick(course.classId)}
                      data-testid={`overall-score-row-${course.classId}`}
                    >
                      <td className="py-3 px-4 text-center text-gray-700">
                        {course.classTitle}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700 text-center">
                        {formatToPersianNumber(course.score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-8 text-gray-500 text-lg h-full min-h-[380px]"
              data-testid="no-overall-scores-found"
            >
              {" "}
              <img
                src="/Animation - 1750148058142.gif"
                alt="نتیجه‌ای یافت نشد!"
                className="w-20 h-20 mb-4"
              />
              <p className="text-gray-600 font-bold text-lg mb-2">
                نتیجه‌ای یافت نشد!
              </p>
              <p className="text-gray-500 text-sm text-center">
                هیچ نمره‌ای برای نمایش وجود ندارد.
              </p>
            </div>
          )}
        </div>

        {/* Grade Details Card (Visual Right in RTL - Larger width: 65%) */}
        {overallScores.length > 0 && (
          <div className="flex-none bg-white p-7 rounded-xl shadow-xl border border-gray-100 lg:order-last lg:w-[calc(65%-0.75rem)] lg:max-w-[calc(65%-0.75rem)]">
            <h3 className="text-xl font-bold mb-6 text-gray-800 text-right">
              جزئیات نمره
            </h3>

            {currentSelectedClassOverallScore ? (
              <div className="space-y-4 text-right">
                <div className="flex flex-row justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex flex-row-reverse items-center justify-end text-gray-600 text-md">
                    <div className="flex flex-row-reverse items-center justify-end text-gray-600 text-md mb-2">
                      <span
                        className="font-bold text-gray-800"
                        data-testid="selected-class-title"
                      >
                        {currentSelectedClassOverallScore.classTitle}
                      </span>
                      <span
                        className="font-semibold ml-1"
                        data-testid="selected-class-title-label"
                      >
                        {" "}
                        درس:
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse items-center justify-end text-gray-600 text-md mb-2">
                    <span
                      className="font-semibold text-gray-800 ml-2"
                      data-testid="selected-class-overall-score"
                    >
                      {formatToPersianNumber(
                        currentSelectedClassOverallScore.score
                      )} از {formatToPersianNumber(
                        currentSelectedClassOverallScore.totalScore
                      )}
                    </span>
                    <span
                      className="font-semibold"
                      data-testid="selected-class-overall-score-label"
                    >
                      {" "}
                      نمره نهایی:
                    </span>
                  </div>
                </div>

                {/* Detailed Entries List */}
                {detailedScores.length > 0 ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold mb-3 text-gray-800 text-right">
                      ریز نمرات:
                    </h4>
                    <div className="space-y-3">
                      {detailedScores.map((entry) => (
                        <GradeEntryItem
                          key={`${entry.entryId}-${entry.entryType}`}
                          entry={entry}
                          formatToPersianNumber={formatToPersianNumber}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-gray-500 text-sm mt-4 flex items-center justify-center gap-2"
                    data-testid="no-detailed-scores"
                  >
                    <InfoCircle size="18" />
                    جزئیات ریز نمره در دسترس نیست.
                  </div>
                )}
              </div>
            ) : (
              <div
                className="h-48 flex items-center justify-center text-gray-500 text-lg rounded-lg text-right"
                data-testid="select-class-message"
              >
                برای مشاهده جزئیات، یک درس را انتخاب کنید
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
