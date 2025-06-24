import React from "react";
import { HeadSection } from '../../components/HeadSection';
import { ClipboardText } from "iconsax-react";
import { useExamList } from "./hooks/useExamList";
import { useNavigate } from "react-router-dom";

export const ExamList = ({ userRoleId }) => {
    const { exams, loading, error } = useExamList({ userRoleId });
    const navigate = useNavigate();

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-6 text-neutralgray-4">
                        ... در حال بارگذاری
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-6 text-stateerror">
                        {error}
                    </td>
                </tr>
            );
        }

        if (exams.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-6 text-neutralgray-4">
                        .آزمونی برای نمایش وجود ندارد
                    </td>
                </tr>
            );
        }

        return exams.map((exam) => (
            <tr dir="rtl" key={exam.id} className="text-body-04 text-neutralgray-8 border-b border-neutralgray-2 hover:bg-neutralgray-2 transition">
                <td className="p-2">{exam.location}</td>
                <td className="p-2">{exam.dateFormatted}</td>
                <td className="p-2">{exam.timeFormatted}</td>
                <td className="p-2">{exam.classTitle}</td>
                <td className="p-2">{exam.title}</td>
            </tr>
        ));
    };

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <HeadSection
                onClick={() => navigate('/exams')}
                title="امتحانات"
                icon={<ClipboardText variant="Bold" color="var(--color-redp)" size={24} />}
            />
            <table className="w-full text-center table-auto">
                <thead className="bg-white">
                    <tr className="border-b border-neutralgray-3 text-neutralgray-9 text-body-04 font-bold">
                        <th className="p-2 font-medium w-[15%]">مکان برگزاری</th>
                        <th className="p-2 font-medium w-[20%]">تاریخ برگزاری</th>
                        <th className="p-2 font-medium w-[10%]">زمان</th>
                        <th className="p-2 font-medium w-[25%]">درس</th>
                        <th className="p-2 font-medium w-[30%] text-wrap break-words">نام امتحان</th>
                    </tr>
                </thead>
                <tbody data-testid="exam-list-section">
                    {renderTableBody()}
                </tbody>
            </table>
        </div>
    );
}