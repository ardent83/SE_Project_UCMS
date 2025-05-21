import React from "react";

const AboutCard = ({ description }) => {
    return (
        <div className="self-stretch h-fit flex flex-col justify-center items-center rounded-lg border-[0.8px] porder-solid border-neutralgray-2 p-4">
            <h6 className="text-caption-03 text-right text-black self-stretch">درباره‌ی کلاس</h6>
            <p className="text-caption-04 text-right text-black self-stretch">
                {description}
            </p>
        </div>
    );
}
export default AboutCard