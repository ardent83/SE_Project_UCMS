const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { fetchData } from "../../utils/fetchDataApi";

export const fetchInstructorProjects = (page = 1, pageSize = 4) => {
    const endpoint = `${apiBaseUrl}/api/Project/instructor?page=${page}&pageSize=${pageSize}`;
    return fetchData(endpoint);
};

export const fetchStudentProjects = (page = 1, pageSize = 4) => {
    const endpoint = `${apiBaseUrl}/api/Project/Student?page=${page}&pageSize=${pageSize}`;
    return fetchData(endpoint);
};