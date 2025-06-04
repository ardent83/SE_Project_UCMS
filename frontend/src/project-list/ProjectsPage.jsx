import React, { useState, useEffect } from "react";
import { Notepad2 } from "iconsax-react";
import FilterBox from "./components/FilterBox";
import SearchBox from "./components/SearchBox";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { fetchProjects } from "./utils/ProjectListApi.js";

const statusColors = {
    "تکمیل": "bg-green-200 text-green-800",
    "در حال انجام": "bg-sky-200 text-sky-700",
    "شروع نشده": "bg-orange-200 text-orange-700",
};

export default function ProjectsPage() {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const [projectsData, setProjectsData] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("همه");

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchProjects();
            setProjectsData(data);
        };
        loadProjects();
    }, []);

    const filteredProjects = projectsData.filter((p) => {
        const lowerSearch = search.trim().toLowerCase();
        const matchesSearch =
            p.name.toLowerCase().includes(lowerSearch) ||
            p.lesson.toLowerCase().includes(lowerSearch);
        const matchesFilter = filter === "همه" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div dir="lrt" className="w-full max-w-[90rem] mx-auto my-10 px-10 text-bg-blue">
            <h2 className="text-3xl font-bold mt-6 mb-10 flex items-center border-b border-gray-300 pb-8 gap-2 justify-end">
                <span>پروژه‌ها</span>
                <div className="flex items-start gap-[0.625rem] self-stretch z-10 relative">
                    <Notepad2 color="#0C1E33" size={35} variant="Bold" />
                </div>
            </h2>

            <div className="flex flex-wrap justify-between items-center mb-15 gap-4 relative z-20">
                <FilterBox selected={filter} onChange={setFilter} />
                <SearchBox
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجو نام پروژه، کلاس"
                />
            </div>

            <div className="w-full">
                <div className="overflow-y-auto max-h-[380px] relative z-10">
                    <table className="w-full border-collapse text-center">
                        <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-gray-300 text-gray-400 text-sm">
                            <th className="py-3 px-4">وضعیت</th>
                            <th className="py-3 px-4">تاریخ تحویل</th>
                            <th className="py-3 px-4">زمان</th>
                            <th className="py-3 px-4">درس</th>
                            <th className="py-3 px-4">نام پروژه</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-100 transition">
                                    <td className="py-3 px-4">
                      <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}
                      >
                        {project.status}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">{project.deliveryDate}</td>
                                    <td className="py-3 px-4">{project.time}</td>
                                    <td className="py-3 px-4">{project.lesson}</td>
                                    <td className="py-3 px-4 text-gray-600">{project.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                    نتیجه‌ای یافت نشد
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
