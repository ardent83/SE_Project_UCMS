import { useState, useEffect } from 'react';
import { fetchInstructorProjects, fetchStudentProjects } from '../utils/projectListApi';
import { formatProjectForTable } from '../utils/projectFormatters';

export const useProjectList = ({ userRoleId, pageSize = 4 }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userRoleId) {
            setLoading(false);
            return;
        }

        const loadProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const isInstructor = userRoleId === 1;

                const projectList = isInstructor
                    ? await fetchInstructorProjects(1, pageSize)
                    : await fetchStudentProjects(1, pageSize);
                const formattedProjects = projectList.slice(0, pageSize).map(formatProjectForTable);
                setProjects(formattedProjects);

            } catch (err) {
                console.error("خطا در دریافت پروژه‌ها:", err);
                setError("مشکلی در بارگذاری پروژه‌ها پیش آمده است.");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [userRoleId, pageSize]);

    return { projects, loading, error };
};