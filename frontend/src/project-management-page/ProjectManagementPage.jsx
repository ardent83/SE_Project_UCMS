import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PhaseList from "./components/PhaseList";
import GroupList from "./components/GroupList";
import {
  People,
  Calendar,
  Trash,
  Edit2,
  DirectboxNotif,
  Information
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
    <div className="w-full max-w-[90rem] mx-auto px-10 text-bg-blue">
      <div className="w-full flex flex-col items-center">
        {/* Exercise Title and Actions */}
        <div
          className="w-full flex justify-between items-center pb-10"
          dir="rtl"
        >
          <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15" data-testid="project-title">
            {currentProject.title}
          </h2>
          <div className="flex gap-4 text-gray-600 mt-15">
            <div title="دانلود فایل پروژه" className="cursor-pointer">
              <DirectboxNotif
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={handleDownload}
                style={{ cursor: "pointer" }}
                data-testid="download-project-icon" // Added data-testid
              />
            </div>
            <div title="ویرایش تمرین" className="cursor-pointer">
              <Edit2
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={handleEditProject}
                style={{ cursor: "pointer" }}
                data-testid="edit-project-icon" // Added data-testid
              />
            </div>
            <div title="حذف پروژه" className="cursor-pointer">
              <Trash
                size="30"
                variant="Bulk"
                color="#08146f"
                onClick={() => setShowDeleteProjectModal(true)}
                style={{ cursor: "pointer" }}
                data-testid="delete-project-icon" // Added data-testid
              />
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div
          className="w-full pt-4 space-y-4 text-body-01 text-gray-700"
          dir="rtl"
        >
          <div className="text-lg flex items-center gap-2">
            <People
              size="25"
              variant="Linear"
              color="#495D72"
              className="flex-shrink-0 mt-1"
            />
            <span data-testid="project-type-span">{currentProject.type}</span>
          </div>
          <div className="text-lg flex items-center gap-2">
            <Calendar
              size="25"
              variant="Linear"
              color="#495D72"
              className="flex-shrink-0 mt-1"
            />
            <span data-testid="project-date-span">
              {currentProject.date}
            </span>
          </div>
          <div className="text-lg flex items-start gap-2">
            <Information
              size="25"
              variant="Linear"
              color="#495D72"
              className="flex-shrink-0 mt-1"
            />
            <span
              className={`flex-1 leading-6 text-right ${!currentProject.description ||
                currentProject.description === "توضیحی وجود ندارد"
                ? "text-[#d1d5db]"
                : ""
                }`}
              data-testid="project-description-span"
            >
              {currentProject.description}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-big-stone-50 text-big-stone-400 border-none rounded-full px-4 py-2 text-sm font-medium cursor-default"
              data-testid="project-status-badge"
            >
              {currentProject.status}
            </button>
          </div>

        </div>
      </div>


      <hr className="border-t border-gray-300 my-4" />

      <div className="flex flex-col md:flex-row md:items-start justify-center gap-8 mt-8 w-full" dir="rtl">
        <div className="w-full lg:w-[calc(35%-0.75rem)] lg:max-w-[calc(35%-0.75rem)]">
          <GroupList
            teams={teams}
            userRole={userRole}
            currentUserId={currentUserId}
            onAddGroupClick={handleCreateGroup}
            onDeleteTeamRequest={handleDeleteTeamRequest}
            data-testid="group-list-container"
          />
        </div>

        <div className="w-full lg:w-[calc(65%-0.75rem)] lg:max-w-[calc(65%-0.75rem)]">
          <PhaseList
            phases={phases}
            projectId={projectId}
            userRole={userRole}
            onAddPhaseClick={handleCreatePhase}
            data-testid="phase-list-container"
          />
        </div>
      </div>
      {/* Modal for deleting project */}
      <Modal
        show={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
        data-testid="delete-project-modal"
      >
        {" "}
        {/* Added data-testid */}
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
      <Modal
        show={showDeleteTeamModal}
        onClose={() => setShowDeleteTeamModal(false)}
        data-testid="delete-team-modal"
      >
        {" "}
        {/* Added data-testid */}
        <DeleteConfirmModalContent
          onConfirm={handleConfirmDeleteTeam}
          onCancel={() => setShowDeleteTeamModal(false)}
          message={
            teamToDeleteDetails
              ? `آیا از حذف تیم ${teamToDeleteDetails.name} مطمئن هستید؟`
              : "آیا از حذف این تیم مطمئن هستید؟"
          }
          data-testid="delete-team-confirm-content" // Added data-testid
        />
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;
