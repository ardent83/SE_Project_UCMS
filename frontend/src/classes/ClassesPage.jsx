import React from "react";
import ProductCard from "./components/ProductCard.jsx";
import "./ClassesPage.css"; 
import classesIcon from "./assets/classes.svg"; 
import noClassesImage from "./assets/no-classes.svg"; 
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import { Add, ArrowRight2, ArrowLeft2 } from "iconsax-react"; 
import FilterBox from "./components/FilterBox.jsx";
import JoinClass from "./components/JoinClassPop.jsx";
import { useAuth } from "../auth/context/AuthContext";
import { useClassesData } from "./hooks/useClassesData"; 

const ClassesPage = () => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";

    const {
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
        formatNumber, 
    } = useClassesData(userRole); 

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
                        options={filterOptions} 
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
            ) : (classes && classes.length > 0) ? (
                <>
                    <div className="class-list">
                        {(classes || []).map((classItem) => { 
                            return (
                                <ProductCard
                                    key={classItem.id}
                                    title={classItem.title}
                                    studentCount={classItem.studentCount}
                                    instructorName={classItem.instructorName}
                                    imageUrl={classItem.imageUrl}          
                                    userRole={userRole}
                                    onManageClick={() => handleManageClassClick(classItem.id)}
                                    onEditClick={() => handleEditClassClick(classItem.id)}
                                    onCardClick={() => handleManageClassClick(classItem.id)} // استفاده از handleManageClassClick
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
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl mt-4">
                    <img src={noClassesImage} alt="کلاسی یافت نشد" className="w-32 h-32 mb-4 opacity-70" />
                    <p className="text-gray-600 mb-4 font-bold text-lg">
                        !کلاسی یافت نشد
                    </p>
                    <p className="text-gray-500 mb-6 text-sm">
                        {userRole === "Instructor"
                            ? ".برای شروع، یک کلاس جدید ایجاد کنید"
                            : ".کدهای کلاس‌های جدید را وارد کنید و به آن‌ها بپیوندید"
                        }
                    </p>
                </div>
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