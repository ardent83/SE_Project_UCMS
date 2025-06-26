import React from "react";
import {downloadSubmissionFileApi} from "../utils/PhaseSubmissionForStudentApi.js";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fa-IR") + " – ساعت " + date.toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' });
};

const handleDownload = async (item) => {
    try {
        await downloadSubmissionFileApi(item.id, "Instructor", "/" + item.fileType);
    } catch (err) {
        console.error(err);
    }
};

const SubmissionTable = ({ submissions, handleOpenGradeForm }) => {
    return (
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
                {submissions.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="py-4 text-gray-500">هیچ ارسال فازی وجود ندارد.</td>
                    </tr>
                ) : (
                    submissions.map((item) => (
                        <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                            <td className="px-4 py-2">{item.teamName}</td>
                            <td className="px-4 py-2">{formatDate(item.submittedAt)}</td>
                            <td className="px-4 py-2">{item.fileType}</td>
                            <td className="px-4 py-2">
                                <div className="flex items-center gap-2 justify-center">
                                    {item.score !== null ? (
                                        <button
                                            className="text-green-500 hover:text-green-700 font-semibold cursor-pointer underline"
                                            title="مشاهده نمرات ثبت شده"
                                            onClick={() => handleOpenGradeForm(item.id)}
                                        >
                                            {item.score}
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-red-400 hover:bg-red-600 border border-none text-white px-2 py-1 rounded cursor-pointer"
                                            title="ثبت نمره"
                                            onClick={() => handleOpenGradeForm(item.id)}
                                        >
                                            ثبت نشده
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="py-2 px-4 text-sm">
                                <button
                                    onClick={() => handleDownload(item)}
                                    className="text-big-stone-600 hover:underline cursor-pointer"
                                >
                                    دانلود
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionTable;
