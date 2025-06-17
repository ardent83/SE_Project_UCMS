import React from "react";
import "./ProductCard.css";
import usersIcon from "../assets/users.svg";
import editIcon from "../assets/edit.svg";

const ProductCard = ({
  title,
  instructorName,
  studentCount,
  imageUrl,
  onEditClick,
  userRole,
  onCardClick, 
}) => {
  const formatStudentCount = (count) => {
    return Number(count ?? 0).toLocaleString("fa-IR");
  };

  return (
    <div 
      className="product-card" 
      onClick={onCardClick} 
      style={{ cursor: "pointer" }} 
      role="button" 
      tabIndex={0} 
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onCardClick(); }} 
    >
      <div
        className="card-image"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
      ></div>
      <div className="card-content">
        <h3 className={userRole === "Instructor" ? "title-no-instructor" : ""}>
          {title}
        </h3>
        {userRole === "Student" && <h4>{instructorName}</h4>}
      </div>
      <div className="card-footer">
        <div className="students-number">
          <div className="students-text">
            <span className="count">{formatStudentCount(studentCount)}</span>
            <span className="label">دانشجو</span>
          </div>
          <img
            src={usersIcon}
            alt="آیکون تعداد دانشجو"
            className="member-icon"
          />
        </div>
        {userRole === "Instructor" && (
          <button
            onClick={(e) => { e.stopPropagation(); onEditClick(); }} 
            className="edit-button"
            aria-label="ویرایش"
          >
            <img src={editIcon} alt="آیکون ویرایش" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;