import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Calendar,
    Edit2,
    Trash,
    Information,
    PresentionChart,
    DirectboxNotif,
} from "iconsax-react";

import PhaseSubmitTab from "./components/Tabs/PhaseSubmitTab.jsx";
import PhaseSubmissionsTab from "./components/Tabs/PhaseSubmissionTab.jsx";
import DropdownSection from "./components/DropdownSection.jsx";
import GradeUpload from "./components/GradeDropdownSection.jsx";
import GradeForm from "./components/GradeFormPop.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";
import {
    getPhaseInformationForInstructor,
    getPhaseInformationForStudent,
    downloadPhaseFileApi
} from "./utils/PhasePageApi.js";

const PhasePage = () => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const { phaseId } = useParams();
    const numericPhaseId = parseInt(phaseId, 10);
    const [phaseInfo, setPhaseInfo] = useState(null);
    const [activeTab, setActiveTab] = useState("ارسال پاسخ");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [grades, setGrades] = useState({});
    const [submittedGroups, setSubmittedGroups] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const groupMembers = {
        1: [
            { id: "401234567", firstName: "علی", lastName: "رضایی" },
            { id: "401234568", firstName: "زهرا", lastName: "کاظمی" },
        ],
        2: [
            { id: "401234569", firstName: "حسین", lastName: "کریمی" },
            { id: "401234570", firstName: "مریم", lastName: "نوری" },
            { id: "401234571", firstName: "سارا", lastName: "احمدی" },
        ],
        3: [
            { id: "401234572", firstName: "محمد", lastName: "محمدی" },
            { id: "401234573", firstName: "عاطفه", lastName: "صادقی" },
        ],
        4: [
            { id: "401234574", firstName: "رضا", lastName: "حسینی" },
        ],
        5: [
            { id: "401234575", firstName: "لیلا", lastName: "میرزایی" },
            { id: "401234576", firstName: "امیر", lastName: "کوهستانی" },
            { id: "401234577", firstName: "ندا", lastName: "جعفری" },
            { id: "401234578", firstName: "مهسا", lastName: "رستمی" },
        ],
        6: [
            { id: "401234579", firstName: "رضا", lastName: "علیزاده" },
            { id: "401234580", firstName: "نگار", lastName: "قاسمی" },
        ],
        7: [
            { id: "401234581", firstName: "سعید", lastName: "کریمی" },
        ],
    };


    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data = userRole === "Student"
                    ? await getPhaseInformationForStudent(numericPhaseId)
                    : await getPhaseInformationForInstructor(numericPhaseId);
                setPhaseInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (!isNaN(numericPhaseId)) {
            fetchPhase();
        }
    }, [numericPhaseId]);

    const handleOpenGradeForm = (groupId) => {
        const existing = submittedGroups[groupId];
        setSelectedGroup(groupId);
        setReadOnly(!!existing?.submitted);
        setGrades(existing?.grades || {});
    };

    const handleGradeChange = (member, value) => {
        setGrades((prev) => ({ ...prev, [member]: value }));
    };

    const handleSubmitGrades = () => {
        const members = groupMembers[selectedGroup] || [];
        const allGraded = members.every(
            (member) => grades[member] !== undefined && grades[member] !== ""
        );

        if (!allGraded) {
            setError("لطفاً برای همه اعضا نمره وارد کنید.");
            return;
        }

        setSubmittedGroups((prev) => ({
            ...prev,
            [selectedGroup]: { grades, submitted: true },
        }));

        setSelectedGroup(null);
        setReadOnly(false);
        setError("");
    };

    const handleCancel = () => {
        setSelectedGroup(null);
        setReadOnly(false);
        setError("");
    };

    const handleDownloadFile = useCallback(async () => {
        let filePath=phaseInfo?.phaseFilePath;
        const lastDotIndex = filePath.lastIndexOf('.');
        const extension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1) : '';
        filePath="/"+extension;
        try {
            await downloadPhaseFileApi(
                phaseId,
                userRole,
                filePath,
                phaseInfo?.title
            );
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("خطایی در دانلود فایل رخ داد!");
        }
    }, [phaseId, userRole, phaseInfo]);

    return (
        <div className="w-full max-w-270 p-6" dir="rtl">
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">
                        {phaseInfo?.title || "در حال بارگذاری..."}
                    </h2>

                    {userRole === "Instructor" && (
                        <div className="flex gap-4 text-gray-600 mt-5">
                            <div title="دانلود فایل" className="cursor-pointer" onClick={handleDownloadFile} data-testid="download-phase-icon">
                                <DirectboxNotif size="30" variant="Bulk" color="#08146f" />
                            </div>
                            <div title="حذف" className="cursor-pointer">
                                <Trash size="30" variant="Bulk" color="#08146f" data-testid="delete-phase-icon" />
                            </div>
                            <div title="ویرایش" className="cursor-pointer">
                                <Edit2 size="30" variant="Bulk" color="#08146f" onClick={() => navigate(`/phase/edit/${phaseId}`)} data-testid="edit-phase-icon" />
                            </div>
                        </div>
                    )}

                    {userRole === "Student" && (
                        <div className="flex gap-4 text-gray-600 mt-5">
                            <div title="دانلود فایل" className="cursor-pointer" onClick={handleDownloadFile} data-testid="download-phase-icon">
                                <DirectboxNotif size="30" variant="Bulk" color="#08146f" />
                            </div>
                        </div>
                    )}
                </div>

                {phaseInfo && (
                    <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 mb-5 border-b border-[#CED8E5F8]" dir="rtl">
                        <div className="text-xl flex items-center gap-2">
                            <Calendar size="25" variant="Linear" color="#495D72" />
                            <span>
                                {new Date(phaseInfo.startDate).toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })} -{" "}
                                {new Date(phaseInfo.startDate).toLocaleDateString("fa-IR")}

                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PresentionChart size="25" variant="Linear" color="#495D72" />
                            <span>
                                {new Date(phaseInfo.endDate).toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })} -{" "}
                                {new Date(phaseInfo.endDate).toLocaleDateString("fa-IR")}

                            </span>
                        </div>
                        <div className="flex items-start gap-2 mb-6">
                            <Information size="25" variant="Linear" color="#495D72" />
                            <p className="leading-relaxed">
                                {phaseInfo.description ? phaseInfo.description : "توضیحی ثبت نشده است."}
                            </p>
                        </div>

                    </div>
                )}
            </div>

            {userRole === "Student" && (
                <>
                    <div className="flex gap-1 mb-6 border-b border-gray-200">
                        {["ارسال پاسخ", "ارسال‌ها"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-5 py-2 rounded-t-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    activeTab === tab
                                        ? "bg-big-stone-900 border-x border-t border-gray-200 -mb-px text-white shadow-sm"
                                        : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === "ارسال پاسخ" && <PhaseSubmitTab />}
                    {activeTab === "ارسال‌ها" && <PhaseSubmissionsTab phaseTitle={phaseInfo?.title} />}
                </>
            )}

            {userRole === "Instructor" && (
                <div className="w-full mt-8">
                    <DropdownSection title="ارسال‌ها" bgColor="#1E2B4F">
                        <div className="overflow-y-auto max-h-72">
                            <table className="w-full text-center border-collapse text-sm">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2">نام گروه</th>
                                    <th className="px-4 py-2">زمان ارسال</th>
                                    <th className="px-4 py-2">نوع فایل</th>
                                    <th className="px-4 py-2">نمره استاد</th>
                                    <th className="px-4 py-2">فایل</th>
                                </tr>
                                </thead>
                                <tbody>
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-4 py-2">گروه {i}</td>
                                        <td className="px-4 py-2">۲۰ اردیبهشت ۱۴۰۴ – ساعت ۱۸:۰۰</td>
                                        <td className="px-4 py-2">pdf</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2 justify-center">
                                                {submittedGroups[i]?.submitted ? (
                                                    <button
                                                        className="text-green-500 hover:text-green-700 font-semibold cursor-pointer underline"
                                                        title="مشاهده نمرات ثبت شده"
                                                        onClick={() => handleOpenGradeForm(i)}
                                                    >
                                                        ثبت شده
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-red-400 hover:bg-red-600 border border-none text-white px-2 py-1 rounded cursor-pointer"
                                                        title="ثبت نمره"
                                                        onClick={() => handleOpenGradeForm(i)}
                                                    >
                                                        ثبت نشده
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button className="text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer">
                                                دانلود
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </DropdownSection>

                    <DropdownSection title="ثبت نمره" bgColor="#5C6BC0">
                        <GradeUpload />
                    </DropdownSection>

                    {selectedGroup !== null && (
                        <GradeForm
                            groupId={Number(selectedGroup)}  // تبدیل به عدد
                            members={groupMembers[Number(selectedGroup)] || []}
                            grades={grades}
                            onChange={handleGradeChange}
                            onSubmit={handleSubmitGrades}
                            onCancel={handleCancel}
                            readOnly={readOnly}
                            error={error}
                        />
                    )}

                </div>
            )}
        </div>
    );
};

export default PhasePage;
