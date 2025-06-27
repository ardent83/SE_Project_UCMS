import React, { useState, useCallback } from "react";
import { DirectboxNotif } from "iconsax-react";
import {
    downloadScoreTemplateFileApi,
    uploadGradesFile,
} from "../utils/PhaseSubmissionForInstructorApi.js";

const GradeSection = ({ phaseId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("فایلی انتخاب نشده ...");
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setMessage("");
            setIsError(false);
        }
    };

    const handleDownloadFile = useCallback(async () => {
        try {
            await downloadScoreTemplateFileApi(phaseId);
        } catch (err) {
            console.error("Error downloading file:", err);
            setMessage("خطایی در دانلود فایل رخ داد!");
            setIsError(true);
        }
    }, [phaseId]);

    const handleUploadFile = async () => {
        if (!selectedFile) {
            setMessage("لطفا ابتدا فایل را انتخاب کنید.");
            setIsError(true);
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadGradesFile(phaseId, selectedFile);
            console.log("Upload result:", result);

            setSelectedFile(null);
            setFileName("فایلی انتخاب نشده ...");

            if (result.success) {
                setMessage("فایل با موفقیت ارسال شد.");
                setIsError(false);
            } else if (Array.isArray(result.data)) {
                const errorsList = result.data
                    .filter(row => !row.isValid)
                    .map(row => `خط ${row.rowNumber}: ${row.errors.join("، ")}`)
                    .join(" | ");

                setMessage(errorsList || result.message || "خطایی رخ داده است.");
                setIsError(true);
            } else {
                setMessage(result.message || "خطایی رخ داده است.");
                setIsError(true);
            }
        } catch (err) {
            console.error("خطا در ارسال فایل:", err);

            if (err.data && Array.isArray(err.data.data)) {
                const errorsList = err.data.data
                    .filter(row => !row.isValid)
                    .map(row => `خط ${row.rowNumber}: ${row.errors.join("، ")}`)
                    .join("\n");

                setMessage(errorsList || err.message);
            } else {
                setMessage(err.message || "خطایی در بارگذاری فایل رخ داد.");
            }
            setIsError(true);
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div
            className="w-full max-w-[60rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-0"
            dir="rtl"
        >
            <div className="flex items-center justify-between w-full" dir="rtl">
                <p className="text-right m-0 text-[1rem]">
                    لطفا فایل مربوطه را دانلود کرده و پس از تکمیل آن، بارگذاری کنید.
                </p>
                <div title="دانلود فایل" className="cursor-pointer ml-5">
                    <DirectboxNotif
                        size="35"
                        variant="Bulk"
                        color="#08146f"
                        onClick={handleDownloadFile}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 justify-end ml-5 mt-10">
                <div className="border border-gray-300 rounded-xl bg-gray-50 text-right px-10 py-1 text-gray-600 min-w-[200px] truncate">
                    {fileName}
                </div>
                <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                    آپلود فایل
                    <input type="file"
                           accept=".pdf,.zip,.rar,.txt,.xlsx,.docx"
                           className="hidden"
                           onChange={handleFileChange} />
                </label>
            </div>

            <div className="flex gap-3 justify-end ml-5 mb-5 mt-10 items-center">

                <button
                    onClick={() => {
                        setSelectedFile(null);
                        setFileName("فایلی انتخاب نشده ...");
                        setMessage("");
                        setIsError(false);
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                >
                    انصراف
                </button>
                <button
                    onClick={handleUploadFile}
                    disabled={isUploading}
                    className={`px-6 py-1.5 rounded-xl text-white ${
                        isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-big-stone-900 hover:bg-big-stone-800 cursor-pointer"
                    }`}
                >
                    {isUploading ? "در حال ارسال..." : "ثبت"}
                </button>

            </div>
            {message && (
                <div
                    className={`min-w-[180px] text-sm font-medium mr-auto ${
                        isError ? "text-red-600" : "text-green-600"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                >
                    {message}
                </div>
            )}

        </div>
    );
};

export default GradeSection;
