import React from "react";
import { useParams } from "react-router-dom";
import {
    Calendar,
    Edit2, 
    Trash, 
    Information,
    DirectboxNotif,
    PresentionChart
} from "iconsax-react";
import { useExerciseDataForInstructor } from "./hooks/useExerciseDataForInstructor";

import DropdownSection from "./components/DropdownSection.jsx";
import GradeUpload from "./components/GradeDropdownSection.jsx";
import GradeForm from "./components/GradeFormPop.jsx";
import Modal from "../components/Modal";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover";


const ExercisePageForInstructor = () => {
    const { exerciseId } = useParams();

    const {
        currentExercise,
        submissions,
        loading,
        error,
        handleOpenGradeForm,
        handleGradeChange,
        handleSubmitGrades,
        handleCancelGradeForm,
        handleDownloadSubmission,
        handleDownloadExerciseFile,
        handleDeleteExerciseRequest,
        handleConfirmDeleteExercise,
        showDeleteExerciseModal,
        setShowDeleteExerciseModal,
        exerciseToDeleteDetails,
        handleEditExerciseClick, 
        showGradeFormModal,
        selectedSubmissionId,
        grades,
        submissionOverallScore,
        setSubmissionOverallScore,
        isReadOnly,
        gradeFormError,
        formatPersianDate,
        formatPersianTime,
    } = useExerciseDataForInstructor(exerciseId, 'Instructor');

    if (loading) return <div className="text-center mt-10">در حال بارگذاری تمرین...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">خطا: {error}</div>;
    if (!currentExercise) return <div className="text-center text-gray-500 mt-10">تمرین مورد نظر یافت نشد یا وجود ندارد.</div>;

    const mockGroupMembersForGradeForm = [
        { studentId: 'mem1', fullName: 'فاطمه صیادزاده', score: null },
        { studentId: 'mem2', fullName: 'حنانه نوروطن', score: null },
        { studentId: 'mem3', fullName: 'محمدی', score: null },
    ];


    return (
        <div className="w-full max-w-270 p-6">
            <div className="w-full flex flex-col items-center">
                {/* Exercise Title and Actions */}
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">{currentExercise.title}</h2>
                    {/* Actions: Download, Delete, Edit Exercise */}
                    <div className="flex gap-4 text-gray-600 mt-5">
                        {/* دانلود فایل تمرین اصلی */}
                        <div title="دانلود فایل تمرین" className="cursor-pointer">
                            <DirectboxNotif
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleDownloadExerciseFile(currentExercise.exerciseId, `تمرین_${currentExercise.id}.${currentExercise.fileFormats}`)}
                            />
                        </div>
                        {/* دکمه حذف تمرین */}
                        <div title="حذف تمرین" className="cursor-pointer">
                            <Trash
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleDeleteExerciseRequest(currentExercise.exerciseId, currentExercise.title)}
                            />
                        </div>
                        {/* دکمه ویرایش تمرین */}
                        <div title="ویرایش تمرین" className="cursor-pointer">
                            <Edit2
                                size="30"
                                variant="Bulk"
                                color="#08146f"
                                onClick={() => handleEditExerciseClick(currentExercise.exerciseId)} // <-- اتصال به تابع جدید
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
                                        <th className="px-4 py-2">نام گروه/دانشجو</th>
                                        <th className="px-4 py-2">زمان ارسال</th>
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
                                                <div className="flex items-center gap-2 justify-center">
                                                    {submission.grade !== null && submission.grade !== undefined ? (
                                                        <button
                                                            className="text-green-500 hover:text-green-700 font-semibold cursor-pointer underline"
                                                            title="مشاهده نمرات ثبت شده"
                                                            onClick={() => handleOpenGradeForm(submission.id, { grades: {}, submitted: true, grade: submission.grade, totalScore: currentExercise.exerciseScore }, mockGroupMembersForGradeForm)}
                                                        >
                                                            {submission.grade} از {currentExercise.exerciseScore}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="bg-red-400 hover:bg-red-600 border border-none text-white px-2 py-1 rounded cursor-pointer"
                                                            title="ثبت نمره"
                                                            onClick={() => handleOpenGradeForm(submission.id, { grades: {}, submitted: false, grade: 0, totalScore: currentExercise.exerciseScore }, mockGroupMembersForGradeForm)}
                                                        >
                                                            ثبت نشده
                                                        </button>
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
                        <GradeUpload />
                    </DropdownSection>
                </div>
            </div>

            {showGradeFormModal && (
                <GradeForm
                    submissionId={selectedSubmissionId}
                    members={mockGroupMembersForGradeForm}
                    grades={grades}
                    exerciseMaxScore={currentExercise.exerciseScore}
                    overallScore={submissionOverallScore}
                    onOverallScoreChange={setSubmissionOverallScore}
                    onMemberGradeChange={handleGradeChange}
                    onSubmit={handleSubmitGrades}
                    onCancel={handleCancelGradeForm}
                    readOnly={isReadOnly}
                    error={gradeFormError}
                />
            )}

            <Modal show={showDeleteExerciseModal} onClose={() => setShowDeleteExerciseModal(false)}>
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
