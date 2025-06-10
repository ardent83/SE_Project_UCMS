import React from "react";

const AboutCard = ({ description }) => {
    const hasDescription = description && description.trim().length > 0;

    return (
        <div className="self-stretch h-fit flex flex-col justify-center items-center rounded-lg border-[0.8px] border-solid border-neutralgray-2 p-4 " dir="rtl">
            <h6 className="text-caption-03 text-right text-[0.8rem] text-black self-stretch">درباره‌ی کلاس</h6>
            <p
                className={` mt-4 text-caption-04 text-xs text-right self-stretch ${
                    hasDescription ? "text-black" : "text-neutral-400"
                }`}
            >
                {hasDescription ? description : "توضیحی ثبت نشده است."}
            </p>
        </div>
    );
};

export default AboutCard;
