import React, { useState } from "react";

const GradeForm = ({
                       groupId,
                       members = [], // array of { id, firstName, lastName }
                       grades,
                       onChange,
                       onCancel,
                       readOnly = false,
                       error = "",
                   }) => {
    const [submitted, setSubmitted] = useState({});
    const [submitErrors, setSubmitErrors] = useState({});

    const handleSubmitMemberGrade = async (memberId) => {
        const grade = grades[memberId];

        if (!grade && grade !== 0) {
            setSubmitErrors((prev) => ({
                ...prev,
                [memberId]: "نمره وارد نشده است.",
            }));
            return;
        }

        try {
            const res = await fetch("/api/submit-grade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId, member: memberId, grade }),
            });

            if (!res.ok) throw new Error("خطا در ارسال نمره");

            setSubmitted((prev) => ({ ...prev, [memberId]: true }));
            setSubmitErrors((prev) => ({ ...prev, [memberId]: "" }));

            setTimeout(() => {
                setSubmitted((prev) => ({ ...prev, [memberId]: false }));
            }, 2000);
        } catch (err) {
            setSubmitErrors((prev) => ({
                ...prev,
                [memberId]: "ارسال نمره با خطا مواجه شد.",
            }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl shadow-xl" dir="rtl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">گروه {groupId}</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-red-500 text-xl"
                        title="بستن"
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-auto">
                    <table className="w-full text-sm text-center text-white ">
                        <thead className="bg-gray-700 text-gray-200 ">
                        <tr>
                            <th className="px-4 py-2 ">شماره دانشجویی</th>
                            <th className="px-4 py-2 ">نام و نام خانوداگی</th>
                            <th className="px-4 py-2 ">نمره</th>
                            {!readOnly && <th className="px-4 py-2 ">عملیات</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="">
                                <td className="px-4 py-2 border-b border-b-gray-600">{member.id}</td>
                                <td className="px-4 py-2 border-b border-b-gray-600">{member.firstName} {member.lastName}</td>
                                <td className="px-4 py-2 border-b border-b-gray-600">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={grades[member.id] || ""}
                                        onChange={(e) => onChange(member.id, e.target.value)}
                                        disabled={readOnly}
                                        className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-black w-20 text-center"
                                    />
                                    {submitErrors[member.id] && (
                                        <div className="text-red-400 text-xs mt-1">{submitErrors[member.id]}</div>
                                    )}
                                </td>
                                {!readOnly && (
                                    <td className="px-4 py-2 border-b border-b-gray-600">
                                        <button
                                            type="button"
                                            onClick={() => handleSubmitMemberGrade(member.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            ثبت نمره
                                        </button>
                                        {submitted[member.id] && (
                                            <span className="text-green-400 text-sm ml-2">✔ ثبت شد</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {error && <div className="text-red-500 text-sm mt-4 text-right">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default GradeForm;
