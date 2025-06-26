import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { submitStudentSubmissionApi } from "../../utils/PhaseSubmissionApi.js";

const PhaseSubmitTab = () => {
    const { phaseId } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setStatusMessage("");
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setIsSubmitting(true);
        setStatusMessage("");

        try {
            await submitStudentSubmissionApi(phaseId, selectedFile);
            setStatusMessage("✅ فایل با موفقیت ارسال شد.");
            setSelectedFile(null);
            setIsUploaded(true);
        } catch (err) {
            setIsUploaded(false);
            if (err?.message === "FileIsNeeded") {
                setStatusMessage("❌ لطفاً یک فایل انتخاب کنید.");
            } else {
                setStatusMessage(`❌ خطا در ارسال فایل: ${err.message || "نامشخص"}`);
            }
        } finally {
            setIsSubmitting(false);
        }
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
                        accept=".pdf,.zip"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            {statusMessage && (
                <div
                    className={`text-sm text-right px-3 font-medium ${
                        isUploaded ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {statusMessage}
                </div>
            )}


            <div className="flex gap-3 justify-end ml-5 mb-5 mt-10">
                <button
                    onClick={() => {
                        setSelectedFile(null);
                        setStatusMessage("");
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                >
                    انصراف
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isSubmitting}
                    className={`px-6 py-1.5 rounded-xl text-white ${
                        !selectedFile || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-big-stone-900 hover:bg-big-stone-800 cursor-pointer"
                    }`}
                >
                    {isSubmitting ? "در حال ارسال..." : "ثبت"}
                </button>
            </div>
        </div>
    );
};

export default PhaseSubmitTab;
