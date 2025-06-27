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

            <div class="w-full max-w-[80rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-0" dir="rtl">
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

                <div className="flex items-center gap-3 justify-end mt-5">
                    <div className="border border-gray-300 rounded-xl text-right px-10 py-1 text-gray-600 min-w-[200px]">
                        {fileName}
                    </div>
                    <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-1.5 rounded-xl cursor-pointer">
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

                <div className="flex gap-3 justify-end mt-5">
                    <button
                        onClick={onCancel}
                        className="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        disabled={isUploading}
                    >
                        انصراف
                    </button>
                    <button
                        onClick={onUpload}
                        disabled={isUploading || !selectedFile || isDownloadTemplateButtonDisabled}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                    >
                        {isUploading ? "در حال ارسال..." : "ثبت"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default GradeUpload;
