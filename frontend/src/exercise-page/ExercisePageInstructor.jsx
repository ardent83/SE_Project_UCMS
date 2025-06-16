import React from "react";
import { useParams } from "react-router-dom";
import {
    Calendar,
    Edit2,
    Trash, 
    Information,
    DirectboxNotif,
    PresentionChart, 
    DocumentText,
    TickCircle,
    ArrowUp2,
    ArrowDown2
} from "iconsax-react";
import { useExerciseDataForInstructor } from "./hooks/useExerciseDataForInstructor";

import DropdownSection from "./components/DropdownSection.jsx";
import GradeUpload from "./components/GradeDropdownSection.jsx";
import Modal from "../components/Modal";
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
    } = useExerciseDataForInstructor(exerciseId, 'Instructor');

    if (loading) return <div className="text-center mt-10">در حال بارگذاری تمرین...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">خطا: {error}</div>;
    if (!currentExercise) return <div className="text-center text-gray-500 mt-10">تمرین مورد نظر یافت نشد یا وجود ندارد.</div>;


    const handleSortClick = (columnValue) => {
        if (sortBy === columnValue) {
            setSortOrder(prev => (prev === 0 ? 1 : 0)); // 0: ascending, 1: descending
        } else {
            setSortBy(columnValue);
            setSortOrder(0); // Default to ascending when changing column
        }
    };

    const renderSortIcon = (columnValue) => {
        if (sortBy === columnValue) {
            return sortOrder === 0 ? (
                <ArrowUp2 size="16" variant="Bold" className="text-gray-800" />
            ) : (
                <ArrowDown2 size="16" variant="Bold" className="text-gray-800" />
            );
        }
        return <ArrowUp2 size="16" variant="Linear" className="text-gray-400" />; // Default icon for inactive columns
    };


    return (
        <div className="w-full max-w-270 p-6">
            <div className="w-full flex flex-col items-center">
                {/* Exercise Title and Actions */}
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">{currentExercise.title}</h2>
                    <div className="flex gap-4 text-gray-600 mt-5">
                        <div title="دانلود فایل تمرین" className="cursor-pointer">
                            <DirectboxNotif
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleDownloadExerciseFile(currentExercise.exerciseId, `تمرین_${currentExercise.id}.${currentExercise.fileFormats}`)}
                            />
                        </div>
                        <div title="حذف تمرین" className="cursor-pointer">
                            <Trash
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleDeleteExerciseRequest(currentExercise.exerciseId, currentExercise.title)}
                            />
                        </div>
                        <div title="ویرایش تمرین" className="cursor-pointer">
                            <Edit2
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleEditExerciseClick(currentExercise.exerciseId)}
                            />
                        </div>
                    </div>
                </div>

                {/* Exercise Details */}
                <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 border-b-1 border-[#CED8E5F8]" dir="rtl">
                    <div className="text-xl flex items-center gap-2">
                        <Calendar size="25" variant="Linear" color="#495D72" />
                        <span>زمان شروع: {formatPersianDate(currentExercise.startDate)} - {formatPersianTime(currentExercise.startDate)}</span>
                    </div>
                    <div className="text-xl flex items-center gap-2">
                        <PresentionChart size="25" variant="Linear" color="#495D72" />
                        <span>مهلت ارسال: {formatPersianDate(currentExercise.endDate)} - {formatPersianTime(currentExercise.endDate)}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-10">
                        <Information size="25" variant="Linear" color="#495D72" />
                        <p className="leading-relaxed">
                            {currentExercise.description}
                        </p>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="w-full mt-8">
                    <DropdownSection title="ارسال‌ها" bgColor="#1E2B4F">
                        <div className="overflow-y-auto max-h-72">
                            <table className="w-full text-center border-collapse text-sm" dir="rtl">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        {/* نام گروه/دانشجو - SortBy = 1 (Student Name) */}
                                        <th className="px-4 py-2 cursor-pointer" onClick={() => handleSortClick(1)}>
                                            نام گروه/دانشجو
                                            {renderSortIcon(1)}
                                        </th>
                                        {/* زمان ارسال - SortBy = 0 (Date) */}
                                        <th className="px-4 py-2 cursor-pointer" onClick={() => handleSortClick(0)}>
                                            زمان ارسال
                                            {renderSortIcon(0)}
                                        </th>
                                        <th className="px-4 py-2">نوع فایل</th>
                                        <th className="px-4 py-2">نمره استاد</th>
                                        <th className="px-4 py-2">فایل</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(submissions || []).map((submission) => (
                                        <tr key={submission.id} className="odd:bg-white even:bg-gray-50">
                                            <td className="px-4 py-2">{submission.groupName || 'نامشخص'}</td>
                                            <td className="px-4 py-2">{submission.formattedSubmissionTime}</td>
                                            <td className="px-4 py-2">{submission.fileType}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    {submission.grade !== null && submission.grade !== undefined ? (
                                                        <span className="font-semibold text-gray-800">
                                                            {submission.grade} از {currentExercise.exerciseScore}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-1 border border-gray-300 rounded-md overflow-hidden bg-white">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={currentExercise.exerciseScore}
                                                                value={(inlineScores && inlineScores[submission.id] !== undefined) ? inlineScores[submission.id] : ''}
                                                                onChange={(e) => handleInlineScoreChange(submission.id, e.target.value)}
                                                                className="w-16 px-1 py-1 text-center text-sm border-none focus:outline-none"
                                                                placeholder="نمره"
                                                            />
                                                            <button
                                                                className="px-2 py-1 bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-1"
                                                                onClick={() => handleSubmitInlineScore(submission.id)}
                                                                disabled={inlineSavingSubmissionId === submission.id}
                                                            >
                                                                {inlineSavingSubmissionId === submission.id ? (
                                                                    <span className="animate-pulse">...</span>
                                                                ) : (
                                                                    <>
                                                                        <TickCircle size="20" color="#37d67a" variant="Bulk" />
                                                                        <span>نمره</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="justify-center text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer"
                                                    onClick={() => handleDownloadSubmission(submission.fileUrl, `submission_${submission.id}.${submission.fileType}`)}
                                                >
                                                    دانلود
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DropdownSection>

                    <DropdownSection title="ثبت نمره کلی / ارسال" bgColor="#5C6BC0">
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

            <Modal show={showDeleteExerciseModal} onClose={() => setShowDeleteExerciseModal(false)}>
                <DeleteConfirmModalContent
                    onConfirm={handleConfirmDeleteExercise}
                    onCancel={() => setShowDeleteExerciseModal(false)}
                    message={
                        exerciseToDeleteDetails
                            ? `آیا از حذف تمرین "${exerciseToDeleteDetails.title}" مطمئن هستید؟ این عمل غیرقابل بازگشت است.`
                            : "آیا از حذف این تمرین مطمئن هستید؟"
                    }
                />
            </Modal>
        </div>
    );
};

export default ExercisePageForInstructor;