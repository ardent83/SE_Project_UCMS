import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchExerciseDetailsApi,
    fetchExerciseSubmissionsApi,
    submitGradeApi,
    downloadSubmissionFileApi,
    downloadExerciseFileApi,
    deleteExerciseApi,
    getExerciseScoreTemplateFileApi,
    updateExerciseSubmissionScoresApi
} from "../utils/exerciseApi";
import { formatExerciseData, formatSubmissionData, formatPersianDate, formatPersianTime } from "../utils/exerciseFormatters";

export const useExerciseDataForInstructor = (exerciseId, userRole) => {
    const navigate = useNavigate();

    const [currentExercise, setCurrentExercise] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [inlineScores, setInlineScores] = useState({});
    const [inlineSavingSubmissionId, setInlineSavingSubmissionId] = useState(null);

    const [showDeleteExerciseModal, setShowDeleteExerciseModal] = useState(false);
    const [exerciseToDeleteDetails, setExerciseToDeleteDetails] = useState(null);

    const [scoreFile, setScoreFile] = useState(null);
    const [scoreUploadError, setScoreUploadError] = useState("");
    const [isUploadingScores, setIsUploadingScores] = useState(false);


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

            const initialInlineScores = {};
            formattedSubmissions.forEach(sub => {
                if (sub.grade !== null && sub.grade !== undefined) {
                    initialInlineScores[sub.id] = sub.grade;
                }
            });
            setInlineScores(initialInlineScores);

        } catch (err) {
            console.error(`Error loading exercise ${exerciseId} details or submissions:`, err);
            setError(err.message || "خطا در بارگذاری جزئیات تمرین یا ارسال‌ها.");
            setCurrentExercise(null);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, [exerciseId, userRole]);

    const handleInlineScoreChange = useCallback((submissionId, value) => {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
            setInlineScores(prev => ({ ...prev, [submissionId]: "" }));
            return;
        }
        if (currentExercise && numValue > currentExercise.exerciseScore) {
            setInlineScores(prev => ({ ...prev, [submissionId]: currentExercise.exerciseScore }));
            return;
        }

        setInlineScores(prev => ({ ...prev, [submissionId]: numValue }));
    }, [currentExercise]);

    const handleSubmitInlineScore = useCallback(async (submissionId) => {
        const scoreToSubmit = inlineScores[submissionId];
        if (scoreToSubmit === undefined || scoreToSubmit === null || scoreToSubmit === "") {
            setError("لطفاً نمره را وارد کنید.");
            return;
        }
        if (currentExercise && (scoreToSubmit < 0 || scoreToSubmit > currentExercise.exerciseScore)) {
            setError(`نمره باید بین 0 و ${currentExercise.exerciseScore} باشد.`);
            return;
        }
        setInlineSavingSubmissionId(submissionId);
        try {
            await submitGradeApi(submissionId, scoreToSubmit);
            await loadExerciseDetails();
            setError(null);

        } catch (err) {
            console.error(`Error submitting inline grade for submission ${submissionId}:`, err);
            setError(err.message || "خطا در ثبت نمره.");
        } finally {
            setInlineSavingSubmissionId(null);
        }
    }, [inlineScores, currentExercise, loadExerciseDetails]);

    const handleDownloadExerciseFile = useCallback(async (exerciseId, fileName) => {
        try {
            await downloadExerciseFileApi(exerciseId, userRole, fileName);
        } catch (err) {
            console.error("Error downloading exercise file:", err);
            setError(err.message || "خطا در دانلود فایل تمرین.");
        }
    }, [userRole]);

    const handleDownloadSubmissionFile = useCallback(async (submissionId, fileName) => {
        try {
            await downloadSubmissionFileApi(submissionId, userRole, fileName);
        } catch (err) {
            console.error("Error downloading submission file:", err);
            setError(err.message || "خطا در دانلود فایل ارسال شده.");
        }
    }, [userRole]);


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


    const handleDownloadScoreTemplate = useCallback(async () => {
        if (!currentExercise || !currentExercise.id) {
            setScoreUploadError("شناسه تمرین برای دانلود قالب نمره در دسترس نیست.");
            return;
        }
        try {
            await getExerciseScoreTemplateFileApi(currentExercise.id);
            setScoreUploadError("");
        } catch (err) {
            console.error("Error downloading score template:", err);
            setScoreUploadError(err.message || "خطا در دانلود قالب نمره.");
        }
    }, [currentExercise]); 


    const handleScoreFileChange = useCallback((file) => {
        setScoreFile(file);
        setScoreUploadError("");
    }, []);

    const handleUploadScores = useCallback(async () => {
        if (!currentExercise || !currentExercise.id) {
            setScoreUploadError("شناسه تمرین برای آپلود نمره در دسترس نیست.");
            return;
        }
        if (!scoreFile) {
            setScoreUploadError("لطفاً فایل نمره را انتخاب کنید.");
            return;
        }
        setIsUploadingScores(true);
        setScoreUploadError("");
        try {
            const result = await updateExerciseSubmissionScoresApi(currentExercise.id, scoreFile);
            if (result.success) {
                setScoreFile(null);
                setScoreUploadError("");
                await loadExerciseDetails();
            } else {
                setScoreUploadError(result.message || "خطا در بارگذاری نمرات.");
            }
        } catch (err) {
            console.error("Error uploading scores:", err);
            setScoreUploadError(err.message || "خطا در بارگذاری نمرات.");
        } finally {
            setIsUploadingScores(false);
        }
    }, [currentExercise, scoreFile, loadExerciseDetails]); 
    
    const handleCancelScoreUpload = useCallback(() => {
        setScoreFile(null);
        setScoreUploadError("");
        setIsUploadingScores(false);
    }, []);


    useEffect(() => {
        loadExerciseDetails();
    }, [loadExerciseDetails]);

    return {
        currentExercise,
        submissions,
        loading,
        error,
        inlineScores,
        handleInlineScoreChange,
        handleSubmitInlineScore,
        inlineSavingSubmissionId,
        handleDownloadSubmission: handleDownloadSubmissionFile,
        handleDownloadExerciseFile,
        handleDeleteExerciseRequest,
        handleConfirmDeleteExercise,
        handleEditExerciseClick,
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
        formatPersianDate,
        formatPersianTime,
    };
};
