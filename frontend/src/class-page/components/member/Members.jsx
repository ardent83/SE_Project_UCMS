import {Profile2User} from "iconsax-react";
import React from "react";
import MemberItem from "./MemberItem.jsx";

const Members = ({ members }) => {
    return (
        <section className="flex w-full max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            <div className="w-full max-w-88 p-4 flex justify-between items-center border-b border-b-neutralgray-2">
                <div className="text-body-05 text-right text-redp flex gap-1">
                    <span>نفر</span>
                    <span>{members.length.toLocaleString("fa-IR")}</span>
                </div>
                <div className="w-fit flex justify-between items-center gap-1">
                    <span className="text-caption-03 text-right text-[#292D32]">اعضای کلاس</span>
                    <Profile2User color={"#292D32"} variant="Bold" size={"16"} />
                </div>
            </div>
            <div className="w-full max-h-100 overflow-y-auto flex flex-col">
                {members.map((member, index) => (
                    <MemberItem key={index} firstLastName={member.name} image={member.image} />
                ))}
            </div>
        </section>
    );
};

export default Members;