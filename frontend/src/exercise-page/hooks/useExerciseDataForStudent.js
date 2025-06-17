// src/features/ExercisePage/hooks/useExerciseDataForStudent.js
import { useState, useEffect, useCallback } from "react";
import {
    fetchExerciseDetailsApi,
    fetchExerciseSubmissionsApi,
    submitStudentSubmissionApi,
    downloadExerciseFileApi,
    downloadSubmissionFileApi
} from "../utils/exerciseApi";
import { formatExerciseData, formatPersianDate, formatPersianTime, formatSubmissionData } from "../utils/exerciseFormatters";
import { useAuth } from "../../auth/context/AuthContext";


export const useExerciseDataForStudent = (exerciseId, userRole) => {
    const { user } = useAuth();
    const currentUserId = user?.data?.id;

    const [currentExercise, setCurrentExercise] = useState(null);
    const [studentSubmission, setStudentSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("ارسال پاسخ");

    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionDescription, setSubmissionDescription] = useState("");
    const [submissionError, setSubmissionError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [sortBy, setSortBy] = useState(0); // 0 = Date
    const [sortOrder, setSortOrder] = useState(0); // 0 = Ascending


    const loadExerciseDetailsAndSubmission = useCallback(async () => {
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

            const submissionsFilterDto = {
                ExerciseId: exerciseId,
                SortBy: sortBy,
                SortOrder: sortOrder,
            };
            const rawSubmissionsResponse = await fetchExerciseSubmissionsApi(exerciseId, userRole, submissionsFilterDto);
            // <-- تغییر اینجا: به rawSubmissionsResponse.items دسترسی پیدا می‌کنیم -->
            const rawSubmissions = rawSubmissionsResponse.items || []; // حالا این یک آرایه است

            const studentOwnSubmission = rawSubmissions.find(sub =>
                sub.studentId === currentUserId ||
                sub.teamMembers?.some(member => member.studentId === currentUserId)
            );
            setStudentSubmission(studentOwnSubmission ? formatSubmissionData(studentOwnSubmission) : null);

        } catch (err) {
            console.error(`Error loading exercise ${exerciseId} details or submission:`, err);
            setError(err.message || "خطا در بارگذاری جزئیات تمرین یا ارسال شما.");
            setCurrentExercise(null);
            setStudentSubmission(null);
        } finally {
            setLoading(false);
        }
    }, [exerciseId, userRole, currentUserId, sortBy, sortOrder]);

    const handleSubmitAnswer = useCallback(async (file, description) => {
        setIsSubmitting(true);
        setSubmissionError("");
        try {
            if (!file) {
                setSubmissionError("لطفاً فایل پاسخ را انتخاب کنید.");
                setIsSubmitting(false);
                return;
            }
            const result = await submitStudentSubmissionApi(exerciseId, file, description);

            if (result.success) {
                await loadExerciseDetailsAndSubmission();
                setSubmissionFile(null);
                setSubmissionDescription("");
                setActiveTab("ارسال‌ها");
            } else {
                setSubmissionError(result.message || "خطا در ارسال پاسخ.");
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            setSubmissionError(err.message || "خطای شبکه یا سرور در ارسال پاسخ.");
        } finally {
            setIsSubmitting(false);
        }
    }, [exerciseId, loadExerciseDetailsAndSubmission]);

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

    useEffect(() => {
        if (currentUserId !== undefined) {
             loadExerciseDetailsAndSubmission();
        }
    }, [loadExerciseDetailsAndSubmission, currentUserId]);

    const sortByOptionsStudent = [
        { label: "تاریخ ارسال", value: 0 },
    ];
    const sortOrderOptions = [
        { label: "صعودی", value: 0 },
        { label: "نزولی", value: 1 },
    ];

    return {
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
        handleDownloadExerciseFile,
        handleDownloadSubmission: handleDownloadSubmissionFile,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        sortByOptionsStudent,
        sortOrderOptions,
        formatPersianDate,
        formatPersianTime,
    };
};
