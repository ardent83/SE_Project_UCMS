import React, { useState } from "react";
import { Filter } from "iconsax-react";

export default function FilterBox({ selected, onChange, options = filterOptions, label = "فیلتر" }) { 
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative ml-15 w-[150px]" dir="rtl" data-testid="filter-box-container"> {/* Added data-testid */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full h-10 px-4 gap-2.5 rounded-md border border-gray-200 bg-gray-100 text-body-04 font-medium text-[var(--color-label)]"
                data-testid="filter-box-button" // Added data-testid
            >
                <span data-testid="filter-box-selected-value">{selected}</span> {/* Added data-testid */}
                <Filter size="20" color="var(--label)" variant="Bold" data-testid="filter-icon" /> {/* Added data-testid */}
            </button>

            {isOpen && (
                <div 
                    className="absolute top-12 right-0 bg-white border border-gray-200 rounded-md shadow-md z-10 w-full text-body-04 font-medium"
                    data-testid="filter-box-dropdown" // Added data-testid
                >
                    {options.map((option) => (
                        <div
                            key={option.value || option}
                            onClick={() => handleSelect(option.value || option)} 
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                (selected === (option.value || option)) ? "bg-gray-100 font-bold" : "" 
                            }`}
                            data-testid={`filter-option-${option.value || option}`} // Added data-testid
                        >
                            {option.label || option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
