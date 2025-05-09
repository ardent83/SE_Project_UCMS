import React from "react";
import "./ProductCard.css";
import usersIcon from "../assets/users.svg";
import editIcon from "../assets/edit.svg";

const ProductCard = ({
  title,
  instructorName,
  studentCount,
  imageUrl,
  onEdit,
  userRole,
}) => {
  return (
    <div className="product-card">
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
            <span>دانشجو</span>
            <span>{studentCount ?? 0}</span>
          </div>
          <img
            src={usersIcon}
            alt="آیکون تعداد دانشجو"
            className="member-icon"
          />
        </div>
        {userRole === "Instructor" && (
          <button
            onClick={onEdit ? onEdit : () => {}}
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