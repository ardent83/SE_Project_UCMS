import React, { useState } from "react";
import { Copy, CopySuccess } from "iconsax-react";

function ClassInfo({ classCode, onClose }) {
    const [copied, setCopied] = useState({ code: false, password: false });

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied((prev) => ({ ...prev, [field]: true }));
            setTimeout(() => {
                setCopied((prev) => ({ ...prev, [field]: false }));
            }, 1500);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div
                className="bg-[var(--white)] w-[400px] p-6 rounded-2xl shadow-lg relative"
                style={{ animation: "var(--animate-fadeIn)" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-[var(--color-neutralgray-3)] w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                    aria-label="بستن فرم"
                >
          <span className="text-[var(--color-big-stone-900)] text-lg font-bold mt-1">
            ×
          </span>
                </button>

                <h2
                    className="text-center mb-2 text-[var(--color-big-stone-900)]"
                    style={{
                        fontSize: "var(--text-heading-h4)",
                        fontWeight: "var(--text-heading-h4--font-weight)",
                        lineHeight: "var(--text-heading-h4--line-height)",
                    }}
                >
                    اطلاعات کلاس
                </h2>

                <div className="w-72 h-0.5 bg-[var(--color-neutralgray-3)] mx-auto mb-4 rounded"></div>

                <div className="space-y-3 text-right" dir="rtl">
                    <div>
                        <label className="block text-[var(--color-big-stone-900)] font-bold mb-1">
                            کد کلاس:
                        </label>
                        <div className="bg-[var(--color-neutralgray-1)] p-2 rounded-lg flex items-center justify-between text-left">
                            <code dir="ltr" className="select-all">{classCode}</code>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(classCode, "code")}
                                className="text-[var(--lightBulue)] hover:text-[var(--color-big-stone-800)] cursor-pointer mr-2"
                                aria-label="کپی کد کلاس"
                            >
                                {copied.code ? (
                                    <CopySuccess size={20} color="var(--lightBulue)" variant="Bold" />
                                ) : (
                                    <Copy size={20} color="var(--lightBulue)" variant="Outline" />
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ClassInfo;
