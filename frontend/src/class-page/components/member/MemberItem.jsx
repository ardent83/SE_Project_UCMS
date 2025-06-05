import React from "react";
import { useAuth } from "../../../auth/context/AuthContext.jsx";

const MemberItem = ({ firstLastName, image }) => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";

    let displayName = firstLastName;
    let firstChar;

    if (userRole === "Instructor") {
        const namePart = firstLastName?.split("|")[1]?.trim() || "";
        firstChar = namePart.charAt(0).toUpperCase() || "?";
    } else {
        firstChar = firstLastName.charAt(0).toUpperCase() || "?";
    }

    return (
        <div className="w-full max-w-88 p-4 flex justify-end items-center gap-2 border-b last:border-none border-b-neutralgray-2 cursor-pointer">
            <label className="flex justify-end items-center text-body-05 text-right text-redp self-stretch cursor-pointer">
                {displayName}
            </label>

            {image ? (
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
