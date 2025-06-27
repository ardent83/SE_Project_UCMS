// src/hooks/useStudentGradesData.js
import { useState, useEffect, useCallback } from "react";
import { fetchStudentOverallScores, fetchStudentDetailedScoresByClassId } from "../utils/GradeApi";
import { formatToPersianNumber } from '../utils/formatters'; // Corrected import path from global utils

export const useStudentGradesData = () => {
    const [overallScores, setOverallScores] = useState([]);
    const [detailedScores, setDetailedScores] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [loading, setLoading] = useState(true); // Global loading state for initial fetch
    const [error, setError] = useState(null); // Global error state
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch overall scores for all classes for the student
    const loadOverallScores = useCallback(async () => {
        setLoading(true); // Set loading for this specific fetch
        setError(null); // Clear previous errors
        try {
            const data = await fetchStudentOverallScores();
            // Assign a derived 'status' property if backend doesn't provide it directly
            const formattedOverallScores = data.map(course => ({
                ...course,
                // Assuming "قبول" if score >= 10, "رد" if < 10, "نامشخص" if null
                status: course.score !== null ? (course.score >= 10 ? 'قبول' : 'رد') : 'نامشخص'
            }));
            setOverallScores(formattedOverallScores);
            
            // Automatically select the first class to show detailed scores if available
            // This ensures the detailed scores card has data when the page loads
            if (formattedOverallScores && formattedOverallScores.length > 0) {
                setSelectedClassId(formattedOverallScores[0].classId);
            } else {
                setSelectedClassId(null); // No classes, no selection
            }
        } catch (err) {
            console.error("Error loading student overall scores:", err);
            setError(err.message || "خطا در بارگذاری نمرات کلی.");
            setOverallScores([]); // Clear scores on error
        } finally {
            setLoading(false); // Clear loading state after fetch
        }
    }, []); // No external dependencies needed for this callback

    // Fetch detailed scores for a specific class when a class is selected
    const loadDetailedScores = useCallback(async (classId) => {
        if (!classId) {
            setDetailedScores([]); // Clear if no class selected
            return;
        }
        setError(null); // Clear previous errors for detailed scores
        try {
            const data = await fetchStudentDetailedScoresByClassId(classId);
            setDetailedScores(data);
        } catch (err) {
            console.error(`Error loading detailed scores for class ${classId}:`, err);
            setError(err.message || "خطا در بارگذاری جزئیات نمرات درس.");
            setDetailedScores([]); // Clear detailed scores on error
        } finally {
            // Optional: You might want to manage a separate loading state for detailed scores
            // if their loading time is significant and you want to show a spinner
            // specifically for that section. For now, we'll rely on the global 'loading'.
        }
    }, []); // No external dependencies needed for this callback

    // Effect to load overall scores on initial mount
    useEffect(() => {
        loadOverallScores();
    }, [loadOverallScores]); // Dependency on loadOverallScores callback

    // Effect to load detailed scores when selectedClassId changes
    useEffect(() => {
        loadDetailedScores(selectedClassId);
    }, [loadDetailedScores, selectedClassId]); // Dependencies on loadDetailedScores callback and selectedClassId state

    // Filtering logic for overall scores based on search query
    const filteredOverallScores = overallScores.filter(score =>
        score.classTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // detailedScores is already filtered by selectedClassId via the API call
    const currentDetailedScores = detailedScores;

    return {
        overallScores: filteredOverallScores, // Return filtered overall scores
        detailedScores: currentDetailedScores, // Return current detailed scores
        selectedClassId,
        setSelectedClassId,
        loading, // Return global loading state
        error,   // Return global error state
        searchQuery,
        setSearchQuery,
        formatToPersianNumber, // Re-export for use in component
    };
};