import React from "react";

export const HeadSection = ({ title, onClik ,icon}) => {
    return (
        <div className="flex w-full h-[1.69613rem] items-center gap-[0.21175rem] px-[0.21175rem] py-0">
            <button onClick={onClik} className="flex justify-center items-center text-caption-04 text-[color:#2F80ED] cursor-pointer">
                {"<همه"}
            </button>
            <span className="w-full border-b-[color:#EDF2F7] opacity-[0.6] h-[0.04313rem] border-b-[0.689px]"></span>
            <span className="text-redp text-body-04">{title}</span>
            {icon}
        </div>
    );
}