import { useState, useEffect, useCallback } from "react";
import {
  fetchClassEntries,
  updateClassEntries,
  fetchStudentClassScores,
  fetchStudentClassScoresExport 
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

  const [totalScore, setTotalScore] = useState(20);

  const [studentScores, setStudentScores] = useState(null);

  // Load class entries
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

  // Load student class scores
  const loadStudentClassScores = useCallback(async () => {
    try {
      const data = await fetchStudentClassScores(classId);
      setStudentScores(data);

      const formattedStudents = data.classStudentScoresDtos.map((student) => {
        const scoresByEntry = {};
        data.headers.forEach((entry, index) => {
          const key = `${entry.entryType}-${entry.entryId}`;
          scoresByEntry[key] = student.scores[index];
        });

        return {
          studentId: student.studentId,
          fullName: student.fullName,
          studentNumber: student.studentNumber,
          scoresByEntry,
          total: student.total,
          lastName: student.fullName.split(" ")[0] || "",
          firstName: student.fullName.split(" ").slice(1).join(" ") || "",
        };
      });

      setStudentsGradesData(formattedStudents);
    } catch (err) {
      setError(err.message || "خطا در بارگذاری نمرات دانشجویان کلاس");
      setStudentScores(null);
    }
  }, [classId]);

const downloadScoresExport = async () => {
  try {
    const blob = await fetchStudentClassScoresExport(classId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // نام فایل مناسب با فرمت واقعی
    a.download = `Scores_Report_Class_${classId}.xlsx`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert('خطا در دانلود فایل گزارش');
  }
};


  // Handle input changes in table
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

  // Save changes
  const handleSaveEntries = useCallback(async () => {
    setIsSavingEntries(true);
    setEntrySaveError(null);

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

      const result = await updateClassEntries(
        classId,
        entriesToUpdate,
        totalScore
      );

      if (result.success) {
        await loadClassEntries();
        await loadStudentClassScores(); 
      } else {
        setEntrySaveError(result.message || "خطا در ذخیره تغییرات نمره‌دهی.");
      }
    } catch (err) {
      setEntrySaveError(err.message || "خطای سرور در ذخیره تغییرات.");
    } finally {
      setIsSavingEntries(false);
    }
  }, [
    classId,
    classEntries,
    editedEntries,
    loadClassEntries,
    loadStudentClassScores,
  ]);

  // Initial load
  useEffect(() => {
    if (classId) {
      loadClassEntries();
      loadStudentClassScores();
    } else {
      setLoading(false);
      setError("شناسه کلاس برای بارگذاری گزارش نمرات معتبر نیست.");
    }
  }, [classId, loadClassEntries, loadStudentClassScores]);

  useEffect(() => {
    if (
      !studentScores?.success ||
      !studentScores.classStudentScoresDtos ||
      classEntries.length === 0
    )
      return;

    const students = studentScores.classStudentScoresDtos.map((student) => {
      const scoresByEntry = {};

      classEntries.forEach((entry, index) => {
        const key = `${entry.entryType}-${entry.entryId}`;
        scoresByEntry[key] = student.scores?.[index] ?? 0;
      });

      const [lastName, firstName] = student.fullName.split(" ");

      return {
        studentId: student.studentId,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        firstName,
        lastName,
        total: student.total ?? 0,
        scoresByEntry,
      };
    });

    setStudentsGradesData(students);
  }, [studentScores, classEntries]);

  // Sorting
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

  // Filtered and sorted student grades
  const finalFilteredAndSortedGrades = [...studentsGradesData]
    .filter((grade) => {
      const lowerSearch = searchQuery.trim().toLowerCase();
      return grade.fullName.toLowerCase().includes(lowerSearch);
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

  // Optional fixed labels for displaying headers
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
    studentScores,
    downloadScoresExport
  };
};
