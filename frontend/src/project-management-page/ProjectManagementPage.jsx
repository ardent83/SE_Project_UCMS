import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ProjectManagementPage = () => {
  const { user } = useAuth();
  const userRole = user?.data?.role?.name || "guest";
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    try {
      if (!projectId) {
        throw new Error("شناسه پروژه معتبر نیست!");
      }

      let apiEndpoint;
      if (userRole === "Instructor") {
        apiEndpoint = `${apiBaseUrl}/api/Project/Instructor/${projectId}`;
      } else if (userRole === "Student") {
        apiEndpoint = `${apiBaseUrl}/api/Project/Student/${projectId}`;
      } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
      }

      console.log("Fetching project from:", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (!data.startDate || !data.endDate) {
        throw new Error("داده‌های تاریخ ناقص است!");
      }
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const formattedStartDate = startDate.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const formattedStartTime = startDate.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedEndDate = endDate.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const formattedEndTime = endDate.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDate = `${formattedStartDate}، ${formattedStartTime} - ${formattedEndDate}، ${formattedEndTime}`;

      const projectType = data.projectType === 1 ? "فردی" : "گروهی";

      let statusText;
      switch (data.projectStatus) {
        case 0:
          statusText = "شروع نشده";
          break;
        case 1:
          statusText = "در حال انجام";
          break;
        case 2:
          statusText = "تکمیل شده";
          break;
        default:
          statusText = "وضعیت نامشخص";
      }

      setProject({
        ...data,
        date: formattedDate,
        type: projectType,
        status: statusText,
        description: data.description || "توضیحات اضافی درباره‌ی پروژه...",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("خطایی در دریافت اطلاعات پروژه رخ داد!");
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      let downloadEndpoint;
      if (userRole === "Instructor") {
        downloadEndpoint = `${apiBaseUrl}/api/Project/${projectId}/downloadForInstructor`;
      } else if (userRole === "Student") {
        downloadEndpoint = `${apiBaseUrl}/api/Project/${projectId}/downloadForStudent`;
      } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
      }

      const response = await fetch(downloadEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project_${projectId}.${project.projectFileContentType?.split("/")[1] || "pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
      setError("خطایی در دانلود فایل رخ داد!");
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId, userRole]);

  const defaultProject = {
    type: "گروهی",
    date: "۱ فروردین، ۰۶:۰۰ - ۳۱ فروردین، ۲۳:۰۰",
    description: "توضیحات اضافی درباره‌ی پروژه...",
    status: "در حال انجام",
  };

  const currentProject = project || defaultProject;
  const groups = ["تیم اول", "تیم دوم", "تیم سوم", "تیم چهارم"];
  const phases = ["فاز اول", "فاز دوم"];

  if (loading) return <div>...در حال بارگذاری</div>;
  if (error) return <div className="text-center text-red-500 mt-4">{error}</div>;

  return (
    <div className="project-header-top">
      <div className="title-and-icons">
        <h1 className="project-title">{currentProject.title || "سیستم مدیریت پروژه"}</h1>
        <div className="project-icons">
          <Folder
            size="24"
            variant="Bulk"
            onClick={handleDownload}
            style={{ cursor: "pointer" }}
          />
          <Edit size="24" variant="Bulk" />
          <Trash size="24" variant="Bulk" />
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
        <div className="w-full md:basis-2/5">
          <GroupList groups={groups} />
        </div>
        <div className="w-full md:basis-3/5">
          <PhaseList phases={phases} />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementPage;