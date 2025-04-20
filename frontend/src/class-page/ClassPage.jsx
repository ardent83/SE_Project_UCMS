import React from "react";
import ClassHeader from "./ClassHeader";
import { Add, Calendar2, Clock, Location, Profile2User } from "iconsax-react";

const HeadSection = ({ title, onClik }) => {
    return (
        <div className="flex w-full h-[1.69613rem] items-center gap-[0.21175rem] px-[0.21175rem] py-0">
            <div onClick={onClik} className="flex h-[1.69613rem] justify-center items-center p-[0.33925rem] rounded-[0.25444rem] bg-[#ECF9FD]">
                <Add color="var(--color-redp)" size={24} />
            </div>
            <span className="w-full border-b-[color:#EDF2F7] opacity-[0.6] h-[0.04313rem] border-b-[0.689px]"></span>
            <span className="text-redp text-body-04">{title}</span>
        </div>
    );
}

const MyLine = ({ className }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" height="2" viewBox="0 0 144 2" fill="none">
            <path d="M1.10583 0.914062L143.106 0.914075" stroke="url(#paint0_linear_10174_3597)" strokeWidth="0.592672" strokeLinecap="round" />
            <defs>
                <linearGradient id="paint0_linear_10174_3597" x1="-12.657" y1="-76.0845" x2="214.038" y2="41.5262" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0C1E33" />
                    <stop offset="1" stopColor="#0C1E33" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const Exam = ({ color, title, date, time, location }) => {
    const backgroundStyle = {
        backgroundColor: color,
        borderColor: color
    };

    return (
        <div className="w-full max-w-40 h-30 py-2 px-4 flex flex-col items-center gap-1 cursor-pointer relative">
            <div className="text-caption-03 flex justify-end items-center self-stretch relative z-10">
                {title}
            </div>
            <MyLine className="w-full relative z-10" />
            <div className="h-[3.6rem] flex flex-col items-start gap-2 relative z-10">
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className=" text-caption-light text-redp flex justify-end items-center self-stretch">
                        {date}
                    </span>
                    <Calendar2 color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className=" text-caption-light text-redp flex justify-end items-center self-stretch">
                        {time}
                    </span>
                    <Clock color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
                <div className="w-full flex items-center gap-1 justify-end">
                    <span className=" text-caption-light text-redp flex justify-end items-center self-stretch">
                        {location}
                    </span>
                    <Location color={"var(--color-redp)"} variant="Bold" size={"16"} />
                </div>
            </div>
            <div className="w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-0 left-0 z-1 rounded-lg" style={backgroundStyle}></div>
            <div className="border border-neutralgray-2 w-[calc(100%-0.25rem)] h-[calc(100%-0.25rem)] absolute top-1 left-1 z-0 rounded-lg"></div>
        </div>
    );
};


const Exams = ({ exams }) => {
    return (
        <div className="w-full flex flex-col items-center gap-2">
            <HeadSection title={"امتحانات"} />
            <div className="w-full flex justify-between items-start">
                {exams.map((exam, index) => (
                    <Exam
                        key={index}
                        color={exam.color}
                        title={exam.title}
                        date={exam.date}
                        time={exam.time}
                        location={exam.location}
                    />
                ))}
            </div>
        </div>
    );
}


const AboutCard = ({ description }) => {
    return (
        <div className="self-stretch h-fit flex flex-col justify-center items-center rounded-lg border-[0.8px] porder-solid border-neutralgray-2 p-4">
            <h6 className="text-caption-03 text-right text-black self-stretch">درباره‌ی کلاس</h6>
            <p className="text-caption-04 text-right text-black self-stretch">
                {description}
            </p>
        </div>
    );
}


const MemberItem = ({ firstLastName, image }) => {
    return (
        <div className="w-full max-w-88 p-4 flex justify-end items-center gap-2 border-b last:border-none border-b-neutralgray-2 cursor-pointer">
            <label className="flex justify-end items-center text-body-05 text-right text-redp self-stretch">
                {firstLastName}
            </label>
            <div
                className="profile-img w-8 h-8 rounded-full"
                style={{ "--bg": `url(${image})` }}
            />
        </div>
    )
}

const Members = ({ members }) => {
    return (
        <section className="flex w-full max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            <div className="w-full max-w-88 p-4 flex justify-between items-center border-b border-b-neutralgray-2">
                <div className="text-body-05 text-right text-redp flex gap-1">
                    <span>نفر</span>
                    <span>{members.length.toLocaleString("fa-IR")}</span>
                </div>
                <div className="w-fit flex justify-between items-center gap-1">
                    <span className="text-caption-03 text-right text-[#292D32]">اعضای کلاس</span>
                    <Profile2User color={"#292D32"} variant="Bold" size={"16"} />
                </div>
            </div>
            {members.map((member, index) => (
                <MemberItem key={index} firstLastName={member.name} image={member.image} />
            ))}
        </section>
    );
};

const AssignmentItem = ({ assignment }) => {
    const today = new Date();
    const endDate = new Date(assignment.endDate);
    const ended = today > endDate;
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="w-full max-w-84 p-4 flex flex-col justify-end items-center gap-1 rounded-lg border border-neutralgray-2 cursor-pointer">
            <div className="w-full text-body-05 text-right text-redp flex justify-end gap-1">
                {assignment.name}
            </div>
            <div className="w-full flex justify-end items-center gap-1 text-body-light text-right text-neutralgray-6">
                <span className="">{ended ? "مهلت به پایان رسیده" : `مهلت ارسال: ${daysLeft.toLocaleString("fa-IR")} روز مانده`}</span>
                {assignment.number !== undefined && typeof assignment.number === 'number' ? (
                    <>
                        <span className="w-px h-80/100 border-l border-l-neutralgray-5" aria-hidden="true">&#8203;</span>
                        <div className="flex gap-1">
                            <span>سوال</span>
                            <span>{assignment.number.toLocaleString("fa-IR")}</span>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};




const Assignment = ({ assignments }) => {
    return (
        <section className="flex w-full p-3 gap-2 max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            <HeadSection title={"تمرین‌ها"} />
            {assignments.map((assignment, index) => (
                <AssignmentItem key={index} assignment={assignment} />
            ))}
        </section>
    );
};

const AssignmentProject = ({ assignments }) => {
    return (
        <section className="flex w-full p-3 gap-2 max-w-88 flex-col items-center flex-[1_0_0] border-[0.8px] border-solid border-neutralgray-2 rounded-lg">
            <HeadSection title={"پروژه‌ها"} />
            {assignments.map((assignment, index) => (
                <AssignmentItem key={index} assignment={assignment} />
            ))}
        </section>
    );
};


const membersData = [
    { name: "فاطمه صیادزاده", image: "path/to/image1.jpg" },
    { name: "کیمیا کبیری", image: "path/to/image2.jpg" },
    { name: "محمدمهدی محسن‌پور", image: "path/to/image3.jpg" },
    { name: "حنانه نوروطن", image: "path/to/image4.jpg" },
    { name: "فاطمه‌زهرا فتحیان", image: "path/to/image5.jpg" },
    { name: "حسین احمدی", image: "path/to/image6.jpg" }
];


const assignmentsData = [
    { name: "تمرین 1", number: 5, endDate: new Date("2025/04/20") },
    { name: "تمرین 2", number: 3, endDate: new Date("2025-04-25") },
    { name: "تمرین 3", number: 10, endDate: new Date("2025-04-18") },
    { name: "تمرین 4", number: 8, endDate: new Date("2025-04-30") },
];

const assignmentProjectsData = [
    { name: "پروژه 1", endDate: new Date("2025-05-10") },
    { name: "پروژه 2", endDate: new Date("2025-05-15") },
    { name: "پروژه 3", endDate: new Date("2025-05-20") },
];

const examsData = [
    { color: "var(--color-light-lavender)", title: "کوییز کلاسی 1", date: "شنبه ۱۸ اسفند", time: "۱۰:۰۰-۱۱:۰۰", location: "دانشکده فنی مهندس، کلاس ۱۶" },
    { color: "var(--color-pale-yellow)", title: "امتحان میان‌ترم", date: "یکشنبه ۲۶ فروردین", time: "۱۴:۰۰-۱۶:۰۰", location: "سالن امتحانات مرکزی" },
    { color: "var(--color-sky-blue)", title: "کوییز کلاسی 2", date: "دوشنبه ۲۷ فروردین", time: "۱۰:۰۰-۱۱:۰۰", location: "دانشکده فنی مهندس، کلاس ۱۶" },
    { color: "var(--color-light-green)", title: "امتحان پایان‌ترم", date: "شنبه ۱۰ خرداد", time: "۰۹:۰۰-۱۲:۰۰", location: "سالن امتحانات مرکزی" },
];


export default function ClassPage() {
    return (
        <div className="flex w-full max-w-277.5 py-4 h-fit flex-col justify-start items-center gap-4">
            <ClassHeader title={"ساختمان داده‌ها"} startDate={"۱۴۰۴/۱۲/۱۲"} endDate={"۱۳۸۳/۱۲/۱۲"} days={"یکشنبه و سه‌شنبه"} times={"۱۶:۰۰-۱۴:۰۰"} />
            <div className="w-full flex h-full justify-between gap-2 items-start shrink-0 pl-[0.84706rem]">
                <div className="w-full max-w-[45.8rem] gap-5 flex flex-col items-start">
                    {/* Pass examsData to the Exams component */}
                    <Exams exams={examsData} />
                    <div className="w-full flex justify-between gap-2 items-start flex-[1_0_0]">
                        <Assignment assignments={assignmentsData} />
                        <AssignmentProject assignments={assignmentProjectsData} />
                    </div>
                </div>
                <div className="w-full max-w-88 flex flex-col items-start gap-3">
                    <AboutCard description={".کلاس ساختمان داده به بررسی و پیاده‌سازی ساختارهای مختلف داده مانند آرایه‌ها، لیست‌های پیوندی، پشته، صف، درخت و گراف می‌پردازد. این درس نقش مهمی در درک مفاهیم پایه‌ای الگوریتم‌ها و بهینه‌سازی عملکرد برنامه‌ها ایفا می‌کند"} />
                    <Members members={membersData} />
                </div>
            </div>
        </div>
    );
}
