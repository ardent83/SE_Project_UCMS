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
    handleDelete,
  } = useProjectData(projectId, userRole, navigate);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditProject = () => {
    navigate(`/project/edit/${projectId}`);
  };

  const handleCreateGroup = () => {
    navigate(`/project/${projectId}/group/create/`);
  };

  const handleCreatePhase = () => {
    navigate(`/project/${projectId}/phase/create/`);
  };
  // ------------------------------------------

  // default project
  const defaultProject = {
    title: "سیستم مدیریت پروژه",
    type: "گروهی",
    date: "۱ فروردین، ۰۶:۰۰ - ۳۱ فروردین، ۲۳:۰۰",
    description: "توضیحات اضافی درباره‌ی پروژه...",
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

  return (
    <div className="project-header-top">
      <div className="title-and-icons">
        <h1 className="project-title">{currentProject.title}</h1>
        <div className="project-icons">
          <Folder
            size="24"
            variant="Bulk"
            onClick={handleDownload}
            style={{ cursor: "pointer" }}
          />
          {userRole === "Instructor" && (
            <Edit
              size="24"
              variant="Bulk"
              onClick={handleEditProject}
              style={{ cursor: "pointer" }}
            />
          )}
          {userRole === "Instructor" && (
            <Trash
              size="24"
              variant="Bulk"
              onClick={() => setShowDeleteModal(true)}
              style={{ cursor: "pointer" }}
              className="text-gray-500 hover:text-red-500 transition-colors"
            />
          )}
        </div>
      </div>

      <div className="project-meta">
        <div className="project-type">
          <span>{currentProject.type}</span>
          <People size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-date">
          <span>{currentProject.date}</span>
          <Calendar size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-description">
          <span>{currentProject.description}</span>
          <InfoCircle size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <button className="status-badge">{currentProject.status}</button>
      </div>
      <hr className="separator" />

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start mt-8">
        {/* GroupList */}
        <div className="w-full md:basis-2/5">
          <GroupList
            teams={teams}
            userRole={userRole}
            currentUserId={currentUserId}
            onAddGroupClick={handleCreateGroup}
          />
        </div>

        {/* PhaseList */}
        <div className="w-full md:basis-3/5">
          <PhaseList
            phases={phases}
            projectId={projectId}
            userRole={userRole}
            onAddPhaseClick={handleCreatePhase}
          />
        </div>
      </div>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteConfirmModalContent
          onConfirm={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
          message="آیا از حذف این پروژه مطمئن هستید؟"
        />
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;
