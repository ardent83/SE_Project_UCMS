import React, { useState } from "react";
import axios from "axios";
import {DirectboxNotif} from "iconsax-react";

const GradeUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("فایلی انتخاب نشده ...");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert("لطفاً یک فایل انتخاب کنید.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsUploading(true);
            const response = await axios.post("/api/upload-grade", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("فایل با موفقیت ارسال شد.");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("ارسال فایل با خطا مواجه شد.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 text-sm text-gray-700 mt-5" dir="rtl">
            <div className="flex items-center justify-between w-full" dir="rtl">
                <p className="text-right m-0">
                    لطفا فایل مربوطه را دانلود کرده و پس از تکمیل آن، بارگذاری کنید.
                </p>
                <div title="دانلود فایل" className="cursor-pointer">
                    <DirectboxNotif size="35" variant="Bulk" color="#08146f" />
                </div>
            </div>

            <div className="flex items-center gap-3 self-end mt-5">
                <div className="border border-gray-300 rounded-xl text-right px-10 py-1 text-gray-600 min-w-[200px]">
                    {fileName}
                </div>
                <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                    آپلود فایل
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

            </div>

            <div className="flex gap-3 self-end mt-5">
                <button
                    onClick={() => {
                        setSelectedFile(null);
                        setFileName("فایلی انتخاب نشده ...");
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                >
                    انصراف
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                >
                    {isUploading ? "در حال ارسال..." : "ثبت"}
                </button>

            </div>
        </div>
    );
};

export default GradeUpload;
