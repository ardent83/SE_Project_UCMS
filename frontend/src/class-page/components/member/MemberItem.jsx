import React from "react";

const MemberItem = ({ firstLastName, image }) => {
    return (
        <div className="w-full max-w-88 p-4 flex justify-end items-center gap-2 border-b last:border-none border-b-neutralgray-2 cursor-pointer">
            <label className="flex justify-end items-center text-body-05 text-right text-redp self-stretch">
                {firstLastName}
            </label>
            <div
                className="profile-img w-8 h-8 rounded-full"
                style={{ "--bg": `url(${image})` }}
            />
        </div>
    )
}
export default MemberItem;