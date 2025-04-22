// src/classes/ClassesPage.jsx
import React from "react";
import { useState } from "react";
import ProductCard from "./components/ProductCard.jsx";
import "./ClassesPage.css";
import classesIcon from "./assets/classes.svg";
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import { Add } from "iconsax-react";
import filterIcon from "./assets/filter.svg";
import FilterBox from "./components/FilterBox.jsx";

const ClassesPage = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("همه");

  // data
  const classes = [
    {
      id: 1,
      title: "کلاس ریاضی پیشرفته",
      instructorName: "استاد اژه‌ای",
      studentCount: 48,
      imageUrl: "",
    },
    {
      id: 2,
      title: "کلاس علوم تجربی",
      instructorName: "استاد اژه‌ای",
      studentCount: 48,
      imageUrl: "",
    },
    {
      id: 3,
      title: "کلاس زبان انگلیسی",
      instructorName: "استاد اژه‌ای",
      studentCount: 48,
      imageUrl: "",
    },
    {
      id: 4,
      title: "کلاس برنامه‌نویسی",
      instructorName: "استاد اژه‌ای",
      studentCount: 48,
      imageUrl: "",
    },
    {
      id: 5,
      title: "کلاس برنامه‌نویسی",
      instructorName: "استاد اژه‌ای",
      studentCount: 48,
      imageUrl: "",
    },
  ];

  return (
      <div className="main-content">
        <div className="page-title">
          <h2>لیست کلاس‌ها</h2>
          <img src={classesIcon} alt="آیکون کلاس" />
        </div>
        <div className="search-filter-addbtn-div">
          
          <SearchBox></SearchBox>

          <div className="filter-addbtn-div">
            <FilterBox selected={selectedFilter} onChange={setSelectedFilter} />

            <Button
              buttonText={"کلاس جدید"}
              textShow={true}
              leftIcon={false}
              className="w-27"
              rightIconComponent={<Add variant="Outline" />}
              onClick={() => {
                setAlertMessage({ alertMessage });
                setShowAlert(true);
              }}
            />
          </div>
        </div>
        <div className="class-list">
          {classes.map((classItem) => (
            <ProductCard
              key={classItem.id}
              title={classItem.title}
              studentCount={classItem.studentCount}
              instructorName={classItem.instructorName}
              imageUrl={classItem.imageUrl}
            />
          ))}
        </div>
      </div>
  );
};

export default ClassesPage;
