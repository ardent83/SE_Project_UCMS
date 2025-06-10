import React, { useState } from "react";
import { Copy, CopySuccess } from "iconsax-react";
import Modal from "../../components/Modal.jsx";

function ClassInfo({ classCode, onClose, show }) {
    const [copied, setCopied] = useState({ code: false });

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied((prev) => ({ ...prev, [field]: true }));
            setTimeout(() => {
                setCopied((prev) => ({ ...prev, [field]: false }));
            }, 1500);
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                    aria-label="بستن فرم"
                >
                    <span className="text-white text-lg font-bold mt-1">×</span>
                </button>

                <h2 className="text-center mb-2 text-white text-xl font-semibold">اطلاعات کلاس</h2>

                <div className="w-72 h-0.5 bg-gray-600 mx-auto mb-4 rounded"></div>

                <div className="space-y-3 text-right" dir="rtl">
                    <div>
                        <label className="block text-white font-bold mb-1">کد کلاس:</label>
                        <div className="bg-gray-700 p-2 rounded-lg flex items-center justify-between text-left">
                            <code dir="ltr" className="select-all text-white">{classCode}</code>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(classCode, "code")}
                                className="text-blue-400 hover:text-blue-300 cursor-pointer mr-2"
                                aria-label="کپی کد کلاس"
                            >
                                {copied.code ? (
                                    <CopySuccess size={20} color="#60A5FA" variant="Bold" />
                                ) : (
                                    <Copy size={20} color="#60A5FA" variant="Outline" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ClassInfo;
