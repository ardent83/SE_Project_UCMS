import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClassesApi, joinClassApi } from "../utils/classAPI.js";
import { formatClassForProductCard, formatNumberToPersian } from "../utils/classFormatters";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useClassesData = (userRole) => { 
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("همه");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8); 
    const [totalPages, setTotalPages] = useState(1);

    const [showJoinClassPopup, setShowJoinClassPopup] = useState(false);

    const loadClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                searchQuery,
                selectedFilter,
                page,
                pageSize,
            };
            const data = await fetchClassesApi(params, userRole);

            const formattedClasses = (data.items || []).map(classItem =>
                formatClassForProductCard(classItem, API_BASE_URL) 
            );

            setClasses(formattedClasses);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (err) {
            console.error("Error loading classes:", err);
            setError(err.message || "خطایی در دریافت لیست کلاس‌ها رخ داد!");
            setLoading(false);
        }
    }, [searchQuery, selectedFilter, page, pageSize, userRole]);

    useEffect(() => {
        loadClasses();
    }, [loadClasses]); 

    const handleJoinClassSubmit = useCallback(async (formData) => {
        try {
            const result = await joinClassApi(formData);

            if (result.success) {
                setShowJoinClassPopup(false);
                setError(null);
                await loadClasses(); 
            } else {
                throw new Error(result.message || "خطایی در ورود به کلاس رخ داد!");
            }
        } catch (err) {
            console.error("Error joining class:", err);
            setError(err.message || "خطایی در ورود به کلاس رخ داد!");
            setShowJoinClassPopup(false);
        }
    }, [loadClasses]);

    const handleNewClassClick = useCallback(() => {
        if (userRole === "Instructor") {
            navigate("/class/create/"); 
        } else if (userRole === "Student") {
            setShowJoinClassPopup(true);
        }
    }, [userRole, navigate]);

    const handleManageClassClick = useCallback((classId) => {
        navigate(`/class/${classId}`);
    }, [navigate]);

    const handleEditClassClick = useCallback((classId) => {
        navigate(`/class/edit/${classId}`);
    }, [navigate]);

    const filterOptions = ["همه", "فعال", "غیرفعال"];

    return {
        classes,
        loading,
        error,
        selectedFilter,
        setSelectedFilter,
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        totalPages,
        showJoinClassPopup,
        setShowJoinClassPopup,
        handleJoinClassSubmit,
        handleNewClassClick,
        handleManageClassClick,
        handleEditClassClick,
        filterOptions,
        formatNumber: formatNumberToPersian,
        loadClasses 
    };
};