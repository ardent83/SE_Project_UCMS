import React from "react";
import { HeadSection } from '../../components/HeadSection';
import { Notepad2 } from "iconsax-react";
import { useProjectList } from "./hooks/useProjectList";

export default function ProjectList({ userRoleId }) {
    const { projects, loading, error } = useProjectList({ userRoleId });

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

        if (projects.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-6 text-neutralgray-4">
                        نتیجه‌ای یافت نشد
                    </td>
                </tr>
            );
        }

        return projects.map((project) => (
            <tr dir="rtl" key={project.id} className="text-body-04 text-neutralgray-8 border-b border-neutralgray-2 hover:bg-neutralgray-2 transition cursor-pointer">
                <td className="p-2">
                    <span className={`w-25 inline-block px-3 py-1 rounded-sm ${project.statusStyle}`}>
                        {project.statusText}
                    </span>
                </td>

                <td className="p-2" >
                    {project.dueDateFormatted}
                </td>
                <td className="p-2">{project.dueTimeFormatted}</td>
                <td className="p-2">{project.classTitle}</td>
                <td className="p-2" >{project.title}</td>
            </tr>
        ));
    };

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <HeadSection title="پروژه‌ها" icon={<Notepad2 variant="Bold" color="var(--color-redp)" size={24} />} />
            <table className="w-full text-center table-auto">
                <thead className="bg-white">
                    <tr className="border-b border-neutralgray-3 text-neutralgray-7 text-body-04">
                        <th className="p-2 font-medium w-[15%]">وضعیت</th>
                        <th className="p-2 font-medium w-[20%]">تاریخ تحویل</th>
                        <th className="p-2 font-medium w-[10%]">زمان</th>
                        <th className="p-2 font-medium w-[25%]">درس</th>
                        <th className="p-2 font-medium w-[30%] text-wrap break-words">نام پروژه</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody()}
                </tbody>
            </table>
        </div>
    );
}