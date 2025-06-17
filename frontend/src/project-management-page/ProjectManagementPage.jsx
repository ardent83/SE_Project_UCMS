import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectManagementPage.css";
import PhaseList from "./components/PhaseList";
import GroupList from "./components/GroupList";
import {
  People,
  Calendar,
  InfoCircle,
  Trash,
  Edit,
  Folder,
} from "iconsax-react";
import { useAuth } from "../auth/context/AuthContext";
import Modal from "../components/Modal";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover";
import { useProjectData } from "./hooks/useProjectData";

const ProjectManagementPage = () => {
  const { user } = useAuth();
  const userRole = user?.role?.name || "guest"; 
  const currentUserId = user?.id;

  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
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
    handleConfirmDeleteTeam,
  } = useProjectData(projectId, userRole, navigate);

  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  const handleEditProject = () => {
    navigate(`/project/edit/${projectId}`);
  };

  const handleCreateGroup = () => {
    navigate(`/project/${projectId}/group/create/`);
  };

  const handleCreatePhase = () => {
    navigate(`/project/${projectId}/phase/create/`);
  };

  const defaultProject = {
    title: "سیستم مدیریت پروژه",
    type: "گروهی",
    date: "۱ فروردین، ۰۶:۰۰ - ۳۱ فروردین، ۲۳:۰۰",
    description: "توضیحی وجود ندارد",
    status: "در حال انجام",
  };

  const currentProject = project || defaultProject;

  if (loading)
    return (
      <div className="text-center text-neutralgray-5 mt-4">
        ...در حال بارگذاری
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-4">{error}</div>;

  if (!project) {
    return (
      <div className="text-center text-gray-500 mt-4">
        پروژه یافت نشد یا در دسترس نیست.
      </div>
    );
  }
  console.log("Current Project Description:", currentProject.description);

  return (
    <div className="project-header-top">
      <div className="title-and-icons">
        <h1 className="project-title" data-testid="project-title">{currentProject.title}</h1> {/* Added data-testid */}
        <div className="project-icons">
          <Folder
            size="24"
            variant="Bulk"
            onClick={handleDownload}
            style={{ cursor: "pointer" }}
            data-testid="download-project-icon" // Added data-testid
          />
          {userRole === "Instructor" && (
            <Edit
              size="24"
              variant="Bulk"
              onClick={handleEditProject}
              style={{ cursor: "pointer" }}
              data-testid="edit-project-icon" // Added data-testid
            />
          )}
          {userRole === "Instructor" && (
            <Trash
              size="24"
              variant="Bulk"
              onClick={() => setShowDeleteProjectModal(true)}
              style={{ cursor: "pointer" }}
              className="text-gray-500 hover:text-red-500 transition-colors"
              data-testid="delete-project-icon" // Added data-testid
            />
          )}
        </div>
      </div>

      <div className="project-meta">
        <div className="project-type">
          <span data-testid="project-type-span">{currentProject.type}</span> {/* Added data-testid */}
          <People size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-date">
          <span data-testid="project-date-span">{currentProject.date}</span> {/* Added data-testid */}
          <Calendar size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-description">
          <span
            className={
              !currentProject.description ||
              currentProject.description === "توضیحی وجود ندارد"
                ? "text-light-gray"
                : ""
            }
            data-testid="project-description-span" // Added data-testid
          >
            {currentProject.description}
          </span>
          <InfoCircle size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <button className="status-badge" data-testid="project-status-badge">{currentProject.status}</button> {/* Added data-testid */}
      </div>
      <hr className="separator" />

      <div className="project-content-section">
        <div className="w-full">
          <GroupList
            teams={teams}
            userRole={userRole}
            currentUserId={currentUserId}
            onAddGroupClick={handleCreateGroup}
            onDeleteTeamRequest={handleDeleteTeamRequest}
            data-testid="group-list-section" // Added data-testid
          />
        </div>

        <div className="w-full">
          <PhaseList
            phases={phases}
            projectId={projectId}
            userRole={userRole}
            onAddPhaseClick={handleCreatePhase}
            data-testid="phase-list-section" // Added data-testid
          />
        </div>
      </div>

      {/* Modal for deleting project */}
      <Modal show={showDeleteProjectModal} onClose={() => setShowDeleteProjectModal(false)} data-testid="delete-project-modal"> {/* Added data-testid */}
        <DeleteConfirmModalContent
          onConfirm={() => {
            handleDeleteProject();
            setShowDeleteProjectModal(false);
          }}
          onCancel={() => setShowDeleteProjectModal(false)}
          message="آیا از حذف این پروژه مطمئن هستید؟"
          data-testid="delete-project-confirm-content" // Added data-testid
        />
      </Modal>

      {/* Modal for deleting team */}
      <Modal show={showDeleteTeamModal} onClose={() => setShowDeleteTeamModal(false)} data-testid="delete-team-modal"> {/* Added data-testid */}
        <DeleteConfirmModalContent
          onConfirm={handleConfirmDeleteTeam}
          onCancel={() => setShowDeleteTeamModal(false)}
          message={
            teamToDeleteDetails
              ? `آیا از حذف تیم "${teamToDeleteDetails.name}" مطمئن هستید؟ این عمل غیرقابل بازگشت است.`
              : "آیا از حذف این تیم مطمئن هستید؟"
          }
          data-testid="delete-team-confirm-content" // Added data-testid
        />
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;
