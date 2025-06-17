import React, {useState} from 'react';
import Modal from '../../components/Modal';
import {Folder} from 'iconsax-react';

const ScoreUpload = ({show, onClose, examId}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (selectedFile) {
            console.log('فایل ارسال شد:', selectedFile);
            console.log('مربوط به آزمون با ID:', examId);
            onClose();
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="text-right text-white relative" dir="rtl">
                <div className="absolute top-5 left-0 p-2">
                    <Folder color="#fff" size="30" variant="Bulk"/>
                </div>

                <h2 className="text-2xl font-bold mb-4">ثبت نمره</h2>
                <p className="mb-6 mt-15">
                    لطفاً فایل مربوطه را دانلود کرده، پس از تکمیل، فایل آن را بارگذاری کنید.
                </p>

                <div className="flex items-center gap-3 mb-15 mt-10 justify-end">
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

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer"
                    >
                        ثبت
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ScoreUpload;
