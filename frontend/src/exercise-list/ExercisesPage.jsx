import React, { useState, useEffect } from "react";
import { ArrowSwapVertical, TaskSquare} from "iconsax-react";
import FilterBox from "./components/FilterBox";
import SearchBox from "./components/SearchBox";
import { useAuth } from "../auth/context/AuthContext.jsx";
import {fetchExercisesForInstructor, fetchExercisesForStudent} from "./utils/ExerciseListApi.js";
import { useNavigate } from "react-router-dom";

const statusColors = {
    "تکمیل": "bg-green-200 text-green-800",
    "در حال انجام": "bg-sky-200 text-sky-700",
    "شروع نشده": "bg-orange-200 text-orange-700",
    "نامشخص": "bg-gray-200 text-gray-700",
};

export default function ExercisesPage() {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const [exercisesData, setExercisesData] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("همه");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const navigate = useNavigate();

    useEffect(() => {
        const loadExercises = async () => {
            let data = [];
            try {
                if (userRole === "Student") {
                    data = await fetchExercisesForStudent();
                } else if (userRole === "Instructor") {
                    data = await fetchExercisesForInstructor();
                } else {
                    data = [];
                }
                setExercisesData(data);
            } catch (error) {
                console.error("خطا در بارگذاری تکالیف:", error);
                setExercisesData([]);
            }
        };
        loadExercises();
    }, [userRole]);


    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedExercises = [...exercisesData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        if (sortConfig.key === "endDate") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const filteredExercises = sortedExercises.filter((ex) => {
        const lowerSearch = search.trim().toLowerCase();
        const matchesSearch =
            ex.title.toLowerCase().includes(lowerSearch) ||
            ex.classTitle.toLowerCase().includes(lowerSearch);
        const matchesFilter = filter === "همه" || ex.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div dir="ltr" className="w-full max-w-[90rem] mx-auto my-10 px-10 text-bg-blue">
            <h2 className="text-3xl font-bold mt-6 mb-10 flex items-center border-b border-gray-300 pb-8 gap-2 justify-end">
                <span>تکالیف</span>
                <div className="flex items-start gap-[0.625rem] self-stretch z-10 relative">
                    <TaskSquare color="#0C1E33" size={35} variant="Bold" />
                </div>
            </h2>

            <div className="flex flex-wrap justify-between items-center mb-15 gap-4 relative z-20">
                <FilterBox selected={filter} onChange={setFilter} />
                <SearchBox
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجو عنوان تکلیف، کلاس"
                />
            </div>

            <div className="w-full">
                {filteredExercises.length > 0 ? (
                    <div className="overflow-y-auto max-h-[380px] relative z-10">
                        <table className="w-full border-collapse text-center">
                            <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b border-gray-300 text-gray-400 text-sm">
                                <th className="py-3 px-4">وضعیت</th>

                                <th
                                    className="py-3 px-4 cursor-pointer select-none"
                                    onClick={() => handleSort("endDate")}
                                >
                                    <ArrowSwapVertical
                                        size={16}
                                        variant="Bulk"
                                        color="#0C1E33"
                                        className={`inline-block transition-transform duration-800 ${
                                            sortConfig.key === "endDate" && sortConfig.direction === "desc"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                    تاریخ پایان{" "}
                                </th>

                                <th
                                    className="py-3 px-4 cursor-pointer select-none"
                                    onClick={() => handleSort("classTitle")}
                                >
                                    <ArrowSwapVertical
                                        size={16}
                                        variant="Bulk"
                                        color="#0C1E33"
                                        className={`inline-block transition-transform duration-800 ${
                                            sortConfig.key === "classTitle" && sortConfig.direction === "desc"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                    کلاس{" "}
                                </th>

                                <th
                                    className="py-3 px-4 cursor-pointer select-none"
                                    onClick={() => handleSort("title")}
                                >
                                    <ArrowSwapVertical
                                        size={16}
                                        variant="Bulk"
                                        color="#0C1E33"
                                        className={`inline-block transition-transform duration-800 ${
                                            sortConfig.key === "title" && sortConfig.direction === "desc"
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                    عنوان تکلیف{" "}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredExercises.map((exercise) => (
                                <tr
                                    key={exercise.exerciseId}
                                    onClick={() => navigate(`/exercise/${exercise.exerciseId}`)}
                                    className="border-b border-gray-100 hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <td className="py-3 px-4">
                      <span
                          className={`inline-block px-3 py-2 rounded-md text-xs font-semibold ${
                              statusColors[exercise.status] || "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {exercise.status}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(exercise.endDate).toLocaleDateString("fa-IR")}
                                    </td>
                                    <td className="py-3 px-4">{exercise.classTitle}</td>
                                    <td className="py-3 px-4 text-gray-600">{exercise.title}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <img src="/Animation - 1750148058142.gif" alt="No results" className="w-80 h-80 mb-6" />
                        <p className="text-lg mt-0">نتیجه‌ای یافت نشد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
