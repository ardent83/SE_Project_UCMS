import {Calendar2, Edit, More, Clock, Trash, Edit2, Calendar, Calendar1} from "iconsax-react";
import React, {useCallback, useState} from "react";
import ClassInfoPop from "./components/ClassInfoPop.jsx";
import {useNavigate} from "react-router-dom";
import {deleteClassById, leaveClassById} from "./utils/classPageApi.js";
import Modal from "../components/Modal.jsx";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover.jsx";
import {useAuth} from "../auth/context/AuthContext.jsx";

export default function ClassHeader({
                                        id, title, instructor, startDate, endDate, days, times, classCode,
                                    }) {
    const [showClassInfo, setShowClassInfo] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLeaveMenu, setShowLeaveMenu] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const userRole = user?.role?.name || "guest";

    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        day: "numeric", month: "numeric", year: "numeric",
    });

    const formatPersianDate = (date) => {
        const parts = formatter.formatToParts(new Date(date));
        const day = parts.find((p) => p.type === "day")?.value;
        const month = parts.find((p) => p.type === "month")?.value;
        const year = parts.find((p) => p.type === "year")?.value;
        return `${year}-${month}-${day}`;
    };

    const toPersian2Digit = (num) => {
        const enStr = num.toString().padStart(2, "0");
        const faDigits = "۰۱۲۳۴۵۶۷۸۹";
        return enStr.replace(/[0-9]/g, (d) => faDigits[d]);
    };

    const formatPersianTime = (timeStr) => {
        if (typeof timeStr !== "string" || !timeStr.includes(":")) return "؟";
        const [hour, minute] = timeStr.trim().split(":");
        return `${toPersian2Digit(hour)}:${toPersian2Digit(minute)}`;
    };

    const formatTimeRange = (rangeStr) => {
        if (typeof rangeStr !== "string") return "؟";

        return rangeStr
            .split("و")
            .map(range => {
                const [start, end] = range.trim().split("-");
                if (!start || !end) return "؟";
                return `${formatPersianTime(end)} - ${formatPersianTime(start)}`;
            })
            .join(" , ");
    };

    const handleDeleteClass = useCallback(async () => {
        try {
            await deleteClassById(id);
            console.log(`Class ${id} deleted successfully.`);
            navigate(`/classes`, {state: {message: "کلاس با موفقیت حذف شد."}});
        } catch (err) {
            console.error("Error deleting class:", err);
            setError("خطایی در حذف کلاس رخ داد!");
        }
    }, [id, navigate]);

    const handleLeaveClass = useCallback(async () => {
        try {
            await leaveClassById(id);
            console.log(`Class ${id} leaved successfully.`);
            navigate(`/classes`, {state: {message: " با موفقیت از کلاس خارج شد."}});
        } catch (err) {
            console.error("Error leaving class:", err);
            setError("خطایی در خروج از کلاس رخ داد!");
        }
    }, [id, navigate]);

    return (
        <>
            <div className="w-full max-w-[90rem] mx-auto px-10 text-bg-blue">

                <div className="w-full flex justify-between items-center mb-15 mt-10">
                    <div className="flex items-center gap-[0.625rem]">
                        {userRole === "Instructor" ? (
                            <>
                                <div title="حذف کلاس" className="cursor-pointer" onClick={() => setShowDeleteModal(true)}>
                                    <Trash
                                        size="30"
                                        variant="Bulk"
                                        color="#08146f"
                                        data-testid="delete-class-icon"
                                    />
                                </div>
                                <div title="ویرایش کلاس" className="cursor-pointer" onClick={() => navigate(`/class/edit/${id}`)}>
                                    <Edit2 size="30" variant="Bulk" color="#08146f"/>

                                </div>
                                <div title="اطلاعات کلاس" className="cursor-pointer" onClick={() => setShowClassInfo(true)}>
                                    <More
                                        color="#08146f"
                                        size={30}
                                        variant="Bulk"
                                    />
                                </div>
                            </>
                            ):(
                                <div className="relative">
                                <More
                                color="#08146f"
                                size={30}
                                variant="Linear"
                                className="cursor-pointer rotate-90 absolute left-5 top-0"
                                onClick={() => setShowLeaveMenu(!showLeaveMenu)}
                        />
                        {showLeaveMenu && (
                            <div className="absolute left-0 top-8 bg-big-stone-800 hover:bg-big-stone-900 rounded shadow w-20 p-2 z-20">
                                <button className="text-white text-sm  cursor-pointer" onClick={handleLeaveClass}>
                                    ترک کلاس
                                </button>
                            </div>
                    )}
                </div>
                )}
                    </div>

                    <span className="text-4xl text-heading-h4 text-redp font-bold">{title}</span>
                </div>

                <div className="flex justify-end items-center gap-1 self-stretch text-body-03 text-redp text-right">
                    {instructor && (
                        <>
                            <span>{instructor}</span>
                            <div className="h-full border-l border-l-white"></div>
                        </>
                    )}

                    <div className="text-body-03 text-gray-700 flex w-120 flex-col gap-2" >
                        <span className="text-lg flex justify-end items-center gap-2 self-stretch">
                            <span>{formatPersianDate(endDate)}</span>
                            <div > تا </div>
                             <span>{formatPersianDate(startDate)}</span>
                            <Calendar1 color="#495D72" size={25} variant="Linear" />
                        </span>
                        <span className=" text-lg flex justify-end items-center gap-2 self-stretch">
                           <span className="flex justify-end items-center">{days}</span>
                             :روزهای کلاس
                            <Calendar2 color="#495D72" size={25} variant="Linear" />
                        </span>
                        <span className="text-lg flex justify-end items-center gap-2 self-stretch">
                            <span className="flex justify-end items-center">{formatTimeRange(times)}</span>
                            :ساعت‌های کلاس
                            <Clock color="#495D72" size={25} variant="Linear" />
                        </span>
                    </div>

                </div>

                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} data-testid="delete-class-modal">
                    <DeleteConfirmModalContent
                        onConfirm={() => {
                            handleDeleteClass();
                            setShowDeleteModal(false);
                        }}
                        onCancel={() => setShowDeleteModal(false)}
                        message="آیا از حذف این کلاس مطمئن هستید؟"
                        data-testid="delete-class-confirm-content"
                    />
                </Modal>
            </div>

            {showClassInfo && <ClassInfoPop show={showClassInfo} onClose={() => setShowClassInfo(false)} classCode={classCode} />}
        </>
    );
}
