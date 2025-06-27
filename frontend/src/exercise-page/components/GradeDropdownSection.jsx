import React, { useState, useEffect } from "react";
import { DirectboxNotif } from "iconsax-react";
import Alert from "../../components/Alert";

const GradeUpload = ({
    onDownloadTemplate,
    onFileChange,
    onUpload,
    onCancel,
    selectedFile,
    uploadError,
    isUploading,
    currentExercise,
}) => {
    const fileName = selectedFile ? selectedFile.name : "فایلی انتخاب نشده ...";
    const isDownloadTemplateButtonDisabled = isUploading || !currentExercise || !currentExercise.id;

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (uploadError) {
            setShowAlert(true);
        }
    }, [uploadError]);

    return (
        <>
            {showAlert && (
                <Alert
                    message={uploadError}
                    type="error"
                    duration={5000}
                    onClose={() => setShowAlert(false)}
                />
            )}

            <div className="w-full max-w-[80rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-0" dir="rtl">
                <div className="flex items-center justify-between w-full" dir="rtl">
                    <p className="text-right m-0">
                        لطفا فایل مربوطه را دانلود کرده و پس از تکمیل آن، بارگذاری کنید.
                    </p>
                    <button
                        onClick={onDownloadTemplate}
                        className="text-white px-6 py-1.5 rounded-xl cursor-pointer"
                        title="دانلود قالب نمره"
                        disabled={isDownloadTemplateButtonDisabled}
                    >
                        <DirectboxNotif size="35" variant="Bulk" color="#08146f" />
                    </button>
                </div>

                <div className="flex items-center gap-3 justify-end ml-5 mt-10">
                    <div className="border border-gray-300 rounded-xl bg-gray-50 text-right px-10 py-1 text-gray-600 min-w-[200px] truncate">
                        {fileName}
                    </div>
                    <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                        <span>آپلود فایل</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => onFileChange(e.target.files[0])}
                            accept=".xlsx, .xls, .csv"
                            disabled={isUploading || isDownloadTemplateButtonDisabled}
                        />
                    </label>
                </div>

                <div className="flex gap-3 justify-end ml-5 mb-5 mt-10 items-center">
                    <button
                        onClick={onCancel}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                        disabled={isUploading}
                    >
                        انصراف
                    </button>
                    <button
                        onClick={onUpload}
                        disabled={isUploading || !selectedFile || isDownloadTemplateButtonDisabled}
                        className={`px-6 py-1.5 rounded-xl text-white ${
                            isUploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-big-stone-900 hover:bg-big-stone-800 cursor-pointer"
                        }`}
                    >
                        {isUploading ? "در حال ارسال..." : "ثبت"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default GradeUpload;
