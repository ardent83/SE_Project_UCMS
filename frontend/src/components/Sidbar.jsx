import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Setting2, Element4, Book1, LogoutCurve, ProfileCircle, Notepad2} from "iconsax-react";
import { useAuth } from '../auth/context/AuthContext';
import Alert from './Alert';

export const Frame = ({ to, label, icon }) => {
    const location = useLocation();

    const selectedClass = "bg-[rgba(255,255,255,1.0)] rounded-[0px_4.93px_4.93px_0px] border-r-[4.93px] [border-right-style:solid] border-white [background:linear-gradient(270deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]";
    const isSelected = location.pathname === to;
    const baseItemClasses = "flex w-60 h-14 justify-end items-center gap-[1.19rem] pr-[13.15px] py-[9.86px]";

    return (
        <Link to={to} className={`${baseItemClasses} ${isSelected ? selectedClass : ""}`} >
            <div className="text-body-03 text-white text-right">
                {label}
            </div>
            {icon}
        </Link>
    );
};

function Sidebar() {
    const { logout } = useAuth();

    const [apiError, setApiError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

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

    const logoutItemClasses = "flex w-60 h-14 justify-end items-center gap-[1.19rem] pr-[13.15px] py-[9.86px] cursor-pointer";

    return (
        <aside className={"h-screen w-72 flex flex-col justify-start items-start pr-2 bg-redp text-white text-body-03 py-17"}>
            <ul>
                <li>
                    <Frame to="/dashboard" label={"داشبورد"} icon={<Element4 color="var(--color-white)" variant={"Bold"} size={24} />} />
                </li>
                <li>
                    <Frame to="/account-settings" label={"تنظیمات حساب کاربری"} icon={<Setting2 variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <Frame to="/classes" label={"کلاس‌ها"} icon={<Book1 variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <Frame to="/test" label={"تست"} />
                </li>
                <li>
                    <Frame to="/profile" label={"پروفایل"} icon={<ProfileCircle variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <Frame to="/projectsPage" label={"پروژه‌ها"} icon={<Notepad2 variant='Bold' color='var(--color-white)' size={24} />} />
                </li>
                <li>
                    <div
                        className={logoutItemClasses}
                        onClick={handleLogout}
                    >
                        <div className="text-body-03 text-white text-right">
                            خروج
                        </div>
                        <LogoutCurve variant='Bold' color='var(--color-white)' size={24} />
                    </div>
                </li>
            </ul>

            {showAlert && (
                <Alert message={alertMessage} onClose={handleCloseAlert} />
            )}
        </aside>
    );
}

export default Sidebar;