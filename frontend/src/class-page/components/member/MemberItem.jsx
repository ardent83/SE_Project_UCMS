import React from "react";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { Trash } from "iconsax-react";
import { removeStudentFromClass } from "../../utils/classPageApi.js";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const MemberItem = ({ firstLastName, image, userId, studentId, classId, onMemberRemoved }) => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const navigate = useNavigate();

    let firstChar;
    if (userRole === "Instructor") {
        const namePart = firstLastName?.split("|")[1]?.trim() || "";
        firstChar = namePart.charAt(0).toUpperCase() || "?";
    } else {
        firstChar = firstLastName.charAt(0).toUpperCase() || "?";
    }

    const handleRemoveStudentFromClass = async () => {
        try {
            await removeStudentFromClass(classId, studentId);
            if (onMemberRemoved) {
                onMemberRemoved(studentId);
            }
        } catch (err) {
            console.error("Error removing student from class:", err);
        }
    };

    return (
        <div className="w-full max-w-88 p-4 flex justify-between items-center gap-2 border-b last:border-none border-b-neutralgray-2">
            {userRole === "Instructor" && (
                <Trash
                    size={20}
                    color="#FF4D4F"
                    className="cursor-pointer ml-2"
                    onClick={handleRemoveStudentFromClass}
                />
            )}

            <div
                onClick={() => navigate(`/profile/${userId}`)}
                className="flex items-center cursor-pointer gap-2 hover:text-big-stone-600"
            >
                <span className="text-body-05 text-redp hover:text-big-stone-600 cursor-pointer">{firstLastName}</span>

                {image ? (
                    <div
                        className="w-8 h-8 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${apiBaseUrl + image})` }}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-neutralgray-2 flex items-center justify-center text-xs text-redp font-bold">
                        {firstChar}
                    </div>
                )}

            </div>
        </div>
    );

};

export default MemberItem;
