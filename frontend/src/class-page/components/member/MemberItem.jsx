import React from "react";

const MemberItem = ({ firstLastName, image }) => {
    const hasImage = Boolean(image);
    const isInstructor = firstLastName?.includes("|");
    const namePart = isInstructor
        ? firstLastName.split("|")[1]?.trim()
        : firstLastName.trim();
    const firstChar = namePart?.charAt(0).toUpperCase() || "?";

    return (
        <div className="w-full max-w-88 p-4 flex justify-end items-center gap-2 border-b last:border-none border-b-neutralgray-2 cursor-pointer">
            <label className="flex justify-end items-center text-body-05 text-right text-redp self-stretch cursor-pointer">
                {namePart}
            </label>

            {hasImage ? (
                <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-neutralgray-2 flex items-center justify-center text-xs text-redp font-bold">
                    {firstChar}
                </div>
            )}
        </div>
    );
};

export default MemberItem;
