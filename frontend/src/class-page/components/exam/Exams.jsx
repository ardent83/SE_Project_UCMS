import React, { useEffect, useRef } from "react";
import Exam from "./Exam.jsx";
import HeadSection from "../HeadSection.jsx";

const Exams = ({ exams }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.scrollLeft = container.scrollWidth;
        }
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-2 ">
            <HeadSection title={"امتحانات"} />
            <div ref={scrollRef} className="w-full overflow-x-auto">
                <div className="flex flex-row gap-4 w-fit pr-2 p-4 text-right">
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
