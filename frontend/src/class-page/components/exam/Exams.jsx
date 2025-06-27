import React, { useEffect, useRef } from "react";
import Exam from "./Exam.jsx";
import HeadSection from "../HeadSection.jsx";
import { useNavigate } from "react-router-dom";
const Exams = ({ exams, classId }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.scrollLeft = container.scrollWidth;
        }
    }, []);

    const handleAddExam = () => {
        navigate(`/class/${classId}/exam/create`);
    };

    return (
        <div className="w-full flex flex-col items-center gap-2">
            <HeadSection title="امتحانات" onClick={handleAddExam} />
            {exams.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <img
                        src="/src/class-page/assets/exam-not-found.png"
                        alt="No members"
                        className="w-20 h-20 "
                    />
                    <span className="text-caption-02 text-[0.7rem] text-neutral-400">! امتحانی ثبت نشده‌است</span>
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="w-full overflow-x-auto"
                    style={{ direction: "rtl" }}
                >
                    <div className="flex flex-row gap-4 w-fit pl-2 p-4 text-right">
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
            )}
        </div>
    );
};

export default Exams;
