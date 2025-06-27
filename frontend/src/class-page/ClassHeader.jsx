import {Calendar2, Edit, More, Clock, Trash} from "iconsax-react";
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
            setError("خطایی در خروح از کلاس رخ داد!");
        }
    }, [id, navigate]);

    return (<>
        <div className="relative w-full h-48 p-4 pr-6 flex flex-col justify-between items-center self-stretch">
            <div className="flex items-center gap-[0.625rem] self-stretch z-10 relative min-h-[24px]">
                {userRole === "Instructor" ? (<>
                    <div title="حذف کلاس" className="cursor-pointer">
                        <Trash
                            size="30"
                            variant="Bulk"
                            color="#08146f"
                            onClick={() => setShowDeleteModal(true)}
                            style={{cursor: "pointer"}}
                            data-testid="delete-class-icon" // Added data-testid
                        />
                    </div>
                    <div title="ویرایش کلاس" className="cursor-pointer">

                        <Edit
                            color="#082c85"
                            size={30}
                            variant="Bulk"
                            className="cursor-pointer"
                            onClick={() => navigate(`/class/edit/${id}`)}
                        />
                    </div>
                    <div title="اطلاعات کلاس" className="cursor-pointer">

                        <More
                            color="#082c85"
                            size={30}
                            variant="Bulk"
                            className="cursor-pointer"
                            onClick={() => setShowClassInfo(true)}
                        />
                    </div>
                </>) : (<div className="relative">
                    <More
                        color="#082c85"
                        size={24}
                        variant="Linear"
                        className="cursor-pointer rotate-90 absolute left-5 top-0"
                        onClick={() => setShowLeaveMenu(!showLeaveMenu)}
                    />
                    {showLeaveMenu && (<div
                        className="absolute left-0 top-8 bg-big-stone-800 hover:bg-big-stone-900 rounded shadow w-20 p-2 z-20">
                        <button
                            className="text-white text-sm  cursor-pointer"
                            onClick={handleLeaveClass}
                        >
                            ترک کلاس
                        </button>
                    </div>)}
                </div>)}
            </div>

            <div className="w-full h-fit flex justify-between items-center self-stretch z-10 relative">
                <div className="text-body-03 text-redp flex w-60 flex-col gap-2">
                        <span className="flex justify-end items-center gap-2 self-stretch">
                            <span className="flex justify-end items-center">{days}</span>
                            <Calendar2 color="#082c85" size={24} variant="Bulk"/>
                        </span>
                    <span className="flex justify-end items-center gap-2 self-stretch">
                            <span className="flex justify-end items-center">{formatTimeRange(times)}</span>
                            <Clock color="#082c85" size={24} variant="Bulk"/>
                        </span>
                </div>

                <div className="w-fit h-[5rem] flex flex-col items-end gap-1">
                    <span className="text-heading-h5 text-white text-3xl text-right mb-3">{title}</span>
                    <div className="flex justify-end items-center gap-1 self-stretch">
                        {instructor && (<>
                            <span className="text-body-03 text-white text-right">{instructor}</span>
                            <div className="h-full border-l border-l-white"></div>
                        </>)}
                        <span className="text-body-03 text-white text-right">{formatPersianDate(endDate)}</span>
                        <div className="h-full border-l border-l-white"></div>
                        <span className="text-body-03 text-white text-right">{formatPersianDate(startDate)}</span>
                    </div>
                </div>
            </div>

            <div
                className="bg-[#A3ADB8] border border-big-stone-200 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] absolute top-0 left-0 z-1 rounded-lg"></div>
            <div
                className="border border-neutralgray-5 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] absolute top-2 left-2 z-0 rounded-lg"></div>

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                data-testid="delete-class-modal"
            >
                {" "}
                {/* Added data-testid */}
                <DeleteConfirmModalContent
                    onConfirm={() => {
                        handleDeleteClass();
                        setShowDeleteModal(false);
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                    message="آیا از حذف این کلاس مطمئن هستید؟"
                    data-testid="delete-class-confirm-content" // Added data-testid
                />
            </Modal>
        </div>

        {showClassInfo && (<ClassInfoPop
            show={showClassInfo}
            onClose={() => setShowClassInfo(false)}
            classCode={classCode}
        />)}
    </>);
}
