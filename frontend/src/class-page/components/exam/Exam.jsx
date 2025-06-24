import {Calendar2, Clock, Location} from "iconsax-react";
import React from "react";
import MyLine from "../MyLine.jsx";

const Exam = ({ color, title, date, time, location }) => {
    const backgroundStyle = {
        backgroundColor: color,
        borderColor: color
    };

    return (
        <div
            className="w-full max-w-40 h-30 py-2 px-4 flex flex-col items-center gap-1 cursor-pointer relative
            transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:z-10"
            dir="ltr"
        >
            <div className="text-caption-03 flex justify-center text-[0.8rem] items-center self-stretch relative z-10">
                {title}
            </div>
            <MyLine className="w-full relative z-10" />
            <div className="h-[3.6rem] flex flex-col items-start gap-2 relative z-10">
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className="text-caption-light text-redp text-[0.7rem] flex justify-end items-center self-stretch">
                        {date}
                    </span>
                    <Calendar2 color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className="text-caption-light text-redp text-[0.7rem] flex justify-end items-center self-stretch">
                        {time}
                    </span>
                    <Clock color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className="text-caption-light text-redp text-[0.7rem] flex justify-end items-center self-stretch">
                        {location}
                    </span>
                    <Location color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
            </div>
            <div className="w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-0 left-0 z-1 rounded-lg" style={backgroundStyle}></div>
            <div className="border border-neutralgray-2 w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-1 left-1 z-0 rounded-lg"></div>
        </div>
    );
};

export default Exam;