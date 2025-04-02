import React from "react";

const InfoText = ({ type, i, j }) => (
    <div className={`info-text ${type}`}>
        <h2 className="animation" style={{ "--i": i, "--j": j }}>خوش‌آمدید</h2>
        <p className="animation" style={{ "--i": i, "--j": j }}>
            سامانه مدیریت پروژه‌های دانشجویی
        </p>
    </div>
);

export default InfoText;
