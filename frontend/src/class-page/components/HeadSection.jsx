import { Add } from "iconsax-react";
import React from "react";
import { useAuth } from "../../auth/context/AuthContext.jsx";

const HeadSection = ({ title, onClick }) => {
    const { user } = useAuth();
    const userRole = user?.data?.role?.name || "guest";
    const isInstructor = userRole === "Instructor";

    return (
        <div className="flex w-full h-[1.69613rem] items-center gap-[0.21175rem] px-[0.21175rem] py-0">
            {isInstructor && (
                <div
                    onClick={onClick}
                    className="flex h-[1.69613rem] justify-center items-center p-[0.33925rem] rounded-[0.25444rem] bg-[#ECF9FD] cursor-pointer"
                >
                    <Add color="var(--color-redp)" size={24} />
                </div>
            )}
            <span className="w-full border-b-[color:#EDF2F7] opacity-[0.6] h-[0.04313rem] border-b-[0.689px]"></span>
            <span className="text-redp text-body-04">{title}</span>
        </div>
    );
};

export default HeadSection;
