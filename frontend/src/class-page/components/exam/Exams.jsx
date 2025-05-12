import React from "react";
import Exam from "./Exam.jsx";
import HeadSection from "../HeadSection.jsx";

const Exams = ({ exams }) => {
    return (
        <div className="w-full flex flex-col items-center gap-2">
            <HeadSection title={"امتحانات"} />
            <div className="w-full flex justify-between items-start">
                {exams.map((exam, index) => (
                    <Exam
                        key={index}
                        color={exam.color}
                        title={exam.title}
                        date={exam.date}
                        time={exam.time}
                        location={exam.location}
                    />
                ))}
            </div>
        </div>
    );
}

export default Exams;