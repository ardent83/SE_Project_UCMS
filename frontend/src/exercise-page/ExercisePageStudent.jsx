import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Information,
  PresentionChart,
  DirectboxNotif,
  ArrowSwapVertical,
  ArrangeHorizontalSquare,
} from "iconsax-react";

import { useExerciseDataForStudent } from "./hooks/useExerciseDataForStudent";
import ExerciseSubmitTab from "./components/ExerciseSubmitTab.jsx";

const ExercisePageForStudent = () => {
  const { exerciseId } = useParams();

  const {
    currentExercise,
    studentSubmissions,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleSubmitAnswer,
    submissionFile,
    setSubmissionFile,
    submissionDescription,
    setSubmissionDescription,
    submissionError,
    isSubmitting,
    handleDownloadExerciseFile,
    handleDownloadSubmission,
    handleUpdateFinalSubmission,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    formatPersianDate,
    formatPersianTime,
  } = useExerciseDataForStudent(exerciseId, "Student");

  // حالت آیکون مرتب سازی: 1=Bulk, 2=Bold, 3=ArrangeHorizontalSquare
  const [sortIconState, setSortIconState] = useState(1);

  if (!exerciseId)
    return (
      <div className="text-center text-red-500 mt-10">
        شناسه تمرین معتبر نیست.
      </div>
    );

  if (loading)
    return <div className="text-center mt-10">در حال بارگذاری تمرین...</div>;

  if (error)
    return <div className="text-center text-red-500 mt-10">خطا: {error}</div>;

  if (!currentExercise)
    return (
      <div className="text-center text-gray-500 mt-10">
        تمرین مورد نظر یافت نشد یا وجود ندارد.
      </div>
    );

  // هندل کلیک روی ستون مرتب سازی
  const handleSortClick = (columnValue) => {
    if (sortBy === columnValue) {
      // هر کلیک حالت آیکون رو یک مرحله جلو میبره
      setSortIconState((prev) => (prev === 3 ? 1 : prev + 1));
      // فقط حالت دوم (Bold) ترتیب رو تغییر میده
      if (sortIconState === 2) {
        setSortOrder((prev) => (prev === 1 ? 2 : 1));
      }
    } else {
      setSortBy(columnValue);
      setSortOrder(1);
      setSortIconState(1); // وقتی ستون عوض میشه حالت آیکون به اول ریست میشه
    }
  };

  // رندر آیکون بر اساس حالت فعلی
  const renderSortIcon = () => {
    if (sortIconState === 1) {
      return (
        <ArrowSwapVertical
          size="16"
          variant="Bulk"
          color={sortBy === 1 ? "#1F2937" : "#9CA3AF"}
          style={{ marginLeft: "0.25rem", transition: "all transform 0.3s ease" }}
        />
      );
    }
    if (sortIconState === 2) {
      return (
        <ArrowSwapVertical
          size="16"
          variant="Bold"
          color={sortBy === 1 ? "#1F2937" : "#9CA3AF"}
          style={{
            marginLeft: "0.25rem",
            transition: "all transform 0.3s ease",
            transform: sortOrder === 1 ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      );
    }
    if (sortIconState === 3) {
      return (
        <ArrangeHorizontalSquare
          size="16"
          variant="Bold"
          color={sortBy === 1 ? "#1F2937" : "#9CA3AF"}
          style={{ marginLeft: "0.25rem", transition: "all transform 0.3s ease" }}
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-270 p-6" dir="rtl">
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center px-10 pb-10">
          <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">
            {currentExercise.title}
          </h2>
          <div className="flex gap-4 text-gray-600 mt-5">
            <div title="دانلود فایل تمرین" className="cursor-pointer">
              <DirectboxNotif
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={() =>
                  handleDownloadExerciseFile(
                    currentExercise.exerciseId,
                    `تمرین_${currentExercise.id}.${
                      currentExercise.fileFormats || "pdf"
                    }`
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 mb-5">
          <div className="text-xl flex items-center gap-2">
            <Calendar size="25" variant="Linear" color="#495D72" />
            <span>
              زمان شروع: {formatPersianDate(currentExercise.startDate)} -{" "}
              {formatPersianTime(currentExercise.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PresentionChart size="25" variant="Linear" color="#495D72" />
            <span>
              مهلت ارسال: {formatPersianDate(currentExercise.endDate)} -{" "}
              {formatPersianTime(currentExercise.endDate)}
            </span>
          </div>
          <div className="flex items-start gap-2 mb-6">
            <Information size="25" variant="Linear" color="#495D72" />
            <p className="leading-relaxed">{currentExercise.description}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {["ارسال پاسخ", "ارسال‌ها"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-t-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-big-stone-900 border-x border-t border-gray-200 -mb-px text-white shadow-sm"
                : "bg-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "ارسال‌ها" && (
        <div className="w-full">
          <table className="w-full text-center border-collapse text-sm" dir="ltr">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2">فایل</th>
                <th className="px-4 py-2">نمره</th>
                <th className="px-4 py-2">نوع فایل</th>
                <th
                  className="px-4 py-2 cursor-pointer select-none"
                  onClick={() => handleSortClick(1)}
                >
                  <div className="flex items-center justify-center">
                    تاریخ و ساعت ارسال
                    {renderSortIcon()}
                  </div>
                </th>
                <th className="px-4 py-2">ارسال نهایی</th>
              </tr>
            </thead>
            <tbody>
              {studentSubmissions && studentSubmissions.length > 0 ? (
                studentSubmissions.map((submission) => (
                  <tr key={submission.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2">
                      <button
                        className="text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer"
                        onClick={() =>
                          handleDownloadSubmission(
                            submission.id,
                            `submission_${submission.id}.${submission.fileType}`
                          )
                        }
                      >
                        دانلود
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      {submission.grade != null ? (
                        <span className="font-semibold text-gray-800">
                          {submission.grade}
                          {currentExercise.exerciseScore &&
                            ` از ${currentExercise.exerciseScore}`}
                        </span>
                      ) : (
                        <span>ثبت نشده</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{submission.fileType || "نامشخص"}</td>
                    <td className="px-4 py-2" dir="rtl">
                      {formatPersianDate(submission.submittedAt)} -{" "}
                      {formatPersianTime(submission.submittedAt)}
                    </td>
                    <td className="px-4 py-2 flex justify-center items-center">
                      <label className="inline-flex items-center cursor-pointer flex-row-reverse gap-1">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded"
                          checked={submission.isFinal}
                          onChange={(e) =>
                            handleUpdateFinalSubmission(submission.id, e.target.checked)
                          }
                          disabled={submission.grade != null}
                          aria-label="ارسال نهایی"
                        />
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    هنوز پاسخی ارسال نکرده‌اید.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "ارسال پاسخ" && (
        <ExerciseSubmitTab
          onSubmit={handleSubmitAnswer}
          file={submissionFile}
          setFile={setSubmissionFile}
          description={submissionDescription}
          setDescription={setSubmissionDescription}
          error={submissionError}
          isSubmitting={isSubmitting}
          fileFormats={currentExercise.fileFormats}
        />
      )}
    </div>
  );
};

export default ExercisePageForStudent;
