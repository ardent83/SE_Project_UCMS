import React, { useState, useEffect } from "react";
import { downloadSubmissionFileApi } from "../utils/PhaseSubmissionForStudentApi.js";
import { DocumentDownload, ArrowSwapVertical } from "iconsax-react";
import Button from "../../components/Button.jsx";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return (
        date.toLocaleDateString("fa-IR") +
        " – ساعت " +
        date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    );
};

const handleDownloadSubmissionFile = async (item) => {
    try {
        await downloadSubmissionFileApi(item.id, "Instructor", "/" + item.fileType);
    } catch (err) {
        console.error(err);
    }
};

const SortIcon = ({ field, sortBy, sortOrder, onClick }) => (
    <ArrowSwapVertical
        size={16}
        variant="Bold"
        color={sortBy === field ? "#0C1E33" : "#0C1E33"}
        onClick={onClick}
        className={`cursor-pointer transition-transform duration-200 ${
            sortBy === field ? (sortOrder === 2 ? "rotate-180" : "") : "opacity-50"
        }`}
    />
);

const SubmissionTable = ({
                             submissions,
                             handleOpenGradeForm,
                             phaseId,
                             handleDownloadAllSubmissionFiles,
                         }) => {
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(1);
    const [sortedSubmissions, setSortedSubmissions] = useState([]);

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 1 ? 2 : 1);
        } else {
            setSortBy(field);
            setSortOrder(1);
        }
    };

    useEffect(() => {
        let sorted = [...submissions];

        if (sortBy === "date") {
            sorted.sort((a, b) =>
                sortOrder === 1
                    ? new Date(a.submittedAt) - new Date(b.submittedAt)
                    : new Date(b.submittedAt) - new Date(a.submittedAt)
            );
        } else if (sortBy === "teamName") {
            sorted.sort((a, b) =>
                sortOrder === 1
                    ? a.teamName.localeCompare(b.teamName)
                    : b.teamName.localeCompare(a.teamName)
            );
        }

        setSortedSubmissions(sorted);
    }, [sortBy, sortOrder, submissions]);

    return (
        <div className="overflow-y-auto max-h-72">
            <div className="flex gap-4 relative z-20 mb-2" dir="ltr">
                <Button
                    leftIcon={false}
                    buttonText={"دانلود همه‌ی ارسال‌ها"}
                    onClick={() =>
                        handleDownloadAllSubmissionFiles(phaseId)
                    }
                    className="bg-gray-100 hover:bg-blue-800 text-gray-700 w-auto border border-gray-300 shadow-sm"
                    rightIconComponent={
                        <DocumentDownload
                            size="30"
                            variant="Bold"
                            color="#ffffff"
                        />
                    }
                />
            </div>

            <table className="w-full text-center border-collapse text-sm mt-4">
                <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-2">
                        <div className="flex justify-center items-center gap-1">
                            <span>نام گروه</span>
                            <SortIcon
                                field="teamName"
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onClick={() => toggleSort("teamName")}
                            />
                        </div>
                    </th>
                    <th className="px-4 py-2">
                        <div className="flex justify-center items-center gap-1">
                            <span>زمان ارسال</span>
                            <SortIcon
                                field="date"
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onClick={() => toggleSort("date")}
                            />
                        </div>
                    </th>
                    <th className="px-4 py-2">نوع فایل</th>
                    <th className="px-4 py-2">نمره استاد</th>
                    <th className="px-4 py-2">فایل</th>
                </tr>
                </thead>
                <tbody>
                {sortedSubmissions.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="py-4 text-gray-500">
                            هیچ ارسال فازی وجود ندارد.
                        </td>
                    </tr>
                ) : (
                    sortedSubmissions.map((item) => (
                        <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                            <td className="px-4 py-2">{item.teamName}</td>
                            <td className="px-4 py-2">{formatDate(item.submittedAt)}</td>
                            <td className="px-4 py-2">{item.fileType}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleOpenGradeForm(item.teamId)}
                                    className="text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                    ثبت نمره
                                </button>
                            </td>
                            <td className="py-2 px-4 text-sm">
                                <button
                                    onClick={() => handleDownloadSubmissionFile(item)}
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
