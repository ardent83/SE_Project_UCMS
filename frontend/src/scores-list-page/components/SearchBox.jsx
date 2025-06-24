import { SearchNormal1 } from "iconsax-react";

export default function SearchBox({value, onChange, placeholder = "جست‌وجو نام کلاس، نام استاد",}) {
    return (
        <div
            className="flex flex-row-reverse items-center h-10 px-4 py-1 gap-2.5 rounded-md border border-gray-200 bg-gray-100 w-full max-w-md"
            dir="rtl"
        >
            <SearchNormal1 size="20" color="#495d72" variant="Bold" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-transparent flex-1 focus:outline-none text-sm text-slate-800 placeholder:text-slate-500 text-body-03"
            />
        </div>
    );
}