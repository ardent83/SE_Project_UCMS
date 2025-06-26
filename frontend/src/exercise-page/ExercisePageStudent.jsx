import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Information,
  PresentionChart,
  DirectboxNotif,
  ArrowSwapVertical,
} from "iconsax-react";

import { useExerciseDataForStudent } from "./hooks/useExerciseDataForStudent";
import ExerciseSubmitTab from "./components/ExerciseSubmitTab.jsx";
import ExerciseSubmissionTab from "./components/ExerciseSubmissionTab.jsx";

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

  const handleSortClick = () => {
    if (sortBy !== 1) {
      setSortBy(1);
      setSortOrder(1);
    } else {
      setSortOrder(sortOrder === 1 ? 2 : 1);
    }
  };

  const renderSortIcon = () => (
    <ArrowSwapVertical
      size={16}
      variant="Bulk"
      color="#0C1E33"
      className={`inline-block transition-transform duration-800 ${sortOrder === 2 ? "rotate-180" : ""
        }`}
    />
  );

  return (
    <div className="w-full max-w-[90rem] mx-auto px-10 text-bg-blue">
      <div className="w-full flex flex-col items-center">
        {/* Exercise Title and Actions */}
        <div
          className="w-full flex justify-between items-center pb-10"
          dir="rtl"
        >
          <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">
            {currentExercise.title}
          </h2>
          <div className="flex gap-4 text-gray-600 mt-15">
            <div title="دانلود فایل تمرین" className="cursor-pointer">
              <DirectboxNotif
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={() =>
                  handleDownloadExerciseFile(
                    currentExercise.exerciseId,
                    `تمرین_${currentExercise.id}.${currentExercise.fileFormats}`
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Details */}
      <div
        className="w-full pt-4 space-y-4 text-body-01 text-gray-700"
        dir="rtl"
      >
        <div className="text-lg flex items-center gap-2">
          <Calendar size="25" variant="Linear" color="#495D72" />
          <span>
            زمان شروع: {formatPersianDate(currentExercise.startDate)} -{" "}
            {formatPersianTime(currentExercise.startDate)}
          </span>
        </div>
        <div className="text-lg flex items-center gap-2">
          <PresentionChart size="25" variant="Linear" color="#495D72" />
          <span>
            مهلت ارسال: {formatPersianDate(currentExercise.endDate)} -{" "}
            {formatPersianTime(currentExercise.endDate)}
          </span>
        </div>
        <div className="text-lg flex items-start gap-2 mb-10">
          <Information
            size="25"
            variant="Linear"
            color="#495D72"
            className="flex-shrink-0 mt-1"
          />
          <p className="leading-relaxed">{currentExercise.description}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 mt-6 border-b border-gray-200" dir="rtl">
        {["ارسال پاسخ", "ارسال‌ها"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-t-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab
              ? "bg-big-stone-900 border-x border-t border-gray-200 -mb-px text-white shadow-sm"
              : "bg-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "ارسال‌ها" && (
        <ExerciseSubmissionTab
          submissions={studentSubmissions}
          onDownload={handleDownloadSubmission}
          onFinalToggle={handleUpdateFinalSubmission}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortClick={handleSortClick}
          renderSortIcon={renderSortIcon}
          formatPersianDate={formatPersianDate}
          formatPersianTime={formatPersianTime}
          exerciseScore={currentExercise.exerciseScore}
        />
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
