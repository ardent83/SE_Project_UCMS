import { useState, useEffect } from 'react';
import { fetchInstructorClasses, fetchStudentClasses } from '../../class-list/utils/classListApi'; 
import { fetchInstructorExercisesByClass, fetchStudentExercisesByClass } from '../utils/exerciseApi';
import { formatExerciseForCard } from '../utils/exerciseFormatters';

export const useExerciseList = ({ userRoleId }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userRoleId) {
            setLoading(false);
            return;
        }

        const loadAllData = async () => {
            try {
                setLoading(true);
                setError(null);
                const isInstructor = userRoleId === 1;

                const classData = isInstructor
                    ? await fetchInstructorClasses()
                    : await fetchStudentClasses();

                if (!classData.items || classData.items.length === 0) {
                    setLoading(false);
                    return;
                }
                
                let page = 1;
                let allClasses = []
                const totalPages = classData.totalPages;
                while (page <= totalPages || exercises.length >= 4) {
                    const classData = isInstructor
                    ? await fetchInstructorClasses(page, 4)
                    : await fetchStudentClasses(page, 4);

                    page++;

                    if (!classData.items || classData.items.length === 0) break;

                    allClasses = [...allClasses, ...classData.items];
                }
                const exercisePromises = allClasses.map(cls => {
                    return isInstructor
                        ? fetchInstructorExercisesByClass(cls.id)
                        : fetchStudentExercisesByClass(cls.id);
                    });

                const exercisesByClass = await Promise.all(exercisePromises);

                const allExercises = exercisesByClass.flat();
                const formattedExercises = allExercises.map(formatExerciseForCard).slice(0, 4);
                    
                setExercises(formattedExercises);
            } catch (err) {
                setError(".مشکلی در دریافت اطلاعات تکالیف پیش آمد");
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [userRoleId]);

    return { exercises, loading, error };
};