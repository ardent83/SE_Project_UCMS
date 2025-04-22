import searchIcon from "../assets/search-normal.svg";

export default function SearchBox({ value, onChange, placeholder = "جست‌وجو نام کلاس، نام استاد" }) {
  return (
    <div
      className="flex flex-row-reverse items-center h-10 px-4 py-1 gap-2.5 rounded-md border border-gray-200 bg-gray-100 w-full max-w-md"
      dir="rtl"
    >
      <img src={searchIcon} alt="search icon" className="w-5 h-5 ml-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent flex-1 focus:outline-none text-sm text-slate-800 placeholder:text-slate-500"
      />
    </div>
  );
}