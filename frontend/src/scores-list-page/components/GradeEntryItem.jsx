// src/components/GradeEntryItem.jsx
import React, { useState } from 'react';
import { ArrowDown2 } from "iconsax-react";

const GradeEntryItem = ({ entry, formatToPersianNumber }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`
                group relative overflow-hidden
                bg-gray-50 /* Lighter background for the item */
                p-4 rounded-xl mb-3
                shadow-sm hover:shadow-md /* Softer shadows */
                transition-all duration-300 ease-in-out
                hover:scale-[1.005]
                ${isOpen ? 'ring-2 ring-blue-500' : 'ring-0'} /* Blue ring on expand */
            `}
            style={{ minHeight: isOpen ? 'auto' : '65px' }}
            data-testid={`grade-entry-item-${entry.entryId}-${entry.entryType}`}
        >
            {/* Header (Entry Name and Arrow) */}
            <div
                className="flex justify-between items-center cursor-pointer text-gray-800 text-right" /* Darker text for header */
                onClick={handleToggle}
                aria-expanded={isOpen}
                data-testid={`grade-entry-header-${entry.entryId}-${entry.entryType}`}
            >
                <span className="flex-grow text-base font-bold flex items-center" data-testid={`grade-entry-name-${entry.entryId}`}>
                    {entry.entryName}
                </span>
                <ArrowDown2
                    size="28"
                    color={isOpen ? "#3b82f6" : "#495d72"} /* Blue when open, a neutral gray when closed */
                    variant={isOpen ? "Bulk" : "Linear"}
                    className={`
                        transform transition-transform duration-300 mr-2
                        ${isOpen ? 'rotate-180' : ''}
                        group-hover:text-blue-500 /* Hover effect */
                    `}
                    data-testid={`grade-entry-toggle-icon-${entry.entryId}`}
                />
            </div>

            {/* Detailed Scores Section - Lighter backgrounds for details */}
            {isOpen && (
                <div className="detailed-scores-section mt-4 pt-4 border-t border-gray-200" data-testid={`grade-entry-details-${entry.entryId}`}> {/* Lighter border */}
                    <ul className="text-xs font-medium text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <li className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"> {/* Lighter background for detail items */}
                            <span className="text-gray-600">نمره در کل:</span>
                            <span className="text-gray-800 font-semibold" data-testid={`score-in-total-${entry.entryId}`}>
                                {formatToPersianNumber(entry.scoreInTotalScore)}
                            </span>
                        </li>
                        <li className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                            <span className="text-gray-600">کل نمره:</span>
                            <span className="text-gray-800 font-semibold" data-testid={`total-score-${entry.entryId}`}>
                                {formatToPersianNumber(entry.totalScore)}
                            </span>
                        </li>
                        <li className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                            <span className="text-gray-600">نمره در سهم:</span>
                            <span className="text-gray-800 font-semibold" data-testid={`score-in-partial-${entry.entryId}`}>
                                {formatToPersianNumber(entry.scoreInPartialScore)}
                            </span>
                        </li>
                        <li className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                            <span className="text-gray-600">سهم نمره:</span>
                            <span className="text-gray-800 font-semibold" data-testid={`partial-score-${entry.entryId}`}>
                                {formatToPersianNumber(entry.partialScore)}
                            </span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GradeEntryItem;