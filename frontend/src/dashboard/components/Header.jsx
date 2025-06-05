import React from "react";

export const Header = () => {
    return (
        <div className="w-full h-50 pl-4 flex justify-start items-end bg-neutralgray-1  rounded-sm">
            <div className='dashboard-img w-[11.76563rem] h-[9.1875rem] ' style={{ "--bg": "url(/dashboard.svg)" }}></div>
        </div>
    );
}
