import { useState, useEffect } from 'react';
import { 
    fetchInstructorClasses, 
    fetchStudentClasses, 
    fetchInstructorClassDetailById, 
    fetchStudentClassDetailById } from '../utils/classListApi';
import { formatClassForCard } from '../utils/classFormatters';

export const useClassList = ({ userRoleId, userFullName, pageSize = 4 }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userRoleId) return;

        const fetchInitialClasses = async () => {
            try {
                setLoading(true);
                setError(null);
                const isInstructor = userRoleId === 1;

                const initialData = isInstructor
                    ? await fetchInstructorClasses(1, pageSize)
                    : await fetchStudentClasses(1, pageSize);

                const detailedClasses = await Promise.all(
                    initialData.items.map(async (cls, index) => {
                        const detail = isInstructor
                            ? await fetchInstructorClassDetailById(cls.id)
                            : await fetchStudentClassDetailById(cls.id);
                        return formatClassForCard(detail, index, isInstructor, userFullName);
                    })
                );

                setClasses(detailedClasses);
            } catch (err) {
                console.error('Error fetching class data:', err);
                setError('خطا در بارگذاری کلاس‌ها');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialClasses();
    }, [userRoleId, userFullName, pageSize]);

    return { classes, loading, error };
};