import React, { useEffect, useState } from 'react';

const EmailConfirmedPage = () => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/confirmed-animation.json') // چون فایل داخل public هست، نیازی به import نیست
            .then((res) => res.json())
            .then(setAnimationData)
            .catch((err) => console.error("خطا در لود انیمیشن:", err));
    }, []);

    return (
        <div className="w-screen h-screen bg-[#e3ebf5] font-[IRANYekanXVF] flex justify-center items-center relative overflow-hidden" dir="rtl">
            <div className="bg-white w-[750px] h-[550px] rounded-xl shadow-xl text-center z-10">
                <div className="h-full flex flex-col justify-center items-center px-8">
                    <img
                        src="/emailConfirmed.png"
                        alt="تأیید شد"
                        className="w-[250px] h-[220px] mb-4 mr-10"
                    />
                    <h1 className="text-xl text-[#021257] font-bold mt-0 mb-2">
                        سلام مهسا محمدی عزیز!
                    </h1>
                    <p className="text-sm text-gray-700 leading-loose">
                        به سامانه‌ی ...... خوش اومدی
                    </p>
                    <p className="text-sm text-gray-700 leading-loose mt-1">
                        ثبت‌نام شما با موفقیت انجام شد!
                    </p>
                    <button
                        className="bg-[#021257] hover:bg-[#03186d] text-white text-sm py-2 px-6 rounded-lg mt-10 transition cursor-pointer"
                        onClick={() => window.location.href = '/auth'}
                    >
                        بازگشت به سامانه
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmedPage;
