import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Setting2,
    Element4,
    Book1,
    LogoutCurve,
    ProfileCircle,
    Notepad2,
    Chart,
    ClipboardText,
    TaskSquare,
    ArrowLeft2,
    ArrowRight2
} from "iconsax-react";
import { useAuth } from '../auth/context/AuthContext';
import Alert from './Alert';

export const Frame = ({ to, label, icon, collapsed }) => {
    const location = useLocation();
    const { pathname } = location;

    const selectedClass = "bg-[rgba(255,255,255,1.0)] rounded-[0px_4.93px_4.93px_0px] border-r-[4.93px] [border-right-style:solid] border-white [background:linear-gradient(270deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]";
    const baseItemClasses = "flex w-full h-12 justify-end items-center gap-[0.5rem] pr-[13.15px] py-[9.86px]";
    const isSelected = pathname === to;

    return (
        <Link to={to} className={`${baseItemClasses} ${isSelected ? selectedClass : ""}`}>
            {!collapsed && <div className="text-body-03 text-white text-right text-nowrap">{label}</div>}
            <div className="min-w-[24px] flex justify-center items-center">
                {icon}
            </div>
        </Link>
    );
};

function Sidebar() {
    const { logout } = useAuth();
    const [apiError, setApiError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (apiError) {
            setAlertMessage(apiError);
            setShowAlert(true);
        } else {
            setShowAlert(false);
            setAlertMessage('');
        }
    }, [apiError]);

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
        setApiError(null);
    };

    const handleLogout = async () => {
        setApiError(null);
        setShowAlert(false);
        try {
            await logout();
        } catch (error) {
            setApiError(error.message || '!خطا در خروج از حساب کاربری');
        }
    };

    const logoutItemClasses = "flex w-full h-14 justify-end items-center gap-[1.19rem] pr-[13.15px] py-[9.86px] cursor-pointer";

    return (
        <aside className={`h-screen ${collapsed ? 'w-18' : 'w-72'} transition-all duration-300 flex flex-col justify-start items-end py-2 px-1 bg-redp text-white text-body-04 overflow-y-scroll scrollbar-thin scroll-smooth`}>
            <div className="w-full flex justify-start items-center pr-2">
                <span onClick={() => setCollapsed(!collapsed)} className="w-full text-white cursor-pointer">
                    {collapsed ? <ArrowLeft2 size={22} color='var(--color-white)' /> : <ArrowRight2 size={22} color='var(--color-white)' />}
                </span>
            </div>
            <div className="w-full">
                <div className="w-full h-px bg-gray-600 mb-4 mt-1 mx-auto" />
                <ul>
                    <li>
                        <Frame to="/dashboard" label={"داشبورد"} icon={<Element4 color="var(--color-white)" variant={"Bold"} size={24} />} collapsed={collapsed} />
                    </li>
                </ul>
                <div className="w-full h-px bg-gray-600 my-4 mx-auto" />
                <ul>
                    <li>
                        <Frame to="/classes" label={"کلاس‌ها"} icon={<Book1 variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                    <li>
                        <Frame to="/projects" label={"پروژه‌ها"} icon={<Notepad2 variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                    <li>
                        <Frame to="/exercises" label={"تکالیف"} icon={<TaskSquare variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                    <li>
                        <Frame to="/exams" label={"امتحانات"} icon={<ClipboardText variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                    <li>
                        <Frame to="/grade-reports" label={"گزارش نمرات"} icon={<Chart variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                </ul>
                <div className="w-full h-px bg-gray-600 my-4 mx-auto" />
                <ul>
                    <li>
                        <Frame to="/account-settings" label={"تنظیمات حساب کاربری"} icon={<Setting2 variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                    <li>
                        <Frame to="/profile" label={"پروفایل"} icon={<ProfileCircle variant='Bold' color='var(--color-white)' size={24} />} collapsed={collapsed} />
                    </li>
                </ul>
            </div>
            <div className="w-full h-full flex flex-col justify-end">
                <ul>
                    <li>
                        <div className={logoutItemClasses} onClick={handleLogout}>
                            {!collapsed && <div className="text-body-03 text-white text-right">خروج</div>}
                            <LogoutCurve variant='Bold' color='var(--color-white)' size={24} />
                        </div>
                    </li>
                </ul>
            </div>
            {showAlert && (
                <Alert message={alertMessage} onClose={handleCloseAlert} />
            )}
        </aside>
    );
}

export default Sidebar;