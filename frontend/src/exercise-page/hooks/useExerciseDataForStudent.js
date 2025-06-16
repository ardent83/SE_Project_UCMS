import { useState, useEffect, useCallback } from "react";
import {
    fetchExerciseDetailsApi,
    fetchExerciseSubmissionsApi, 
    submitStudentSubmissionApi,
    downloadExerciseFileApi 
} from "../utils/exerciseApi";
import { formatExerciseData, formatPersianDate, formatPersianTime, formatSubmissionData } from "../utils/exerciseFormatters";

export const useExerciseDataForStudent = (exerciseId, userRole) => {
    const [currentExercise, setCurrentExercise] = useState(null);
    const [studentSubmission, setStudentSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("ارسال پاسخ");

    // States for submission form
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionDescription, setSubmissionDescription] = useState("");
    const [submissionError, setSubmissionError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch details for a specific exercise and student's own submission (if any)
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

            // Mock: Fetch student's own submission (replace with real API)
            const rawSubmissions = await fetchExerciseSubmissionsApi(exerciseId, userRole);
            const studentOwnSubmission = rawSubmissions.find(sub => sub.groupId === 'groupA'); // Mocking student's own group
            setStudentSubmission(studentOwnSubmission ? formatSubmissionData(studentOwnSubmission) : null);

        } catch (err) {
            console.error(`Error loading exercise ${exerciseId} details or submission:`, err);
            setError(err.message || "خطا در بارگذاری جزئیات تمرین یا ارسال شما.");
            setCurrentExercise(null);
            setStudentSubmission(null);
        } finally {
            setLoading(false);
        }
    }, [exerciseId, userRole]);

    // Handle student submission
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
                setActiveTab("ارسال‌ها"); // Switch to submissions tab
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

    // <-- تابع جدید برای دانلود فایل اصلی تمرین -->
    const handleDownloadExerciseFile = useCallback(async (exerciseId, fileName) => {
        try {
            await downloadExerciseFileApi(exerciseId, fileName);
        } catch (err) {
            console.error("Error downloading exercise file:", err);
            setError(err.message || "خطا در دانلود فایل تمرین.");
        }
    }, []);

    // Initial data load
    useEffect(() => {
        loadExerciseDetailsAndSubmission();
    }, [loadExerciseDetailsAndSubmission]);

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
        formatPersianDate,
        formatPersianTime,
    };
};