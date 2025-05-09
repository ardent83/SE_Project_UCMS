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
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const params = new URLSearchParams({
          ...(searchQuery && { Title: searchQuery }),
          ...(selectedFilter !== "همه" && {
            isActive: selectedFilter === "فعال" ? "true" : "false",
          }),
          Page: page,
          PageSize: pageSize,
        });

        console.log(user)
        console.log(userRole)
        let apiEndpoint;
        if (userRole === "Instructor") {
          apiEndpoint = `${apiBaseUrl}/api/Classes/instructor?${params.toString()}`;
        } else if (userRole === "Student") {
          apiEndpoint = `${apiBaseUrl}/student?${params.toString()}`;
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

    fetchClasses();
  }, [searchQuery, selectedFilter, page, pageSize, userRole]);

  const handleJoinClassSubmit = (formData) => {
    console.log("داده‌های فرم دریافت‌شده:", formData);
    setShowJoinClassPopup(false);
    // fetchClasses();
  };

  const handleNewClassClick = () => {
    if (userRole === "Instructor") {
       // create class form
    } else if (userRole === "Student") {
      setShowJoinClassPopup(true); 
    }
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
            className="w-27"
            rightIconComponent={<Add size="20" variant="bold" />}
            onClick={handleNewClassClick}
          />
        </div>
      </div>

      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : error ? (
        <div>{error}</div>
      ) : classes.length > 0 ? (
        <>
          <div className="class-list">
            {classes.map((classItem) => (
              <ProductCard
                key={classItem.id}
                title={classItem.title}
                studentCount={classItem.studentCount}
                instructorName={classItem.instructorName || "نام استاد نامشخص"}
                imageUrl={classItem.profileImageUrl || ""}
                userRole={userRole} // پاس دادن نقش کاربر به ProductCard
              />
            ))}
          </div>
          <div className="pagination">
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="pagination-btn"
              leftIcon={false}
              rightIconComponent={<ArrowLeft2 size="20" variant="bold" />}
            />
            <span className="page-indicator">{`صفحه ${page} از ${totalPages}`}</span>
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
        <div className="text-center text-gray-500 mt-4">کلاسی یافت نشد</div>
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
