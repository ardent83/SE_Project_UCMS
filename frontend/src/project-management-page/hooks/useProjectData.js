import { useState, useEffect, useCallback } from "react";
import {
    fetchProjectApi,
    fetchPhasesApi,
    downloadProjectFileApi,
    deleteProjectApi
} from "../utils/projectAPI";

import { fetchTeamsApi, deleteTeamApi } from "../utils/teamAPI";

import { formatProjectData } from "../utils/projectFormatters";

export const useProjectData = (projectId, userRole, navigate) => {
    const [project, setProject] = useState(null);
    const [teams, setTeams] = useState([]);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [teamToDeleteDetails, setTeamToDeleteDetails] = useState(null);

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

    const handleDeleteProject = useCallback(async () => {
        setLoading(true);
        try {
            await deleteProjectApi(projectId);
            console.log(`Project ${projectId} deleted successfully.`);
            navigate('/projects', { state: { message: "پروژه با موفقیت حذف شد." } });
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("خطایی در حذف پروژه رخ داد!");
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    const handleDeleteTeamRequest = useCallback((teamId, teamName) => {
        setTeamToDeleteDetails({ id: teamId, name: teamName });
        setShowDeleteTeamModal(true);
    }, []);

    const handleConfirmDeleteTeam = useCallback(async () => {
        if (!teamToDeleteDetails || !teamToDeleteDetails.id) {
            console.error("Error: No team selected for deletion.");
            return;
        }
        try {
            await deleteTeamApi(teamToDeleteDetails.id);
            console.log(`Team "${teamToDeleteDetails.name}" (${teamToDeleteDetails.id}) deleted successfully.`);
            setShowDeleteTeamModal(false); 
            setTeamToDeleteDetails(null); 
            await loadProjectData(); 
        } catch (err) {
            console.error("Error deleting team:", err);
            setError(err.message || "خطایی در حذف تیم رخ داد!"); 
            setShowDeleteTeamModal(false); 
            setTeamToDeleteDetails(null);
        }
    }, [teamToDeleteDetails, loadProjectData]);

    return {
        project,
        teams,
        phases,
        loading,
        error,
        handleDownload,
        handleDeleteProject,
        loadProjectData,
        showDeleteTeamModal,
        setShowDeleteTeamModal,
        teamToDeleteDetails,
        handleDeleteTeamRequest,
        handleConfirmDeleteTeam
    };
};