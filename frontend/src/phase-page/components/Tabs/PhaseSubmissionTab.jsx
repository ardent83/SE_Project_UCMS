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
    function toPersianNumber(number) {
        return number.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    }


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
            <div className="overflow-y-auto max-h-[380px] bg-white rounded-lg shadow-sm">
                <table className="w-full border-collapse text-center">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="border-b border-gray-300 text-gray-500 text-sm">
                        <th className="py-3 px-4">ارسال نهایی</th>
                        <th className="py-3 px-4">نام فاز</th>
                        <th className="py-3 px-4">
                            <div
                                className="flex items-center justify-center gap-1 cursor-pointer select-none"
                                onClick={handleSortClick}
                                title="مرتب‌سازی بر اساس زمان ارسال"
                            >
                                <span>زمان ارسال</span>
                                <ArrowSwapVertical
                                    size={16}
                                    variant="Bulk"
                                    color={sortBy === 1 ? "#1D4ED8" : "#0C1E33"}
                                    className={`${sortOrder === 2 ? "rotate-180" : ""} transition-transform duration-200`}
                                />
                            </div>
                        </th>
                        <th className="py-3 px-4">نوع فایل</th>
                        <th className="py-3 px-4">نمره</th>
                        <th className="py-3 px-4">فایل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {submissions.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="py-6 text-gray-400 text-sm">
                                فایلی آپلود نشده است
                            </td>
                        </tr>
                    ) : (
                        submissions.map((submission) => (
                            <tr
                                key={submission.id}
                                className={`border-b border-gray-100 transition ${selectedId === submission.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                            >
                                <td className="py-3 px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedId === submission.id}
                                        onChange={() => handleCheckboxChange(submission.id)}
                                        className="cursor-pointer"
                                    />
                                </td>
                                <td className="py-3 px-4 text-sm text-big-stone-600">{phaseTitle}</td>
                                <td className="py-3 px-4 text-sm">
                                    {new Date(submission.submittedAt).toLocaleString("fa-IR")}
                                </td>
                                <td className="py-3 px-4 text-gray-700 text-sm">{submission.fileType}</td>
                                <td className="py-3 px-4 text-sm">
                                    {submission.score !== null ? (
                                        <span className="text-green-700 font-semibold">{toPersianNumber(submission.score)}</span>
                                    ) : (
                                        <span className="text-gray-400">–</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                    <button
                                        onClick={() => handleDownload(submission)}
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
        </div>
    );
}
