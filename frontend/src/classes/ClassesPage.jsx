import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard.jsx";
import "./ClassesPage.css";
import classesIcon from "./assets/classes.svg";
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import { Add, ArrowRight2, ArrowLeft2 } from "iconsax-react";
import FilterBox from "./components/FilterBox.jsx";
import JoinClass from "./components/JoinClassPop.jsx";
import { useAuth } from "../auth/context/AuthContext";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ClassesPage = () => {
  const { user } = useAuth();
  const userRole = user?.data?.role?.name || "guest";
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("همه");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [showJoinClassPopup, setShowJoinClassPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const fetchClasses = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchQuery && { Title: searchQuery }),
        ...(userRole === "Student" && searchQuery && { InstructorName: searchQuery }),   // test
        ...(selectedFilter !== "همه" && {
          isActive: selectedFilter === "فعال" ? "true" : "false",
        }),
        Page: page,
        PageSize: pageSize,
      });

      let apiEndpoint;
      if (userRole === "Instructor") {
        apiEndpoint = `${apiBaseUrl}/api/Classes/instructor?${params.toString()}`;
      } else if (userRole === "Student") {
        apiEndpoint = `${apiBaseUrl}/api/studentclass/student?${params.toString()}`;
      } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود!");
      }

      console.log("Fetching from:", apiEndpoint);
      const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      setClasses(data.items || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("خطایی در دریافت لیست کلاس‌ها رخ داد!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [searchQuery, selectedFilter, page, pageSize, userRole]);

  const handleJoinClassSubmit = async (formData) => {
    try {
      const requestBody = {
        classCode: formData.classCode,
        password: formData.classPassword,
      };

      const response = await fetch(`${apiBaseUrl}/api/StudentClass/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Join class response:", result);

      if (result.success) {
        setShowJoinClassPopup(false);
        setError(null);
        await fetchClasses();
      } else {
        throw new Error(result.message || "خطایی در ورود به کلاس رخ داد!");
      }
    } catch (err) {
      console.error("Error joining class:", err);
      setError(err.message || "خطایی در ورود به کلاس رخ داد!");
      setShowJoinClassPopup(false);
    }
  };

  const handleNewClassClick = () => {
    if (userRole === "Instructor") {
      // create class form
   } else if (userRole === "Student") {
     setShowJoinClassPopup(true);
   }
  };

  const formatNumber = (number) => {
    return Number(number).toLocaleString("fa-IR");
  };

  return (
    <div className="main-content">
      <div className="page-title">
        <h2>لیست کلاس‌ها</h2>
        <img src={classesIcon} alt="آیکون کلاس" />
      </div>
      <div className="search-filter-addbtn-div">
        <SearchBox
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            userRole === "Instructor"
              ? "جست‌وجو نام کلاس"
              : "جست‌وجو نام کلاس، نام استاد"
          }
        />
        <div className="filter-addbtn-div">
          <FilterBox
            selected={selectedFilter}
            onChange={setSelectedFilter}
            options={["همه", "فعال", "غیرفعال"]}
          />
          <Button
            buttonText={"کلاس جدید"}
            textShow={true}
            leftIcon={false}
            className="w-30"
            rightIconComponent={<Add size="20" variant="bold" />}
            onClick={handleNewClassClick}
          />
        </div>
      </div>

      {loading ? (
        <div>...در حال بارگذاری</div>
      ) : error ? (
        <div className="text-center text-red-500 mt-4">{error}</div>
      ) : classes.length > 0 ? (
        <>
          <div className="class-list">
            {classes.map((classItem) => {
              const imageUrl = classItem.profileImageUrl
                ? `${apiBaseUrl}${classItem.profileImageUrl.startsWith('/') ? '' : '/'}${classItem.profileImageUrl}`
                : "./assets/download.png";
              console.log("Image URL for", classItem.title, ":", imageUrl);
              return (
                <ProductCard
                  key={classItem.id}
                  title={classItem.title}
                  studentCount={classItem.studentCount}
                  instructorName={classItem.instructorFullName || "نام استاد نامشخص"}
                  imageUrl={imageUrl}
                  userRole={userRole}
                />
              );
            })}
          </div>
          <div className="pagination">
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="pagination-btn"
              leftIcon={false}
              rightIconComponent={<ArrowLeft2 size="20" variant="bold" />}
            />
            <span className="page-indicator">{`صفحه ${formatNumber(page)} از ${formatNumber(totalPages)}`}</span>
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="pagination-btn"
              rightIcon={false}
              leftIconComponent={<ArrowRight2 size="20" variant="bold" />}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">!کلاسی یافت نشد</div>
      )}

      {showJoinClassPopup && (
        <JoinClass
          onClose={() => setShowJoinClassPopup(false)}
          onSubmit={handleJoinClassSubmit}
        />
      )}
    </div>
  );
};

export default ClassesPage;