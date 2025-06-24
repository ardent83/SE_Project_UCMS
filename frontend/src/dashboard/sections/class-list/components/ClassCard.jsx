import React from "react"; 
import { Calendar2, Profile, Clock } from 'iconsax-react';
import { useNavigate } from "react-router-dom";

export const ClassCard = ({ color, id, title, instructor, days, times }) => {
    const backgroundStyle = {
        backgroundColor: color,
        borderColor: color
    };
    const navigate = useNavigate();
    const nowarpStyle = "text-body-04 text-redp flex-1 text-end overflow-hidden whitespace-nowrap";

    return (
        <div onClick={() => navigate(`/class/${id}`)} 
            className="w-full max-w-57 h-48 py-4 px-6 flex flex-col items-center gap-1 cursor-pointer relative">
            <div className="text-caption-01 flex justify-end items-center self-stretch relative z-10">
                {title}
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-[#0C1E33] to-transparent relative z-10"></div>
            <div className="w-full h-[3.6rem] flex flex-col items-end gap-2 relative z-10">
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className={`${nowarpStyle}`}>
                        {instructor}
                    </span>
                    <Profile color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className={`${nowarpStyle}`}>
                        {days}
                    </span>
                    <Calendar2 color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className={`${nowarpStyle}`}>
                        {times}
                    </span>
                    <Clock color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
            </div>
            <div className="w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-0 left-0 z-1 rounded-lg" style={backgroundStyle}></div>
            <div className="border border-neutralgray-2 w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-1 left-1 z-0 rounded-lg"></div>
        </div>
    );
};
