import React, {useEffect, useState} from 'react';

const VerificationPage = () => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);

    useEffect(() => {
        if (timeLeft === 0) {
            setResendEnabled(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleResend = () => {
        if (!resendEnabled) return;

        setTimeLeft(60);
        setResendEnabled(false);
    };

    return (<div className="w-screen h-screen bg-[#e3ebf5] font-[IRANYekanXVF] flex justify-center items-center" dir="rtl">
            <div className="w-screen h-screen bg-[#e3ebf5] font-[IRANYekanXVF] flex justify-center items-center" dir="rtl">
                <div className="bg-white w-[750px] h-[550px] rounded-xl shadow-xl text-center p-0 overflow-hidden">

                    <div className="h-full flex flex-col justify-center items-center px-8">
                        <img
                            src="emailVerification.jpg"
                            alt="email"
                            className="w-[300px] h-[220px] mb-4"
                        />

                        <h1 className="text-xl text-[#021257] font-bold mt-2 mb-2">
                            ثبت‌نام اولیه شما با موفقیت انجام شد!
                        </h1>
                        <p className="text-sm text-gray-700 leading-loose">
                            یک ایمیل حاوی لینک تأیید برای شما ارسال شده است.
                        </p>
                        <p className="text-sm text-gray-700 leading-loose mt-1">
                            لطفاً ایمیل خود را بررسی کرده و برای فعال‌سازی حساب، روی لینک تأیید کلیک کنید.
                        </p>

                        <div className="mt-10 flex flex-row-reverse justify-center items-center gap-3">
                            <button
                                onClick={handleResend}
                                disabled={!resendEnabled}
                                className={`text-white text-xs py-2 px-4 rounded-lg transition ${resendEnabled ? 'bg-[#021257] hover:bg-[#03186d] cursor-pointer' : 'bg-gray-500 cursor-not-allowed'}`}>
                                ارسال مجدد
                            </button>
                            <span className="text-xs bg-gray-200 text-gray-800 py-2 px-3 rounded-lg">
                              {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs text-gray-600">
                              در صورت عدم دریافت، می‌توانید روی ارسال مجدد کلیک کنید.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>);
};

export default VerificationPage;
