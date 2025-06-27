import React from "react";

const AssignmentItem = ({ assignment,onClick }) => {
    const today = new Date();
    const endDate = new Date(assignment.endDate);
    const ended = today > endDate;
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="w-full max-w-70 p-4 flex flex-col ml-6 mb-2 justify-start items-center gap-1 rounded-lg border border-neutralgray-2 cursor-pointer
    transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-md hover:bg-sky-100 z-30"
             onClick={onClick}>

            <div className="w-full text-body-05 text-sm text-right text-redp flex justify-end gap-1">
                {assignment.name}
            </div>
            <div className="w-full flex justify-end items-center gap-1 text-body-light text-right text-neutralgray-6">
                <span className="">{ended ? "مهلت به پایان رسیده" : `مهلت ارسال: ${daysLeft.toLocaleString("fa-IR")} روز مانده`}</span>
                {assignment.number !== undefined && typeof assignment.number === 'number' ? (
                    <>
                        <span className="w-px h-80/100 border-l border-l-neutralgray-5" aria-hidden="true">&#8203;</span>
                    </>
                ) : null}
            </div>
        </div>
    );
};
export default AssignmentItem;