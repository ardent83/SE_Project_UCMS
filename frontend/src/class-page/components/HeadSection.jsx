import {Add} from "iconsax-react";
import React from "react";

const HeadSection = ({ title, onClik }) => {
    return (
        <div className="flex w-full h-[1.69613rem] items-center gap-[0.21175rem] px-[0.21175rem] py-0">
            <div onClick={onClik} className="flex h-[1.69613rem] justify-center items-center p-[0.33925rem] rounded-[0.25444rem] bg-[#ECF9FD]">
                <Add color="var(--color-redp)" size={24} />
            </div>
            <span className="w-full border-b-[color:#EDF2F7] opacity-[0.6] h-[0.04313rem] border-b-[0.689px]"></span>
            <span className="text-redp text-body-04">{title}</span>
        </div>
    );
}

export default HeadSection;