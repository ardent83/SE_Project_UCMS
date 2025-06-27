import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { submitStudentSubmissionApi } from "../../utils/PhaseSubmissionForStudentApi.js";

const PhaseSubmitTab = ({ phaseFormats }) => {
    const { phaseId } = useParams();
    const [selectedFormat, setSelectedFormat] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableFormats = phaseFormats
        ? phaseFormats.split(",").map((ext) => ext.trim().toUpperCase())
        : [];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!selectedFormat) {
            setStatusMessage("⚠️ ابتدا فرمت فایل را انتخاب کنید.");
            e.target.value = null;
            return;
        }

        if (file) {
            const fileExt = file.name.split(".").pop().toUpperCase();
            if (fileExt === selectedFormat) {
                setSelectedFile(file);
                setStatusMessage("");
            } else {
                setSelectedFile(null);
                setStatusMessage(`❌ فرمت فایل باید ${selectedFormat} باشد.`);
            }
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
            setStatusMessage(`❌ خطا در ارسال فایل: ${err?.message || "نامشخص"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-[80rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-10" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ارسال فایل فاز</h3>

            <div className="flex items-center gap-3 mb-4">
                <label className="text-gray-700 font-medium">نوع فایل:</label>
                <select
                    value={selectedFormat}
                    onChange={(e) => {
                        setSelectedFormat(e.target.value);
                        setSelectedFile(null);
                        setStatusMessage("");
                    }}
                    className="border border-gray-300 rounded-xl text-center px-5 py-1 bg-gray-50 text-gray-800 min-w-[300px] truncate cursor-pointer"
                    disabled={isSubmitting || availableFormats.length === 0}
                >
                    <option value="" disabled>انتخاب فرمت...</option>
                    {availableFormats.map((format, index) => (
                        <option key={index} value={format}>{format}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-3 justify-end ml-5">
                <div className="border border-gray-300 rounded-xl bg-gray-50 text-right px-10 py-1 text-gray-600 min-w-[200px] truncate">
                    {selectedFile?.name || "فایلی انتخاب نشده ..."}
                </div>
                <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                    آپلود فایل
                    <input
                        type="file"
                        accept={selectedFormat ? `.${selectedFormat.toLowerCase()}` : "*/*"}
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting || !selectedFormat}
                    />
                </label>
            </div>

            {/* پیام وضعیت */}
            {statusMessage && (
                <div className={`text-sm text-right px-3 font-medium ${isUploaded ? "text-green-600" : "text-red-600"}`}>
                    {statusMessage}
                </div>
            )}

            {/* دکمه‌ها */}
            <div className="flex gap-3 justify-end ml-5 mb-5 mt-10">
                <button
                    onClick={() => {
                        setSelectedFile(null);
                        setStatusMessage("");
                        setSelectedFormat("");
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                    disabled={isSubmitting}
                >
                    انصراف
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isSubmitting}
                    className={`px-6 py-1.5 rounded-xl text-white ${
                        !selectedFile || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-800 hover:bg-blue-900 cursor-pointer"
                    }`}
                >
                    {isSubmitting ? "در حال ارسال..." : "ثبت"}
                </button>
            </div>
        </div>
    );
};

export default PhaseSubmitTab;
