import React, { useState, useEffect } from "react";
import { Add, ArrowRight2, ArrowLeft2, Notepad2 } from "iconsax-react";
import ProductCard from "./components/ProductCard.jsx";
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import FilterBox from "./components/FilterBox.jsx";
import JoinClass from "./components/JoinClassPop.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { useClassesData } from "./hooks/useClassesData"; 
import classesPageIcon from "./assets/classes.svg";

export default function ClassesPage() {
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
        <div dir="rtl" className="w-full max-w-[90rem] mx-auto my-10 px-10 text-bg-blue">
            <div className="w-full">
                {/* --- Page Header Section (Title and Icon/Button) --- */}
                <h2 className="text-3xl font-bold mt-6 mb-10 flex items-center border-b border-gray-300 pb-8 gap-2 justify-start">
                    <div className="flex items-start gap-[0.625rem] self-stretch z-10 relative">
                        <img src={classesPageIcon} alt="آیکون کلاس" className="w-9 h-9" />
                    </div>
                    <span>لیست کلاس‌ها</span>
                </h2>
                {/* --- End of Page Header Section --- */}

                {/* --- Search and Filter Section --- */}
                <div className="w-full max-w-screen-xl mx-auto flex flex-wrap justify-between items-center mb-10 gap-3 px-15 relative z-20">
                    <SearchBox
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            userRole === "Instructor"
                                ? "جست‌وجو نام کلاس"
                                : "جست‌وجو نام کلاس، نام استاد"
                        }
                    />
                    {/* Group FilterBox and Button together */}
                    <div className="flex gap-4 items-center">
                        <FilterBox
                            selected={selectedFilter}
                            onChange={setSelectedFilter}
                            options={filterOptions}
                        />
                        <Button
                            buttonText={userRole === "Instructor" ? "کلاس جدید" : "پیوستن به کلاس"}
                            textShow={true}
                            leftIcon={false}
                            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-5 rounded-md flex items-center gap-2 transition-colors duration-200 shadow-md"
                            rightIconComponent={<Add size="20" color="white" />}
                            onClick={userRole === "Instructor" ? handleNewClassClick : () => setShowJoinClassPopup(true)}
                        />
                    </div>
                </div>
                {/* --- End of Search and Filter Section --- */}

                {/* --- Class List / Empty State --- */}
                {loading ? (
                    <div className="text-center py-6 text-gray-400">در حال بارگذاری...</div>
                ) : error ? (
                    <div className="text-center py-6 text-red-500">{error}</div>
                ) : (classes && classes.length > 0) ? (
                    <>
                       <div className="class-list w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-15 auto-rows-fr justify-items-center">
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
                                        onCardClick={() => handleManageClassClick(classItem.id)}
                                    />
                                );
                            })}
                        </div>
                        {/* --- Pagination --- */}
                        <div className="flex justify-center items-center gap-10 mt-10">
                            <Button
                                rightIcon={false}
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="pagination-btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md transition-colors"
                                leftIconComponent={<ArrowRight2 size="20" variant="Bold" color="#4A5568" />}
                            />
                            <span className="page-indicator text-lg font-semibold text-gray-700">{`صفحه ${formatNumber(page)} از ${formatNumber(totalPages)}`}</span>
                            <Button
                                leftIcon={false}
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                                className="pagination-btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md transition-colors"
                                rightIconComponent={<ArrowLeft2 size="20" variant="Bold" color="#4A5568" />}
                            />
                        </div>
                        {/* --- End of Pagination --- */}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl mt-4 bg-gray-50 border border-gray-200">
                        <img src="/Animation - 1750148058142.gif" alt="No results" className="w-80 h-80 mb-6" />
                        <p className="text-gray-600 mb-4 font-bold text-lg">
                            !کلاسی یافت نشد
                        </p>
                        <p className="text-gray-500 mb-6 text-sm">
                            {userRole === "Instructor"
                                ? ".برای شروع، یک کلاس جدید ایجاد کنید"
                                : ".کدهای کلاس‌های جدید را وارد کنید و به آن‌ها بپیوندید"
                            }
                        </p>
                        {userRole === "Student" && (
                            <Button
                                buttonText={"پیوستن به کلاس"}
                                textShow={true}
                                leftIcon={false}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-colors duration-200 shadow-md"
                                rightIconComponent={<Add size="20" variant="Outline" color="white" />}
                                onClick={() => setShowJoinClassPopup(true)}
                            />
                        )}
                    </div>
                )}
                {/* --- End of Class List / Empty State --- */}
            </div>

            {/* Join Class Pop-up Modal */}
            {showJoinClassPopup && (
                <JoinClass
                    onClose={() => setShowJoinClassPopup(false)}
                    onSubmit={handleJoinClassSubmit}
                />
            )}
        </div>
    );
}
