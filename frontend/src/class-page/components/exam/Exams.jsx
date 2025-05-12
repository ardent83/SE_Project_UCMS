import React from "react";
import Exam from "./Exam.jsx";
import HeadSection from "../HeadSection.jsx";

const Exams = ({ exams }) => {
    return (
        <div className="w-full flex flex-col items-center gap-2 ">
            <HeadSection title={"امتحانات"} />
            <div className="w-full overflow-x-auto">
                <div className="flex flex-row gap-4 w-fit pr-2 p-4">
                    {exams.map((exam, index) => (
                        <div key={index} className="min-w-[150px]">
                            <Exam
                                color={exam.color}
                                title={exam.title}
                                date={exam.date}
                                time={exam.time}
                                location={exam.location}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Exams;
