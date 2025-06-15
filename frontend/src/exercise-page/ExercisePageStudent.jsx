import React from "react";
import { useParams } from "react-router-dom";
import {
    Calendar,
    Information,
    PresentionChart,
    DirectboxNotif
} from "iconsax-react";

import { useExerciseDataForStudent } from "./hooks/useExerciseDataForStudent";

import ExerciseSubmitTab from "./components/ExerciseSubmitTab.jsx"; 
import ExerciseSubmissionTab from "./components/ExerciseSubmissionTab.jsx"; 

const ExercisePageStudent = () => {
    const { exerciseId } = useParams(); 

    const {
        currentExercise,
        studentSubmission,
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
        formatPersianDate,
        formatPersianTime,
    } = useExerciseDataForStudent(exerciseId, 'Student'); 

    if (loading) return <div className="text-center mt-10">در حال بارگذاری تمرین...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">خطا: {error}</div>;
    if (!currentExercise) return <div className="text-center text-gray-500 mt-10">تمرین مورد نظر یافت نشد یا وجود ندارد.</div>;

    return (
        <div className="w-full max-w-270 p-6" dir="rtl">
            <div className="w-full flex flex-col items-center">
                {/* Exercise Title */}
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">{currentExercise.title}</h2>
                    {/* Actions: Download Exercise File */}
                    <div className="flex gap-4 text-gray-600 mt-5">
                        <div title="دانلود فایل تمرین" className="cursor-pointer">
                            <DirectboxNotif
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => {
                                    console.log("دانلود فایل تمرین اصلی:", currentExercise.exerciseFilePath);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Exercise Details */}
                <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 mb-5" dir="rtl">
                    <div className="text-xl flex items-center gap-2">
                        <Calendar size="25" variant="Linear" color="#495D72" />
                        <span>زمان شروع: {formatPersianDate(currentExercise.startDate)} - {formatPersianTime(currentExercise.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PresentionChart size="25" variant="Linear" color="#495D72" />
                        <span>مهلت ارسال: {formatPersianDate(currentExercise.endDate)} - {formatPersianTime(currentExercise.endDate)}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-6">
                        <Information size="25" variant="Linear" color="#495D72" />
                        <p className="leading-relaxed">
                            {currentExercise.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs for Submission and Submission History */}
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

            {/* Render content based on active tab */}
            {activeTab === "ارسال پاسخ" && (
                <ExerciseSubmitTab
                    // Pass submission form props
                    onSubmit={handleSubmitAnswer}
                    file={submissionFile}
                    setFile={setSubmissionFile}
                    description={submissionDescription}
                    setDescription={setSubmissionDescription}
                    error={submissionError}
                    isSubmitting={isSubmitting}
                />
            )}
            {activeTab === "ارسال‌ها" && (
                <ExerciseSubmissionTab
                    studentSubmission={studentSubmission}
                    exerciseMaxScore={currentExercise.exerciseScore}
                    // For the actual submission tab, you might need more props like download handler for student's own submission
                />
            )}
        </div>
    );
};

export default ExercisePageStudent;