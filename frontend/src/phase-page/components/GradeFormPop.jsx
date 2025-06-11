import React, { useState } from "react";

const GradeForm = ({ groupId, members = [], grades, onChange, onSubmit, onCancel, readOnly = false, error = "" }) => {
    const [submittedMessage, setSubmittedMessage] = useState(false);

    const handleSubmitClick = () => {
        onSubmit();
        setSubmittedMessage(true);
        setTimeout(() => {
            setSubmittedMessage(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl" dir="rtl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-right text-white">  گروه {groupId}</h2>
                    {readOnly && (
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-red-600 text-xl font-bold"
                            title="بستن"
                        >
                            ×
                        </button>
                    )}
                </div>

                <form className="space-y-2">
                    {members.map((member, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between py-3 ${idx !== members.length - 1 ? 'border-b border-gray-400' : ''}`}
                        >
                            <label className="text-gray-300">{member}</label>
                            <input
                                type="number"
                                min="0"
                                value={grades[member] || ""}
                                onChange={(e) => onChange(member, e.target.value)}
                                className="border bg-gray-200 border-gray-300 rounded px-3 py-1 w-24 text-right"
                                disabled={readOnly}
                            />
                        </div>
                    ))}


                    {error && (
                        <div className="text-red-600 mt-2 text-sm text-right">
                            {error}
                        </div>
                    )}

                    {!readOnly && (
                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-xl"
                                onClick={onCancel}
                            >
                                انصراف
                            </button>
                            <button
                                type="button"
                                className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-xl"
                                onClick={handleSubmitClick}
                            >
                                ثبت نهایی
                            </button>
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

export default GradeForm;
