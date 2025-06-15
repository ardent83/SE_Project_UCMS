import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchExerciseDetailsApi,
    fetchExerciseSubmissionsApi,
    submitGradeApi,
    downloadSubmissionFileApi,
    downloadExerciseFileApi,
    deleteExerciseApi
} from "../utils/exerciseApi";
import { formatExerciseData, formatSubmissionData, formatPersianDate, formatPersianTime } from "../utils/exerciseFormatters";

export const useExerciseDataForInstructor = (exerciseId, userRole) => {
    const navigate = useNavigate();

    const [currentExercise, setCurrentExercise] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
    const [grades, setGrades] = useState({});
    const [submissionOverallScore, setSubmissionOverallScore] = useState(0);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [gradeFormError, setGradeFormError] = useState("");
    const [showGradeFormModal, setShowGradeFormModal] = useState(false);

    const [showDeleteExerciseModal, setShowDeleteExerciseModal] = useState(false);
    const [exerciseToDeleteDetails, setExerciseToDeleteDetails] = useState(null);

    const loadExerciseDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!exerciseId) {
                setError("شناسه تمرین برای بارگذاری اطلاعات معتبر نیست.");
                setLoading(false);
                return;
            }

            const rawExercise = await fetchExerciseDetailsApi(exerciseId, userRole);
            const formattedExercise = formatExerciseData(rawExercise);
            setCurrentExercise(formattedExercise);

            const rawSubmissions = await fetchExerciseSubmissionsApi(exerciseId, userRole);
            const formattedSubmissions = rawSubmissions.map(sub => formatSubmissionData(sub));
            setSubmissions(formattedSubmissions);

        } catch (err) {
            console.error(`Error loading exercise ${exerciseId} details or submissions:`, err);
            setError(err.message || "خطا در بارگذاری جزئیات تمرین یا ارسال‌ها.");
            setCurrentExercise(null);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, [exerciseId, userRole]);

    const handleOpenGradeForm = useCallback((submissionId, submissionDetails, groupMembersMock) => {
        setSelectedSubmissionId(submissionId);
        setGrades(submissionDetails.grades || {});
        setSubmissionOverallScore(submissionDetails.grade !== null && submissionDetails.grade !== undefined ? submissionDetails.grade : 0);
        setIsReadOnly(!!submissionDetails.submitted);
        setShowGradeFormModal(true);
        setGradeFormError("");
    }, []);

    const handleGradeChange = useCallback((memberId, value) => {
        setGrades((prev) => ({ ...prev, [memberId]: value }));
    }, []);

    const handleSubmitGrades = useCallback(async (overallScore) => {
        if (overallScore === undefined || overallScore === null || overallScore === "") {
            setGradeFormError("لطفاً نمره کلی را وارد کنید.");
            return;
        }
        if (!selectedSubmissionId) {
            setGradeFormError("خطا: ارسال انتخاب نشده است.");
            return;
        }

        try {
            await submitGradeApi(selectedSubmissionId, grades, overallScore);
            setShowGradeFormModal(false);
            setGradeFormError("");
            setSelectedSubmissionId(null);
            setGrades({});
            setSubmissionOverallScore(0);
            await loadExerciseDetails();
        } catch (err) {
            console.error("Error submitting grades:", err);
            setGradeFormError(err.message || "خطا در ثبت نمرات.");
        }
    }, [selectedSubmissionId, grades, loadExerciseDetails]);

    const handleCancelGradeForm = useCallback(() => {
        setShowGradeFormModal(false);
        setGradeFormError("");
        setSelectedSubmissionId(null);
        setGrades({});
        setSubmissionOverallScore(0);
    }, []);

    const handleDownloadExerciseFile = useCallback(async (exerciseId, fileName) => {
        try {
            await downloadExerciseFileApi(exerciseId, userRole, fileName);
        } catch (err) {
            console.error("Error downloading exercise file:", err);
            setError(err.message || "خطا در دانلود فایل تمرین.");
        }
    }, [userRole]);

    const handleDownloadSubmissionFile = useCallback(async (fileUrl, fileName) => {
        try {
            await downloadSubmissionFileApi(fileUrl, fileName);
        } catch (err) {
            console.error("Error downloading submission file:", err);
            setError(err.message || "خطا در دانلود فایل ارسال شده.");
        }
    }, []);

    const handleDeleteExerciseRequest = useCallback((id, title) => {
        setExerciseToDeleteDetails({ id, title });
        setShowDeleteExerciseModal(true);
    }, []);

    const handleConfirmDeleteExercise = useCallback(async () => {
        if (!exerciseToDeleteDetails || !exerciseToDeleteDetails.id) {
            console.error("Error: No exercise selected for deletion.");
            return;
        }
        try {
            await deleteExerciseApi(exerciseToDeleteDetails.id);
            console.log(`Exercise "${exerciseToDeleteDetails.title}" (${exerciseToDeleteDetails.id}) deleted successfully.`);
            setShowDeleteExerciseModal(false);
            setExerciseToDeleteDetails(null);
            navigate('/exercisesPage', { state: { message: `تمرین "${exerciseToDeleteDetails.title}" با موفقیت حذف شد.` } });
        } catch (err) {
            console.error("Error deleting exercise:", err);
            setError(err.message || "خطایی در حذف تمرین رخ داد!");
            setShowDeleteExerciseModal(false);
            setExerciseToDeleteDetails(null);
        }
    }, [exerciseToDeleteDetails, navigate]);


    const handleEditExerciseClick = useCallback((id) => {
        navigate(`/exercise/edit/${id}`); 
    }, [navigate]);

    useEffect(() => {
        loadExerciseDetails();
    }, [loadExerciseDetails]);

    return {
        currentExercise,
        submissions,
        loading,
        error,
        handleOpenGradeForm,
        handleGradeChange,
        handleSubmitGrades,
        handleCancelGradeForm,
        handleDownloadSubmission: handleDownloadSubmissionFile,
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
    };
};
