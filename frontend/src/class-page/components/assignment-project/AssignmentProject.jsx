import HeadSection from "../HeadSection.jsx";
import React from "react";
import AssignmentItem from "./AssignmentItem.jsx";
import {useNavigate} from "react-router-dom";
import assignment from "./Assignment.jsx";

const AssignmentProject = ({projects, classId}) => {
    const navigate = useNavigate();

    const handleAddProject = () => {
        navigate(`/class/${classId}/project/create`);
    };

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <section
            className="flex w-full p-3 gap-2 max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg ">
            <HeadSection title={"پروژه‌ها"} onClick={handleAddProject}/>
            {projects.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center mt-15">
                    <img
                        src="/src/class-page/assets/project-not-found.png"
                        alt="No members"
                        className="w-35 h-30 "
                    />
                    <span className="text-caption-02 text-[0.9rem] text-neutral-400 mt-5 mb-10">! پروژه‌ای وجود ندارد</span>
                </div>
            ) : (
                <div className="w-full max-h-150 overflow-y-auto flex flex-col gap-2 pr-5 relative">
                    {projects.map((assignment, index) => (
                        <AssignmentItem
                            key={index}
                            assignment={assignment}
                            onClick={() => handleProjectClick(assignment.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default AssignmentProject;
