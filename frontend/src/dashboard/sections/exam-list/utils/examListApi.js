import { fetchData } from "../../utils/fetchDataApi";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchInstructorExams = async () => {
    const endpoint = `${apiBaseUrl}/api/Instructor/exams`;
    return fetchData(endpoint);
};

export const fetchStudentExams = async () => {
    const endpoint = `${apiBaseUrl}/api/Student/exams`;
    return fetchData(endpoint);
};