import { useState, useEffect, useCallback } from "react";
import {
    fetchClassEntries,
    updateClassEntries,
    fetchInstructorStudentsGrades,
} from "../utils/GradeApi";
import { formatToPersianNumber } from "../utils/formatters";

export const useInstructorGradesData = (classId) => {
    const [studentsGradesData, setStudentsGradesData] = useState([]);
    const [classEntries, setClassEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const [editedEntries, setEditedEntries] = useState({});
    const [isSavingEntries, setIsSavingEntries] = useState(false);
    const [entrySaveError, setEntrySaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [totalScore, setTotalScore] = useState(20);

    const loadStudentsGrades = useCallback(async () => {
        try {
            const data = await fetchInstructorStudentsGrades(classId);
            setStudentsGradesData(data);
        } catch (err) {
            setError(err.message || "خطا در بارگذاری گزارش نمرات دانشجویان.");
            setStudentsGradesData([]);
        }
    }, [classId]);

    const loadClassEntries = useCallback(async () => {
        setLoading(true);
        setError(null);
        setEntrySaveError(null);
        try {
            let data = await fetchClassEntries(classId);

            data = data.map((entry, index) => ({
                ...entry,
                entryType:
                    entry.entryType !== undefined && entry.entryType !== null
                        ? entry.entryType
                        : `unknownType-${entry.entryId || index}`,
            }));

            setClassEntries(data);
            setEditedEntries({});
        } catch (err) {
            setError(err.message || "خطا در بارگذاری جزئیات نمره‌دهی.");
            setClassEntries([]);
        } finally {
            setLoading(false);
        }
    }, [classId]);

    const handleEntryChange = useCallback((entryType, entryId, field, value) => {
        const key = `${entryType}-${entryId}`;
        const numericValue = value === "" ? "" : Number(value);

        setEditedEntries((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                entryType,
                entryId,
                [field]: numericValue,
            },
        }));
    }, []);

    const handleSaveEntries = useCallback(async () => {
        setIsSavingEntries(true);
        setEntrySaveError(null);
        setSaveSuccess(false);

        try {
            const entriesToUpdate = classEntries.map((entry) => {
                const key = `${entry.entryType}-${entry.entryId}`;
                const edited = editedEntries[key];

                return {
                    entryId: entry.entryId,
                    entryType: entry.entryType,
                    partialScore:
                        edited?.partialScore !== undefined
                            ? edited.partialScore
                            : entry.partialScore,
                    portionInTotalScore:
                        edited?.portionInTotalScore !== undefined
                            ? edited.portionInTotalScore
                            : entry.portionInTotalScore,
                };
            });

            const totalScore = editedEntries.totalScore ?? 100;

            const result = await updateClassEntries(classId, entriesToUpdate, totalScore);

            if (result.success) {
                await loadClassEntries();
                await loadStudentsGrades();

                setSaveSuccess(true);

                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setEntrySaveError(result.message || "خطا در ذخیره تغییرات نمره‌دهی.");
            }
        } catch (err) {
            setEntrySaveError(err.message || "خطای سرور در ذخیره تغییرات.");
        } finally {
            setIsSavingEntries(false);
        }
    }, [classId, classEntries, editedEntries, loadClassEntries, loadStudentsGrades]);

    useEffect(() => {
        if (classId) {
            loadStudentsGrades();
            loadClassEntries();
        } else {
            setLoading(false);
            setError("شناسه کلاس برای بارگذاری گزارش نمرات معتبر نیست.");
        }
    }, [classId, loadStudentsGrades, loadClassEntries]);

    const handleSort = useCallback((key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    }, []);

    const finalFilteredAndSortedGrades = [...studentsGradesData]
        .filter((grade) => {
            const lowerSearch = searchQuery.trim().toLowerCase();
            return (
                grade.firstName.toLowerCase().includes(lowerSearch) ||
                grade.lastName.toLowerCase().includes(lowerSearch)
            );
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const aValue = a[sortConfig.key] || "";
            const bValue = b[sortConfig.key] || "";
            return sortConfig.direction === "asc"
                ? aValue > bValue
                    ? 1
                    : -1
                : aValue < bValue
                    ? 1
                    : -1;
        });

    const fixedDetailedGradesLabels = [
        { label: "کوییز ۳", entryType: 0, score: 20, weight: 20 },
        { label: "فاز اول", entryType: 1, score: 20, weight: 20 },
        { label: "فاز دوم", entryType: 2, score: 20, weight: 25 },
        { label: "میان ترم", entryType: 3, score: 20, weight: 25 },
        { label: "پایان ترم", entryType: 4, score: 20, weight: 20 },
    ];

    return {
        studentsGradesData: finalFilteredAndSortedGrades,
        classEntries,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        setEditedEntries,
        sortConfig,
        handleSort,
        formatToPersianNumber,
        handleEntryChange,
        handleSaveEntries,
        editedEntries,
        isSavingEntries,
        entrySaveError,
        fixedDetailedGradesLabels,
        totalScore,
        setTotalScore,
        saveSuccess,
    };
};
