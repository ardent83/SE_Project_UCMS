import React from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Edit2,
  Trash,
  Information,
  DirectboxNotif,
  PresentionChart,
  TickCircle,
  ArrowSwapVertical,
  DocumentDownload,
} from "iconsax-react";
import { useExerciseDataForInstructor } from "./hooks/useExerciseDataForInstructor";

import DropdownSection from "./components/DropdownSection.jsx";
import GradeUpload from "./components/GradeDropdownSection.jsx";
import Modal from "../components/Modal";
import Button from "../components/Button.jsx";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover";

const ExercisePageForInstructor = () => {
  const { exerciseId } = useParams();

  const {
    currentExercise,
    submissions,
    loading,
    error,
    handleDownloadSubmission,
    handleDownloadExerciseFile,
    handleDownloadAllExerciseFile,
    handleDeleteExerciseRequest,
    handleConfirmDeleteExercise,
    handleEditExerciseClick,
    inlineScores,
    handleInlineScoreChange,
    handleSubmitInlineScore,
    inlineSavingSubmissionId,
    handleDownloadScoreTemplate,
    handleScoreFileChange,
    handleUploadScores,
    handleCancelScoreUpload,
    scoreFile,
    scoreUploadError,
    isUploadingScores,
    showDeleteExerciseModal,
    setShowDeleteExerciseModal,
    exerciseToDeleteDetails,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    formatPersianDate,
    formatPersianTime,
  } = useExerciseDataForInstructor(exerciseId, "Instructor");

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

  const handleSortClick = (columnValue) => {
    if (sortBy === columnValue) {
      setSortOrder((prev) => (prev === 1 ? 2 : 1));
    } else {
      setSortBy(columnValue);
      setSortOrder(1);
    }
  };

  const renderSortIcon = (columnValue) => {
    const isActive = sortBy === columnValue;
    return (
      <ArrowSwapVertical
        size="16"
        variant={isActive ? "Bold" : "Bulk"}
        color={isActive ? "#1F2937" : "#9CA3AF"}
      />
    );
  };

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
            <div title="ویرایش تمرین" className="cursor-pointer">
              <Edit2
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={() =>
                  handleEditExerciseClick(currentExercise.exerciseId)
                }
              />
            </div>
            <div title="حذف تمرین" className="cursor-pointer">
              <Trash
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={() =>
                  handleDeleteExerciseRequest(
                    currentExercise.exerciseId,
                    currentExercise.title
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div
          className="w-full pt-4 space-y-4 text-body-01 text-gray-700 border-b-1 border-[#CED8E5F8]"
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

        {/* Submissions Section */}
        <div className="w-full mt-8">
          <DropdownSection title="ارسال‌ها" bgColor="#1E2B4F">
            <div className="overflow-y-auto max-h-72">
              <div className="flex gap-4 relative z-20 mb-2">
                <Button
                  leftIcon={false}
                  buttonText={"دانلود همه‌ی ارسال‌ها"}
                  onClick={() =>
                    handleDownloadAllExerciseFile(
                      currentExercise.exerciseId
                    )
                  }
                  className="bg-gray-100 hover:bg-blue-800 text-gray-700 w-auto border border-gray-300 shadow-sm"
                  rightIconComponent={
                    <DocumentDownload
                      size="30"
                      variant="Bold"
                      color="#ffffff"
                    />
                  }
                />
              </div>
              <table
                className="w-full text-center border-collapse text-sm"
                dir="rtl"
              >
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer select-none hover:text-gray-700 transition"
                        onClick={() => handleSortClick(2)}
                      >
                        نام و نام خانوادگی دانشجو
                        {renderSortIcon(2)}
                      </div>
                    </th>
                    <th className="px-4 py-2">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer select-none hover:text-gray-700 transition"
                        onClick={() => handleSortClick(3)}
                      >
                        شماره دانشجویی
                        {renderSortIcon(3)}
                      </div>
                    </th>
                    <th className="px-4 py-2">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer select-none hover:text-gray-700 transition"
                        onClick={() => handleSortClick(1)}
                      >
                        زمان ارسال
                        {renderSortIcon(1)}
                      </div>
                    </th>
                    <th className="px-4 py-2">نوع فایل</th>
                    <th className="px-4 py-2">نمره استاد</th>
                    <th className="px-4 py-2">فایل</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        هنوز ارسالی انجام نشده است.
                      </td>
                    </tr>
                  ) : (
                    (submissions || []).map((submission) => (
                      <tr
                        key={submission.id}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        <td className="px-4 py-2">
                          {submission.studentName || "نامشخص"}
                        </td>
                        <td className="px-4 py-2">
                          {submission.studentNumber || "ثبت نشده"}
                        </td>
                        <td className="px-4 py-2">
                          {submission.formattedSubmissionTime}
                        </td>
                        <td className="px-4 py-2">{submission.fileType}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-1 border border-gray-300 rounded-md overflow-hidden bg-white">
                              <input
                                type="number"
                                min="0"
                                max={currentExercise.exerciseScore}
                                value={
                                  inlineScores &&
                                  inlineScores[submission.id] !== undefined
                                    ? inlineScores[submission.id]
                                    : ""
                                }
                                onChange={(e) =>
                                  handleInlineScoreChange(
                                    submission.id,
                                    e.target.value
                                  )
                                }
                                className={`w-16 px-1 py-1 text-center text-sm border-none focus:outline-none ${
                                  submission.grade !== null &&
                                  submission.grade !== undefined
                                    ? "text-gray-500 bg-gray-50"
                                    : "text-gray-800" // Default text color
                                }`}
                                placeholder="نمره"
                              />
                              <button
                                // <-- تغییرات استایل دکمه ثبت -->
                                className={`px-2 py-1 flex items-center justify-center gap-1 rounded-md text-white font-semibold transition-all duration-300 transform ${
                                  inlineSavingSubmissionId === submission.id
                                    ? "bg-gray-500 cursor-not-allowed" // در حال ذخیره (خاکستری‌تر و غیرفعال)
                                    : "bg-blue-800 hover:bg-blue-900 active:scale-95 shadow-md hover:shadow-lg" // حالت عادی (آبی تیره، با هاور و سایه)
                                }`}
                                onClick={() =>
                                  handleSubmitInlineScore(submission.id)
                                }
                                disabled={
                                  inlineSavingSubmissionId === submission.id
                                }
                              >
                                {inlineSavingSubmissionId === submission.id ? (
                                  <span className="animate-pulse">...</span>
                                ) : (
                                  <>
                                    <TickCircle
                                      size="20"
                                      color="white" // رنگ سفید برای آیکون
                                      variant="Bulk"
                                    />
                                    <span>ثبت</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="justify-center text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer"
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DropdownSection>

          <DropdownSection title="ثبت نمره کلی" bgColor="#5C6BC0">
            <GradeUpload
              onDownloadTemplate={handleDownloadScoreTemplate}
              onFileChange={handleScoreFileChange}
              onUpload={handleUploadScores}
              onCancel={handleCancelScoreUpload}
              selectedFile={scoreFile}
              uploadError={scoreUploadError}
              isUploading={isUploadingScores}
              currentExercise={currentExercise}
            />
          </DropdownSection>
        </div>
      </div>

      <Modal
        show={showDeleteExerciseModal}
        onClose={() => setShowDeleteExerciseModal(false)}
      >
        <DeleteConfirmModalContent
          onConfirm={handleConfirmDeleteExercise}
          onCancel={() => setShowDeleteExerciseModal(false)}
          message={
            exerciseToDeleteDetails
              ? `آیا از حذف تمرین "${exerciseToDeleteDetails.title}" مطمئن هستید؟`
              : "آیا از حذف این تمرین مطمئن هستید؟"
          }
        />
      </Modal>
    </div>
  );
};

export default ExercisePageForInstructor;
