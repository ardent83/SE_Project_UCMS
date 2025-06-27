import { useState, useEffect, useCallback } from "react";
import { fetchStudentOverallScores, fetchStudentDetailedScoresByClassId } from "../utils/GradeApi";
import { formatToPersianNumber } from '../utils/formatters';

export const useStudentGradesData = () => {
    const [overallScores, setOverallScores] = useState([]);
    const [detailedScores, setDetailedScores] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);

    const [loadingOverall, setLoadingOverall] = useState(false);
    const [errorOverall, setErrorOverall] = useState(null);

    const [loadingDetailed, setLoadingDetailed] = useState(false);
    const [errorDetailed, setErrorDetailed] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    const loadOverallScores = useCallback(async () => {
        setLoadingOverall(true);
        setErrorOverall(null);
        try {
            const data = await fetchStudentOverallScores();
            const formattedOverallScores = data.map(course => ({
                ...course,
                status: course.score !== null ? (course.score >= 10 ? 'قبول' : 'رد') : 'نامشخص'
            }));
            setOverallScores(formattedOverallScores);

            if (formattedOverallScores.length > 0) {
                setSelectedClassId(formattedOverallScores[0].classId);
            } else {
                setSelectedClassId(null);
            }
        } catch (err) {
            console.error("Error loading student overall scores:", err);
            setErrorOverall(err.message || "خطا در بارگذاری نمرات کلی.");
            setOverallScores([]);
            setSelectedClassId(null);
        } finally {
            setLoadingOverall(false);
        }
    }, []);

    const loadDetailedScores = useCallback(async (classId) => {
        if (!classId) {
            setDetailedScores([]);
            setErrorDetailed(null);
            setLoadingDetailed(false);
            return;
        }
        setLoadingDetailed(true);
        setErrorDetailed(null);
        try {
            const data = await fetchStudentDetailedScoresByClassId(classId);
            setDetailedScores(data);
        } catch (err) {
            console.error(`Error loading detailed scores for class ${classId}:`, err);
            setErrorDetailed(err.message || "خطا در بارگذاری جزئیات نمرات درس.");
            setDetailedScores([]);
        } finally {
            setLoadingDetailed(false);
        }
    }, []);

    useEffect(() => {
        loadOverallScores();
    }, [loadOverallScores]);

    useEffect(() => {
        loadDetailedScores(selectedClassId);
    }, [loadDetailedScores, selectedClassId]);

    const filteredOverallScores = overallScores.filter(score =>
        score.classTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        overallScores: filteredOverallScores,
        detailedScores,
        selectedClassId,
        setSelectedClassId,
        loadingOverall,
        errorOverall,
        loadingDetailed,
        errorDetailed,
        searchQuery,
        setSearchQuery,
        formatToPersianNumber,
    };
};
