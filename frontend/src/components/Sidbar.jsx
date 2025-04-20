import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Setting2, Element4, Book1 } from "iconsax-react";

export const Frame = ({ to, label, icon }) => {
    const location = useLocation();
    const selectedClass = "bg-[rgba(255,255,255,1.0)] rounded-[0px_4.93px_4.93px_0px] border-r-[4.93px] [border-right-style:solid] border-white [background:linear-gradient(270deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]";
    const isSelected = location.pathname === to;

    return (
        <Link to={to} className={`flex w-60 h-14 justify-end items-center gap-[1.19rem] pr-[13.15px] py-[9.86px] ${isSelected ? selectedClass : ""}`} >
            <div className="text-body-03 text-white text-right">
                {label}
            </div>
            {icon}
        </Link>
    );
};

function Sidebar() {
    return (
        <aside className={"h-screen w-72 flex flex-col justify-start items-start pr-2 bg-redp text-white text-body-03 py-17"}>
            <ul>
                <li>
                    <Frame to="/dashboard" label={"داشبورد"} icon={<Element4 color="var(--color-white)" variant={"Bold"} size={24} />} />
                </li>
                <li>
                    <Frame to="/ue" label={"تنظیمات حساب کاربری"} icon={<Setting2 variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <Frame to="/class" label={"کلاس‌ها"} icon={<Book1 variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <Frame to="/test" label={"تست"} />
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
