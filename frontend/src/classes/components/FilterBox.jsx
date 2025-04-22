import React, { useState } from "react";
import filterIcon from "../assets/filter.png";

const filterOptions = ["همه", "فعال", "غیرفعال"];

export default function FilterBox({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-30" dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 px-4 gap-2.5 rounded-md border border-gray-200 bg-gray-100 text-sm text-slate-800"
      >
        <span>{selected}</span>
        <img src={filterIcon} alt="filter" className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-md shadow-md z-10 w-full text-sm">
          {filterOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === option ? "bg-gray-100 font-bold" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
