import React, { useState, useEffect } from "react";
import { fetchPhaseSubmissionsApi, setFinalSubmission,downloadSubmissionFileApi  } from "../../utils/PhaseSubmissionApi.js";
import { useParams } from "react-router-dom";

export default function PhaseSubmissionsTab({ phaseTitle }) {
    const { phaseId } = useParams();
    const [selectedId, setSelectedId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);

    const fetchSubmissions = async () => {
        try {
            const data = await fetchPhaseSubmissionsApi(phaseId, "Student", {});
            let items = data.items || [];

            items = items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
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
            setError("خطا در بارگیری ارسال‌ها");
        }
    };

    const handleDownload = async (submission) => {

        try {
            await downloadSubmissionFileApi(submission.id, "Student", "/"+submission.fileType);
        } catch (err) {
            console.error(err);
            setError("خطا در دانلود فایل ارسال شده");
        }
    };



    useEffect(() => {
        fetchSubmissions();
    }, [phaseId]);

    const handleCheckboxChange = async (id) => {
        try {
            await setFinalSubmission(id);
            await fetchSubmissions();
        } catch (err) {
            console.error(err);
            setError("خطا در ذخیره ارسال نهایی");
        }
    };

    return (
        <div className="w-full max-w-[90rem] mx-auto mt-8 px-10 text-bg-blue" dir="rtl">
            {error && <div className="text-red-500 my-2">{error}</div>}
            <div className="overflow-y-auto max-h-[380px] bg-white rounded-lg shadow-sm">
                <table className="w-full border-collapse text-center">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="border-b border-gray-300 text-gray-500 text-sm">
                        <th className="py-3 px-4">ارسال نهایی</th>
                        <th className="py-3 px-4">نام فاز</th>
                        <th className="py-3 px-4">زمان ارسال</th>
                        <th className="py-3 px-4">نوع فایل</th>
                        <th className="py-3 px-4">نمره</th>
                        <th className="py-3 px-4">فایل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {submissions.map((submission) => (
                        <tr
                            key={submission.id}
                            className={`border-b border-gray-100 transition ${
                                selectedId === submission.id ? "bg-blue-50" : "hover:bg-gray-50"
                            }`}
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
                                    <span className="text-green-700 font-semibold">{submission.score}</span>
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
