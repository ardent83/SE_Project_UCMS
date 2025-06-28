import { Profile2User } from "iconsax-react";
import React from "react";
import MemberItem from "./MemberItem.jsx";
import { useAuth } from "../../../auth/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Members = ({ members, classId }) => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";

    const getDisplayName = (member) => {
        if (userRole === "Instructor") {
            return `${member.studentNumber} | ${member.firstName}\t${member.lastName}`;
        }
        if (userRole === "Student") {
            return `${member.firstName}\t${member.lastName}`;
        }
        return "";
    };

    if (userRole !== "Instructor" && userRole !== "Student") return "not supported";

    return (
        <section className="flex w-full max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            {/* Header */}
            <div className="w-full max-w-88 p-4 flex justify-between items-center border-b border-b-neutralgray-2">
                <div className="text-body-05 text-right text-redp flex gap-1">
                    <span>نفر</span>
                    <span>{members.length.toLocaleString("fa-IR")}</span>
                </div>
                <div className="w-fit flex justify-between items-center gap-1">
                    <span className="text-caption-02 text-sm text-right text-[#292D32]">اعضای کلاس</span>
                    <Profile2User color={"#292D32"} variant="Bold" size={"16"} />
                </div>
            </div>

            {/* Members List */}
            <div className="w-full max-h-150 overflow-y-auto flex flex-col flex-1">
                {members.length > 0 ? (
                    members.map((member, index) => (
                        <div key={index}>
                            <MemberItem
                                firstLastName={getDisplayName(member)}
                                image={member.profileImagePath}
                                studentId={member.userId}
                                classId={classId}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-center py-12">
                        <img
                            src="/src/class-page/assets/user-not-found.png"
                            alt="No members"
                            className="w-25 h-23"
                        />
                        <span className="text-caption-02 text-[0.7rem] text-neutral-400">
                            !عضوی وجود ندارد
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Members;
