import React, { useState } from "react";
import { Calendar, PresentionChart, Information } from "iconsax-react";
import PhaseSubmitTab from "./components/Tabs/PhaseSubmitTab.jsx";
import PhaseSubmissionsTab from "./components/Tabs/PhaseSubmissionTab.jsx";

const PhasePageForStudent = () => {
    const [activeTab, setActiveTab] = useState("ارسال پاسخ");

    return (
        <div className="w-full max-w-270 p-6" dir="rtl">
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-between items-center px-10 pb-10" dir="rtl">
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">فاز ۱</h2>
                </div>

                <div className="w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 mb-5" dir="rtl">
                    <div className="text-xl flex items-center gap-2">
                        <Calendar size="25" variant="Linear" color="#495D72" />
                        <span>۲۰ اردیبهشت ۱۴۰۴ - ۲۳:۰۰</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PresentionChart size="25" variant="Linear" color="#495D72" />
                        <span>۳۱ اردیبهشت ۱۴۰۴ - ۱۰:۰۰</span>
                    </div>
                    <div className="flex items-start gap-2 mb-6">
                        <Information size="25" variant="Linear" color="#495D72" />
                        <p className="leading-relaxed">
                            توضیحات فاز اول / توضیحات فاز اول / توضیحات فاز اول...
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-6 border-b border-gray-200">
                {["ارسال پاسخ", "ارسال‌ها"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-5 py-2 rounded-t-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            activeTab === tab
                                ? "bg-big-stone-900 border-x border-t border-gray-200 -mb-px text-white shadow-sm"
                                : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "ارسال پاسخ" && <PhaseSubmitTab />}
            {activeTab === "ارسال‌ها" && <PhaseSubmissionsTab />}
        </div>
    );
};

export default PhasePageForStudent;
