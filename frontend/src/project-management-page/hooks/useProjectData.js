import { useState, useEffect, useCallback } from "react";
import {
    fetchProjectApi,
    fetchPhasesApi,
    downloadProjectFileApi,
    deleteProjectApi
} from "../utils/projectAPI";

import { fetchTeamsApi } from "../utils/teamAPI"; 

import { formatProjectData } from "../utils/projectFormatters";

export const useProjectData = (projectId, userRole, navigate) => {
    const [project, setProject] = useState(null);
    const [teams, setTeams] = useState([]);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProjectData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [projectData, teamsData, phasesData] = await Promise.all([
                fetchProjectApi(projectId, userRole),
                fetchTeamsApi(projectId, userRole),
                fetchPhasesApi(projectId, userRole),
            ]);

            const formattedProject = formatProjectData(projectData);

            setProject(formattedProject);
            setTeams(teamsData);
            setPhases(phasesData);
        } catch (err) {
            console.error("Error loading project data:", err);
            if (err.status === 404) {
                setError("پروژه مورد نظر یافت نشد یا پاک شده است.");
                setTimeout(() => {
                    navigate('/projectsPage', { state: { message: "پروژه مورد نظر یافت نشد یا پاک شده است." } });
                }, 1000);
            } else {
                setError(err.message || "خطایی در بارگذاری اطلاعات پروژه رخ داد!");
            }
        } finally {
            setLoading(false);
        }
    }, [projectId, userRole, navigate]);

    useEffect(() => {
        if (projectId && userRole) {
            loadProjectData();
        } else if (!projectId) {
            setError("شناسه پروژه معتبر نیست.");
            setLoading(false);
        }
    }, [projectId, userRole, loadProjectData]);

    const handleDownload = useCallback(async () => {
        try {
            await downloadProjectFileApi(
                projectId,
                userRole,
                project?.projectFileContentType,
                project?.title
            );
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("خطایی در دانلود فایل رخ داد!");
        }
    }, [projectId, userRole, project]);

    const handleDelete = useCallback(async () => {
        setLoading(true);
        try {
            await deleteProjectApi(projectId);
            console.log(`Project ${projectId} deleted successfully.`);
            navigate('/projectsPage', { state: { message: "پروژه با موفقیت حذف شد." } });
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("خطایی در حذف پروژه رخ داد!");
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    return { project, teams, phases, loading, error, handleDownload, handleDelete, loadProjectData };
};