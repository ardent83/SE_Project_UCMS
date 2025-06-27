import React, { useState, useEffect } from "react";
import Alert from "../../components/Alert";

const ExerciseSubmitTab = ({
    onSubmit,
    file,
    setFile,
    description,
    setDescription,
    error,
    isSubmitting,
    submissionError,
    fileFormats
}) => {
    const [selectedFormat, setSelectedFormat] = useState('');
    const [localError, setLocalError] = useState('');
    const availableFormats = fileFormats ? fileFormats.split(',').map(f => f.trim().toUpperCase()) : [];

    useEffect(() => {
        if (error || submissionError) {
            setLocalError(error || submissionError);
        }
    }, [error, submissionError]);

    const handleAlertClose = () => {
        setLocalError('');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop();
            if (fileExtension && availableFormats.includes(fileExtension.toUpperCase())) {
                setSelectedFormat(fileExtension.toUpperCase());
            } else {
                setSelectedFormat('');
                setLocalError(`فرمت فایل انتخاب‌شده مجاز نیست. فرمت‌های مجاز: ${availableFormats.join(', ')}`);
            }
        } else {
            setSelectedFormat('');
        }
    };

    const handleSubmit = () => {
        setLocalError('');
        onSubmit(file);
    };

    return (
        <>
            {localError && (
                <Alert
                    message={localError}
                    type="error"
                    duration={4000}
                    onClose={handleAlertClose}
                />
            )}

            <div className="w-full max-w-[90rem] mx-auto bg-gray-100 rounded-lg p-6 shadow-sm space-y-6 text-sm text-gray-700 mt-10" dir="rtl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">ارسال پاسخ تمرین</h3>

                {availableFormats.length > 0 ? (
                    <div className="flex items-center gap-3 mb-4">
                        <label className="text-gray-700 font-medium">نوع فایل:</label>
                        <select
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="border border-gray-300 rounded-xl text-center px-5 py-1 bg-gray-50 text-gray-800 min-w-[300px] truncate cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {availableFormats.map((format, index) => (
                                <option key={index} value={format}>
                                    {format}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <select disabled className="border border-gray-300 rounded-xl text-center px-5 py-1 bg-gray-50 text-gray-800 min-w-[300px] truncate">
                        <option>فرمت فایلی وجود ندارد</option>
                    </select>
                )}

                <div className="flex items-center gap-3 justify-end ml-5">
                    <div className="border border-gray-300 rounded-xl bg-gray-50 text-right px-10 py-1 text-gray-600 min-w-[200px] truncate">
                        {file ? file.name : "فایلی انتخاب نشده ..."}
                    </div>
                    <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-xl cursor-pointer">
                        آپلود فایل
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept={fileFormats ? availableFormats.map(f => `.${f.toLowerCase()}`).join(',') : '*/*'}
                            disabled={isSubmitting}
                        />
                    </label>
                </div>

                <div className="flex gap-3 justify-end ml-5 mb-5">
                    <button
                        onClick={() => {
                            setFile(null);
                            setDescription('');
                            setSelectedFormat(availableFormats.length > 0 ? availableFormats[0] : '');
                        }}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-1.5 rounded-xl cursor-pointer"
                        disabled={isSubmitting}
                    >
                        انصراف
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !file}
                        className={`px-6 py-1.5 rounded-xl cursor-pointer text-white ${
                            isSubmitting || !file ? "bg-gray-500" : "bg-blue-800 hover:bg-blue-900"
                        }`}
                    >
                        {isSubmitting ? "در حال ارسال..." : "ثبت"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ExerciseSubmitTab;
