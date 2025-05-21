import React from "react";

const MyLine = ({ className }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" height="2" viewBox="0 0 144 2" fill="none">
            <path d="M1.10583 0.914062L143.106 0.914075" stroke="url(#paint0_linear_10174_3597)" strokeWidth="0.592672" strokeLinecap="round" />
            <defs>
                <linearGradient id="paint0_linear_10174_3597" x1="-12.657" y1="-76.0845" x2="214.038" y2="41.5262" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0C1E33" />
                    <stop offset="1" stopColor="#0C1E33" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default MyLine;