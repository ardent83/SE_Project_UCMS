import React, { useState, useEffect } from "react";
import {ClipboardText} from "iconsax-react";
import SearchBox from "./components/SearchBox";
import ActionMenu from "./components/ActionMenu.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { getExamsForInstructor, getExamsForStudent } from "./utils/ExamsPageApi.js";

export default function ExamsPage() {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const [search, setSearch] = useState("");
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(userRole);
    useEffect(() => {
        async function fetchExams() {
            try {
                setLoading(true);
                const data = userRole === "Student"
                    ? await getExamsForStudent()
                    : await getExamsForInstructor();
                setExams(data);
                setError(null);
            } catch (err) {
                setError("خطا در بارگذاری داده‌ها");
            } finally {
                setLoading(false);
            }
        }

        fetchExams();
    }, [userRole]);

    const filteredExams = exams.filter((exam) => {
        const lowerSearch = search.trim().toLowerCase();
        return (
            exam.title.toLowerCase().includes(lowerSearch) ||
            exam.classTitle.toLowerCase().includes(lowerSearch)
        );
    });

    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        return d.toLocaleDateString("fa-IR");
    };

    const formatTime = (isoDate) => {
        const d = new Date(isoDate);
        return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    };

    const handleDeleteExam = (deletedId) => {
        setExams((prev) => prev.filter((exam) => exam.examId !== deletedId));
    };

    return (
        <div dir="ltr" className="w-full max-w-[90rem] mx-auto my-10 px-10 text-bg-blue">
            <h2 className="text-3xl font-bold mt-6 mb-10 flex items-center border-b border-gray-300 pb-8 gap-2 justify-end">
                <span>امتحان‌ها</span>
                <div className="flex items-start gap-[0.625rem] self-stretch z-10 relative">
                    <ClipboardText color="#0C1E33" size={35} variant="Bold" />
                </div>
            </h2>

            <div className="flex items-start mb-15 mr-10 mt-15 gap-4 z-20 text-right" dir="rtl">
                <SearchBox
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجو نام امتحان، درس"
                />
            </div>

            {loading ? (
                <div className="text-center py-6 text-gray-400">در حال بارگذاری...</div>
            ) : error ? (
                <div className="text-center py-6 text-red-500">{error}</div>
            ) : filteredExams.length > 0 ? (
                <div className="w-full">
                    <div className="relative z-10 overflow-visible">
                        <table className="w-full border-collapse text-center">
                            <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b border-gray-300 text-gray-400 text-sm">
                                <th className="py-3 px-4"></th>
                                <th className="py-3 px-4">مکان برگزاری</th>
                                <th className="py-3 px-4">تاریخ برگزاری</th>
                                <th className="py-3 px-4">زمان برگزاری</th>
                                <th className="py-3 px-4">درس</th>
                                <th className="py-3 px-4">نام امتحان</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredExams.map((exam) => (
                                <tr
                                    key={exam.examId}
                                    className="border-b border-gray-100 hover:bg-gray-100 transition"
                                >
                                    <td className="py-3 px-4 cursor-pointer">
                                        <ActionMenu examId={exam.examId} onDeleteSuccess={handleDeleteExam} />
                                    </td>
                                    <td className="py-3 px-4">{exam.examLocation}</td>
                                    <td className="py-3 px-4">{formatDate(exam.date)}</td>
                                    <td className="py-3 px-4">{formatTime(exam.date)}</td>
                                    <td className="py-3 px-4">{exam.classTitle}</td>
                                    <td className="py-3 px-4 text-gray-600">{exam.title}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 mt-12">
                    <img src="/Animation - 1750148058142.gif" alt="No results" className="w-80 h-80 mb-6" />
                    <p className="text-lg">نتیجه‌ای یافت نشد</p>
                </div>
            )}
        </div>
    );
}
