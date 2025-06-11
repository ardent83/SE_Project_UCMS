import React, { useState } from "react";
import {
    Calendar,
    Edit2,
    Trash,
    Information,
    PresentionChart,
    DirectboxNotif,
    TaskSquare,
    DocumentDownload
} from "iconsax-react";
import DropdownSection from "./components/DropdownSection.jsx";
import GradeUpload from "./components/GradeDropdownSection.jsx";
import GradeForm from "./components/GradeFormPop.jsx";

const PhasePageForInstructor = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [grades, setGrades] = useState({});
    const [submittedGroups, setSubmittedGroups] = useState({});
    const [readOnly, setReadOnly] = useState(false);
    const [error, setError] = useState("");


    const groupMembers = {
        1: ["عضو ۱", "عضو ۲"],
        2: ["عضو ۱", "عضو ۲", "عضو ۳"],
        3: ["عضو ۱", "عضو ۲"],
        4: ["عضو ۱"],
        5: ["عضو ۱", "عضو ۲", "عضو ۳", "عضو ۴"],
        6: ["عضو ۱", "عضو ۲"],
        7: ["عضو ۱"]
    };

    // وقتی می‌خوایم فرم باز بشه برای ثبت یا مشاهده نمره
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

    return (
        <div className="w-full max-w-270 p-6">
            <div className="w-full flex flex-col items-center" >
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">فاز ۱</h2>
                    <div className="flex gap-4 text-gray-600 mt-5">
                        <div title="دانلود فایل" className="cursor-pointer"><DirectboxNotif size="30" variant="Bulk" color="#08146f" /></div>
                        <div title="حذف" className="cursor-pointer"><Trash size="30" variant="Bulk" color="#08146f" /></div>
                        <div title="ویرایش" className="cursor-pointer"><Edit2 size="30" variant="Bulk" color="#08146f" /></div>
                    </div>
                </div>

                <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 border-b-1 border-[#CED8E5F8]"  dir="rtl">
                    <div className="text-xl flex items-center gap-2">
                        <Calendar size="25" variant="Linear" color="#495D72"/>
                        <span>۲۰ اردیبهشت ۱۴۰۴ - ۲۳:۰۰</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PresentionChart size="25" variant="Linear" color="#495D72"/>
                        <span>۲۱ اردیبهشت ۱۴۰۴ - ۱۰:۰۰</span>
                    </div>
                    <div className="flex items-start gap-2 mb-10">
                        <Information size="25" variant="Linear" color="#495D72"/>
                        <p className="leading-relaxed">
                            توضیحات فاز اول / توضیحات فاز اول / توضیحات فاز اول / توضیحات فاز اول / توضیحات فاز اول...
                        </p>
                    </div>
                </div>

                <div className="w-full mt-8">
                    <DropdownSection title="ارسال‌ها" bgColor="#1E2B4F">
                        <div className="overflow-y-auto max-h-72">
                            <table className="w-full text-center border-collapse text-sm" dir="rtl">
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
                                            <button className="justify-center text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer ">
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
                </div>
            </div>

            {selectedGroup && (
                <GradeForm
                    groupId={selectedGroup}
                    members={groupMembers[selectedGroup] || []}
                    grades={grades}
                    onChange={handleGradeChange}
                    onSubmit={handleSubmitGrades}
                    onCancel={handleCancel}
                    readOnly={readOnly}
                    error={error}
                />

            )}
        </div>
    );
};

export default PhasePageForInstructor;
