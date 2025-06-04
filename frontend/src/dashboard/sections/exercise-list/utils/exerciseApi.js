import { fetchData } from "../../utils/fetchDataApi";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchStudentExercisesByClass = (classId) => {
    const endpoint = `${apiBaseUrl}/api/Exercise/Student?classId=${classId}`;
    return fetchData(endpoint);
};

export const fetchInstructorExercisesByClass = (classId) => {
    const endpoint = `${apiBaseUrl}/api/Exercise/instructor?classId=${classId}`;
    return fetchData(endpoint);
};