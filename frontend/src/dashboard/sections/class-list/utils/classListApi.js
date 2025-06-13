const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { fetchData } from "../../utils/fetchDataApi";

export const fetchStudentClasses = async (page = 1, pageSize = 4) => {
    const endpoint = `${apiBaseUrl}/api/StudentClass/Student/classes?Page=${page}&PageSize=${pageSize}`;
    return fetchData(endpoint);
};

export const fetchInstructorClasses = async (page = 1, pageSize = 4) => {
    const endpoint = `${apiBaseUrl}/api/Classes/instructor?page=${page}&pageSize=${pageSize}`;
    return fetchData(endpoint);
};

export const fetchStudentClassDetailById = async (classId) => {
    const endpoint = `${apiBaseUrl}/api/StudentClass/student/${classId}`;
    return fetchData(endpoint);
}

export const fetchInstructorClassDetailById = async (classId) => {
    const endpoint = `${apiBaseUrl}/api/Classes/instructor/${classId}`;
    return fetchData(endpoint);
}
