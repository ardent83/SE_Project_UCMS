import React, {useCallback, useState} from "react";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { Trash } from "iconsax-react";
import {leaveClassById} from "../../utils/classPageApi.js";

const MemberItem = ({ firstLastName, image, onDelete }) => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";

    const [isHovered, setIsHovered] = useState(false);

    let displayName = firstLastName;
    let firstChar;

    if (userRole === "Instructor") {
        const namePart = firstLastName?.split("|")[1]?.trim() || "";
        firstChar = namePart.charAt(0).toUpperCase() || "?";
    } else {
        firstChar = firstLastName.charAt(0).toUpperCase() || "?";
    }

    const handleRemoveStudentFromClass = useCallback(async () => {
        try {
            await leaveClassById(id);
            console.log(`Class ${id} leaved successfully.`);
            navigate(`/classes`, {state: {message: " با موفقیت از کلاس خارج شد."}});
        } catch (err) {
            console.error("Error leaving class:", err);
            setError("خطایی در خروح از کلاس رخ داد!");
        }
    }, [id, navigate]);

    return (
        <div
            className="w-full max-w-88 p-4 flex justify-end items-center gap-2 border-b last:border-none border-b-neutralgray-2 cursor-pointer relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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

            {userRole === "Instructor" && isHovered && (
                <Trash
                    size={20}
                    color="#FF4D4F"
                    className="absolute left-2 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete();
                    }}
                />
            )}
        </div>
    );
};

export default MemberItem;
