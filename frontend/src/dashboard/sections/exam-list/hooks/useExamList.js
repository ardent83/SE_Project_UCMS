import { useState, useEffect } from 'react';
import { fetchInstructorExams, fetchStudentExams } from '../utils/examListApi';
import { formatExamForTable } from '../utils/examFormatters';

export const useExamList = ({ userRoleId, pageSize = 4 }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userRoleId) {
            setLoading(false);
            return;
        }

        const loadExams = async () => {
            try {
                setLoading(true);
                setError(null);
                const isInstructor = userRoleId === 1;

                const fullExamList = isInstructor
                    ? await fetchInstructorExams()
                    : await fetchStudentExams();
                
                const examItems = Array.isArray(fullExamList) ? fullExamList : fullExamList.items || [];

                const formattedExams = examItems.slice(0, pageSize).map(formatExamForTable);
                setExams(formattedExams);

            } catch (err) {
                console.error("خطا در دریافت آزمون‌ها:", err);
                setError("مشکلی در بارگذاری آزمون‌ها پیش آمده است.");
            } finally {
                setLoading(false);
            }
        };

        loadExams();
    }, [userRoleId, pageSize]);

    return { exams, loading, error };
};