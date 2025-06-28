import React, { useState, useCallback } from 'react';
import Modal from '../../components/Modal';
import { Folder } from 'iconsax-react';
import { uploadGradesFile, downloadScoreTemplateFileApi } from "../utils/ExamsPageApi";

const ScoreUpload = ({ show, onClose, examId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setMessage("");
            setIsError(false);
        }
    };

    const handleDownloadTemplate = useCallback(async () => {
        try {
            setLoading(true);
            await downloadScoreTemplateFileApi(examId);
        } catch (error) {
            setMessage("خطا در دانلود فایل قالب");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, [examId]);

    const handleSubmit = async () => {
        if (!selectedFile) {
            setMessage("لطفاً یک فایل انتخاب کنید.");
            setIsError(true);
            return;
        }

        setLoading(true);
        try {
            const result = await uploadGradesFile(examId, selectedFile);
            setSelectedFile(null);

            if (result.success) {
                setMessage("فایل با موفقیت ثبت شد.");
                setIsError(false);
                setTimeout(() => {
                    handleClose();
                }, 2000);
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
        } catch (error) {
            console.error("خطا در ارسال فایل:", error);
            if (error.data && Array.isArray(error.data.data)) {
                const errorsList = error.data.data
                    .filter(row => !row.isValid)
                    .map(row => `خط ${row.rowNumber}: ${row.errors.join("، ")}`)
                    .join("\n");
                setMessage(errorsList || error.message || "خطا در ارسال فایل");
            } else {
                setMessage(error.message || "خطا در ارسال فایل");
            }
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setMessage("");
        setIsError(false);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <div className="text-right text-white relative" dir="rtl">
                <div className="absolute top-5 left-0 p-2 cursor-pointer" title="دانلود قالب نمره">
                    <Folder color="#fff" size="30" variant="Bulk" onClick={handleDownloadTemplate}/>
                </div>

                <h2 className="text-2xl font-bold mb-4">ثبت نمره</h2>
                <p className="mb-6 mt-15">
                    لطفاً فایل قالب را دانلود کرده، پس از تکمیل، آن را بارگذاری کنید.
                </p>

                <div className="flex items-center gap-3 mb-6 mt-6 justify-end">
                    <input
                        id="fileUpload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <span className="text-sm bg-gray-500 px-8 py-1 rounded-2xl">
                        {selectedFile ? selectedFile.name : 'فایلی انتخاب نشده ...'}
                    </span>
                    <label
                        htmlFor="fileUpload"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-2xl cursor-pointer"
                    >
                        انتخاب فایل
                    </label>
                </div>

                {message && (
                    <p className={`${isError ? "text-red-400" : "text-green-400"} text-sm mb-4`}>
                        {message}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                        disabled={loading}
                    >
                        انصراف
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "در حال ارسال..." : "ثبت"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ScoreUpload;
