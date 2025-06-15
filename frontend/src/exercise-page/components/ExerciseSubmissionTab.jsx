import React, { useState } from "react";

const fakeSubmissions = [
    {
        id: 1,
        name: "فاز اول",
        date: "1403/03/01",
        time: "14:00",
        fileName: "phase1_project.pdf",
        fileFormat:"pdf",
        fileUrl: "/files/phase1_project.pdf",
        score: 17.5,
    },
    {
        id: 2,
        name: "فاز دوم",
        date: "1403/03/15",
        time: "12:30",
        fileName: "phase2_code.zip",
        fileFormat:"zip",
        fileUrl: "/files/phase2_code.zip",
        score: null,
    },
    {
        id: 3,
        name: "فاز سوم",
        date: "1403/03/15",
        time: "12:30",
        fileName: "phase2_code.zip",
        fileFormat:"zip",
        fileUrl: "/files/phase2_code.zip",
        score: null,
    },
    {
        id: 4,
        name: "فاز چهارم",
        date: "1403/03/15",
        time: "12:30",
        fileName: "phase2_code.zip",
        fileFormat:"zip",
        fileUrl: "/files/phase2_code.zip",
        score: null,
    },
    {
        id: 5,
        name: "فاز پنجم",
        date: "1403/03/15",
        time: "12:30",
        fileName: "phase2_code.zip",
        fileFormat:"zip",
        fileUrl: "/files/phase2_code.zip",
        score: null,
    },
];

export default function ExerciseSubmissionsTab() {
    const [selectedId, setSelectedId] = useState(null);

    const handleCheckboxChange = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full max-w-[90rem] mx-auto mt-8 px-10 text-bg-blue" dir="rtl">
            <div className="overflow-y-auto max-h-[380px] bg-white rounded-lg shadow-sm">
                <table className="w-full border-collapse text-center">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="border-b border-gray-300 text-gray-500 text-sm">
                        <th className="py-3 px-4">انتخاب</th>
                        <th className="py-3 px-4">نام فاز</th>
                        <th className="py-3 px-4">تاریخ ارسال</th>
                        <th className="py-3 px-4">ساعت</th>
                        <th className="py-3 px-4">نوع فایل</th>
                        <th className="py-3 px-4">نمره</th>
                        <th className="py-3 px-4">فایل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fakeSubmissions.map((submission) => (
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
                                />
                            </td>
                            <td className="py-3 px-4">{submission.name}</td>
                            <td className="py-3 px-4">{submission.date}</td>
                            <td className="py-3 px-4">{submission.time}</td>
                            <td className="py-3 px-4 text-gray-700">{submission.fileFormat}</td>
                            <td className="py-3 px-4">
                                {submission.score !== null ? (
                                    <span className="text-green-700 font-semibold">{submission.score}</span>
                                ) : (
                                    <span className="text-gray-400">–</span>
                                )}
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href={submission.fileUrl}
                                    download
                                    className="text-blue-700 hover:underline"
                                >
                                    دانلود
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
