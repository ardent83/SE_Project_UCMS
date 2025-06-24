import { fetchData } from "../../utils/fetchDataApi";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchStudentExercisesByClass = (classId) => {
    const endpoint = `${apiBaseUrl}/api/Exercise/Student/class/${classId}`;
    return fetchData(endpoint);
};

export const fetchInstructorExercisesByClass = (classId) => {
    const endpoint = `${apiBaseUrl}/api/Exercise/Instructor/class/${classId}`;
    return fetchData(endpoint);
};