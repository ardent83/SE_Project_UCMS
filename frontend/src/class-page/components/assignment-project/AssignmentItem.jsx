import React from "react";

const AssignmentItem = ({ assignment }) => {
    const today = new Date();
    const endDate = new Date(assignment.endDate);
    const ended = today > endDate;
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="w-full max-w-84 p-4 flex flex-col justify-end items-center gap-1 rounded-lg border border-neutralgray-2 cursor-pointer">
            <div className="w-full text-body-05 text-right text-redp flex justify-end gap-1">
                {assignment.name}
            </div>
            <div className="w-full flex justify-end items-center gap-1 text-body-light text-right text-neutralgray-6">
                <span className="">{ended ? "مهلت به پایان رسیده" : `مهلت ارسال: ${daysLeft.toLocaleString("fa-IR")} روز مانده`}</span>
                {assignment.number !== undefined && typeof assignment.number === 'number' ? (
                    <>
                        <span className="w-px h-80/100 border-l border-l-neutralgray-5" aria-hidden="true">&#8203;</span>
                        <div className="flex gap-1">
                            <span>سوال</span>
                            <span>{assignment.number.toLocaleString("fa-IR")}</span>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};
export default AssignmentItem;