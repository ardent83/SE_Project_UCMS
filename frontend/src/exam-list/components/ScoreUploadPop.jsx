import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { Folder } from 'iconsax-react';
import { uploadGradesFile, downloadScoreTemplateFileApi } from "../utils/ExamsPageApi";

const ScoreUpload = ({ show, onClose, examId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleDownloadTemplate = async () => {
        try {
            setLoading(true);
            await downloadScoreTemplateFileApi(examId);
        } catch (error) {
            setErrorMsg("خطا در دانلود فایل قالب");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setErrorMsg("لطفاً یک فایل انتخاب کنید.");
            return;
        }

        try {
            setLoading(true);
            await uploadGradesFile(examId, selectedFile);
            setSuccessMsg("فایل با موفقیت ثبت شد.");
            setErrorMsg("");
            setSelectedFile(null);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setErrorMsg("خطا در ارسال فایل: " + (error.message || "نامشخص"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
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
                        آپلود فایل
                    </label>
                </div>

                {errorMsg && <p className="text-red-400 text-sm mb-4">{errorMsg}</p>}
                {successMsg && <p className="text-green-400 text-sm mb-4">{successMsg}</p>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
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
