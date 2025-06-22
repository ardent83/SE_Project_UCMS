import React, { useState } from "react";

const PhaseSubmitTab = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    return (
        <div className="w-full max-w-[60rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-10" dir="rtl">
            <div className="space-y-2 mt-5 mr-5 text-[1rem]">
                <p>لطفا فایل پاسخ خود را انتخاب کنید.</p>
            </div>

            <div className="flex items-center gap-3 justify-end ml-5">
                <div className="border border-gray-300 rounded-xl bg-gray-50 text-right px-10 py-1 text-gray-600 min-w-[200px] truncate">
                    {selectedFile?.name || "فایلی انتخاب نشده ..."}
                </div>
                <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                    آپلود فایل
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            <div className="flex gap-3 justify-end ml-5 mb-5 mt-10">
                <button
                    onClick={() => setSelectedFile(null)}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                >
                    انصراف
                </button>
                <button
                    onClick={() => alert("فایل با موفقیت ارسال شد.")}
                    disabled={!selectedFile}
                    className={`px-6 py-1.5 rounded-xl cursor-pointer text-white ${
                             "bg-big-stone-900 hover:bg-big-stone-900"
                    }`}
                >
                    ثبت
                </button>
            </div>
        </div>
    );
};

export default PhaseSubmitTab;
