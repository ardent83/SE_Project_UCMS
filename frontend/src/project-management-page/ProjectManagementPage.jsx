import React from "react";
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

const projectData = {
  type: "گروهی",
  date: "۱ فروردین، ۰۶:۰۰ - ۳۱ فروردین، ۲۳:۰۰",
  description:
    "توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه / توضیحات اضافی درباره‌ی پروژه   / توضیحات اضافی درباره‌ی پروژه ",
};

const ProjectManagementPage = () => {
  return (
    <div className="project-header-top">
      <div className="title-and-icons">
        <h1 className="project-title">سیستم مدیریت پروژه</h1>
        <div className="project-icons">
          <Folder size="24" variant="Bulk" />
          <Edit size="24" variant="Bulk" />
          <Trash size="24" variant="Bulk" />
        </div>
      </div>

      <div className="project-meta">
        <div className="project-type">
          <span>{projectData.type}</span>
          <People size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-date">
          <span>{projectData.date}</span>
          <Calendar size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <div className="project-description">
          <span>{projectData.description}</span>
          <InfoCircle size={20} style={{ fill: "#495d72" }} variant="Bulk" />
        </div>
        <button className="status-badge">در حال انجام</button>
      </div>
      <hr className="separator" />

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start mt-8">
        <div className="w-full md:basis-2/5">
          <GroupList groups={["تیم اول", "تیم دوم", "تیم سوم", "تیم چهارم"]} />
        </div>
        <div className="w-full md:basis-3/5">
          <PhaseList phases={["فاز اول", "فاز دوم"]} />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementPage;
