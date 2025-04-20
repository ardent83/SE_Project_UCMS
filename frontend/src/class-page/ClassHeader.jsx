import { Calendar2, Edit, More, Clock } from "iconsax-react";
import React from "react";

export default function ClassHeader({ title, startDate, endDate, days, times }) {
    return (
        <div className="relative w-full h-48 p-4 pr-6 flex flex-col justify-between items-center self-stretch">
            <div className="flex items-center gap-[0.625rem] self-stretch z-10 relative">
                <Edit color="#495D72" size={24} variant="Outline" />
                <More color="#495D72" size={24} variant="Bold" />
            </div>
            <div className="w-full h-fit flex justify-between items-center self-stretch z-10 relative">
                <div className="text-body-03 text-redp flex w-46 flex-col gap-2 ">
                    <span className="flex justify-end items-center gap-2 self-stretch">
                        <span className="felx justify-end items-center">{days}</span>
                        <Calendar2 color="#495D72" size={24} variant="Bold" />
                    </span>
                    <span className="flex justify-end items-center gap-2 self-stretch">
                        <span className="felx justify-end items-center">{times}</span>
                        <Clock color="#495D72" size={24} variant="Bold" />
                    </span>
                </div>
                <div className="w-fit h-[3.64rem] flex flex-col items-end gap-1">
                    <span className="text-heading-h5 text-white text-right">{title}</span>
                    <div className="flex justify-end items-center gap-1 self-stretch">
                        <span className="text-body-03 text-white text-right">{endDate}</span>
                        <div className="h-full border-l border-l-white"></div>
                        <span className="text-body-03 text-white text-right">{startDate}</span>
                    </div>
                </div>
            </div>
            <div className="bg-[#A3ADB8] border border-big-stone-200 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] absolute top-0 left-0 z-1 rounded-lg"></div>
            <div className="border border-neutralgray-5 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] absolute top-2 left-2 z-0 rounded-lg"></div>
        </div>
    )
}
