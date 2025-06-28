import React, { useState, useEffect } from "react";
import {
    fetchPhaseSubmissionsApi,
    setFinalSubmission,
    downloadSubmissionFileApi
} from "../../utils/PhaseSubmissionForStudentApi.js";
import { useParams } from "react-router-dom";
import { ArrowSwapVertical } from "iconsax-react";

export default function PhaseSubmissionsTab({ phaseTitle }) {
    const { phaseId } = useParams();
    const [selectedId, setSelectedId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const fetchSubmissions = async () => {
        try {
            const sortDto = {};
            if (sortBy !== null && sortOrder !== null) {
                sortDto.SortBy = sortBy;
                sortDto.SortOrder = sortOrder;
            }

            const data = await fetchPhaseSubmissionsApi(phaseId, "Student", sortDto);
            const items = data.items || [];
            setSubmissions(items);

            const final = items.find((s) => s.isFinal === true);
            if (final) {
                setSelectedId(final.id);
            } else if (items.length > 0) {
                setSelectedId(items[0].id);
            } else {
                setSelectedId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toPersianNumber = (number) =>
        number.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

    const handleDownload = async (submission) => {
        try {
            await downloadSubmissionFileApi(submission.id, "Student", "/" + submission.fileType);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckboxChange = async (id) => {
        try {
            await setFinalSubmission(id);
            await fetchSubmissions();
        } catch (err) {
            console.error(err);
            setError("خطا در ذخیره ارسال نهایی");
        }
    };

    const handleSortClick = () => {
        if (sortBy === null) {
            setSortBy(1);
            setSortOrder(1);
        } else if (sortOrder === 1) {
            setSortOrder(2);
        } else {
            setSortBy(null);
            setSortOrder(null);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [phaseId, sortBy, sortOrder]);

    return (
        <div className="w-full max-w-[80rem] mx-auto mt-8 px-10 text-bg-blue" dir="rtl">
            {error && <div className="text-red-500 my-2">{error}</div>}

            {submissions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">هنوز پاسخی ارسال نکرده‌اید.</div>
            ) : (
                <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
                    <table className="w-full text-center border-collapse text-sm" dir="ltr">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-gray-700 text-sm">
                            <th className="px-4 py-2">فایل</th>
                            <th className="px-4 py-2">نمره</th>
                            <th className="px-4 py-2">نوع فایل</th>
                            <th
                                className="px-4 py-2 cursor-pointer select-none"
                                onClick={handleSortClick}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <ArrowSwapVertical
                                        size={16}
                                        variant="Bulk"
                                        color={sortBy === 1 ? "#1D4ED8" : "#0C1E33"}
                                        className={`${sortOrder === 2 ? "rotate-180" : ""} transition-transform duration-200`}
                                    />
                                    تاریخ و ساعت ارسال
                                </div>
                            </th>
                            <th className="px-4 py-2">ارسال نهایی</th>
                        </tr>
                        </thead>
                        <tbody>
                        {submissions.map((submission) => (
                            <tr
                                key={submission.id}
                                className={`border-b border-gray-100 transition ${
                                    selectedId === submission.id
                                        ? "bg-blue-50"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <td className="py-3 px-4">
                                    <button
                                        className="text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer"
                                        onClick={() => handleDownload(submission)}
                                    >
                                        دانلود
                                    </button>
                                </td>
                                <td className="py-3 px-4">
                                    {submission.score != null ? (
                                        <span className="text-green-700 font-semibold">
                        {toPersianNumber(submission.score)}
                      </span>
                                    ) : (
                                        <span className="text-gray-400">ثبت نشده</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-gray-700">{submission.fileType || "نامشخص"}</td>
                                <td className="py-3 px-4" dir="rtl">
                                    {new Date(submission.submittedAt).toLocaleDateString("fa-IR")} -{" "}
                                    {new Date(submission.submittedAt).toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </td>
                                <td className="py-3 px-4 flex justify-center items-center">
                                    <label className="inline-flex items-center cursor-pointer flex-row-reverse gap-1">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                            checked={selectedId === submission.id}
                                            onChange={() => handleCheckboxChange(submission.id)}
                                            aria-label="ارسال نهایی"
                                        />
                                    </label>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
