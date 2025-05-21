import HeadSection from "../HeadSection.jsx";
import React from "react";
import AssignmentItem from "./AssignmentItem.jsx";

const Assignment = ({ assignments }) => {
    return (
        <section className="flex w-full p-3 gap-2 max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            <HeadSection title={"تمرین‌ها"} />
            <div className="w-full max-h-57 overflow-y-auto flex flex-col gap-2 pr-5">
                {assignments.map((assignment, index) => (
                    <AssignmentItem key={index} assignment={assignment} />
                ))}
            </div>
        </section>
    );
};

export default Assignment;
