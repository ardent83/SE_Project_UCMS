import React, { useRef, } from "react";

export const ExerciseCard = ({ exercise }) => {
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const pathLength = 684;
    const filledLength = pathLength * exercise.percentage;

    const pathStyle = {
        stroke: exercise.statusBorderColor,
        strokeWidth: '1px',
        strokeDasharray: pathLength ? `${filledLength} ${pathLength}` : 'none',
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-64 rounded-lg bg-white border border-neutral-200">
            <svg
                className="absolute top-0 left-0 w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    ref={pathRef}
                    x="1"
                    y="1"
                    rx="6"
                    style={{
                        ...pathStyle,
                        width: 'calc(100% - 2px)',
                        height: 'calc(100% - 2px)',
                    }}
                />
            </svg>
            <div dir="rtl" className="relative p-2 flex flex-col gap-2">
                <div className="w-full flex flex-row-reverse justify-between items-center text-body-04 text-neutralgray-8 border-b border-neutralgray-3 pb-1">
                    <span className={`inline-block px-2 py-0.5 rounded-sm text-caption-02 ${exercise.statusStyle}`}>
                        {exercise.statusText}
                    </span>
                    <p className="text-body-04">{exercise.classTitle}</p>
                </div>
                <div className="w-full flex justify-start items-center text-body-04 gap-1">
                    <span className="font-light text-neutralgray-6">{"تکلیف:"}</span>
                    <span>{exercise.title}</span>
                </div>
                <div className="w-full flex justify-start items-center text-body-04 gap-1">
                    <span className="font-light text-neutralgray-6">{"مهلت ارسال:"}</span>
                    <span>{exercise.endDateFormatted}</span>
                </div>
            </div>
        </div>
    );
};