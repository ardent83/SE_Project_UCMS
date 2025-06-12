import {Calendar2, Edit, More, Clock, Trash} from "iconsax-react";
import React, {useState} from "react";
import ClassInfoPop from "./components/ClassInfoPop.jsx";
import {useNavigate} from "react-router-dom";
import {deleteClassById} from "./utils/classPageApi.js";
import Modal from "../components/Modal.jsx";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover.jsx";
import {useAuth} from "../auth/context/AuthContext.jsx";


export default function ClassHeader({
                                        id,
                                        title,
                                        instructor,
                                        startDate,
                                        endDate,
                                        days,
                                        times,
                                        classCode,
                                    }) {
    const [showClassInfo, setShowClassInfo] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const userRole = user?.role?.name || "guest";

    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
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



    const handleDeleteClass = async () => {
        const success = await deleteClassById(id);
        if (success) {
            navigate("/classes");
        }
    };


    return (
        <>
            <div className="relative w-full h-48 p-4 pr-6 flex flex-col justify-between items-center self-stretch">
                <div className="flex items-center gap-[0.625rem] self-stretch z-10 relative min-h-[24px]">
                    {userRole === "Instructor" ? (
                        <>
                            <Trash
                                color="#082c85"
                                size={24}
                                variant="Bulk"
                                className="cursor-pointer"
                                onClick={() => setShowDeleteModal(true)}
                            />
                            {showDeleteModal && (
                                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                                    <DeleteConfirmModalContent
                                        message="آیا از حذف این کلاس مطمئن هستید؟"
                                        onConfirm={handleDeleteClass}
                                        onCancel={() => setShowDeleteModal(false)}
                                    />
                                </Modal>
                            )}
                            <Edit
                                color="#082c85"
                                size={24}
                                variant="Bulk"
                                className="cursor-pointer"
                                onClick={() => navigate(`/class/edit/${id}`)}
                            />
                            <More
                                color="#082c85"
                                size={24}
                                variant="Bulk"
                                className="cursor-pointer"
                                onClick={() => setShowClassInfo(true)}
                            />
                        </>
                    ) : (
                        <div style={{height: "24px"}}/>
                    )}
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

                    <div className="w-fit h-[3.64rem] flex flex-col items-end gap-1">
                        <span className="text-heading-h5 text-white text-3xl text-right">{title}</span>
                        <div className="flex justify-end items-center gap-1 self-stretch">
                            {instructor && (
                                <>
                                    <span className="text-body-03 text-white text-right">{instructor}</span>
                                    <div className="h-full border-l border-l-white"></div>
                                </>
                            )}
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
            </div>

            {showClassInfo && (
                <ClassInfoPop
                    show={showClassInfo}
                    onClose={() => setShowClassInfo(false)}
                    classCode={classCode}
                />
            )}
        </>
    );
}
