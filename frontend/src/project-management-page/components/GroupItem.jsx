import React, { useState } from 'react';
import { ArrowDown2, InfoCircle, Trash } from "iconsax-react"; 
import { useTeamMembers } from '../hooks/useTeamMembers';

const GroupItem = ({ team, userRole, currentUserId, onDeleteTeamRequest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); 

    const { members, loadingMembers, membersError, loadMembers } = useTeamMembers(team.id, userRole);

    const handleToggle = async () => {
        if (!isOpen && members.length === 0 && !loadingMembers && !membersError) {
            await loadMembers();
        }
        setIsOpen(!isOpen);
    };

    
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        if (onDeleteTeamRequest) {
            onDeleteTeamRequest(team.id, team.name); 
        }
    };

    return (
        <div
            className={`
                group relative overflow-hidden
                bg-[#1f3044]
                p-4 rounded-xl mb-3
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-in-out
                hover:scale-[1.005]
                ${isOpen ? 'ring-2 ring-blue-500' : 'ring-0'}
            `}
            style={{ minHeight: isOpen ? 'auto' : '65px' }}
        >
            {/* هدر گروه (نام تیم، فلش و آیکون حذف) */}
            <div
                className="flex justify-between items-center cursor-pointer text-gray-100 text-right"
                onClick={handleToggle}
                aria-expanded={isOpen}
            >
                <span className="flex-grow text-base font-bold flex items-center">
                    {team.name}
                </span>
                {userRole === "Instructor" && ( 
                    <div className="relative">
                        <Trash
                            size="20"
                            variant="Outline"
                            color="#a0aec0" 
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                            onClick={handleDeleteClick}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)} 
                            style={{ cursor: 'pointer' }}
                        />
                        {showTooltip && (
                            <div className="absolute top-1/2 left-full -translate-y-1/2 transform bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50 mr-2">
                                حذف تیم
                            </div>
                        )}
                    </div>
                )}
                <ArrowDown2
                    size="28"
                    color={isOpen ? "#3b82f6" : "#a0aec0"}
                    variant={isOpen ? "Bulk" : "Linear"}
                    className={`
                        transform transition-transform duration-300
                        ${isOpen ? 'rotate-180' : ''}
                        group-hover:text-blue-400
                    `}
                />
            </div>

            {/* بخش نمایش اعضا */}
            {isOpen && (
                <div className="members-section mt-4 pt-4 border-t border-gray-700">
                    {loadingMembers && (
                        <div className="flex items-center justify-center text-xs text-gray-400">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال بارگذاری اعضا...
                        </div>
                    )}
                    {membersError && (
                        <div className="flex items-center justify-center text-xs text-red-400">
                            <InfoCircle size="16" className="ml-1" />
                            {membersError}
                        </div>
                    )}
                    {!loadingMembers && !membersError && members.length === 0 && (
                        <div className="flex items-center justify-center text-xs text-gray-400">
                            <InfoCircle size="16" className="ml-1" />
                            عضوی یافت نشد.
                        </div>
                    )}
                    {!loadingMembers && !membersError && members.length > 0 && (
                        <ul className="text-xs font-medium text-gray-200">
                            {members.map(member => (
                                <li
                                    key={member.studentId}
                                    className={`
                                        flex items-center mb-2 px-2 py-1 rounded
                                        ${member.studentId === currentUserId
                                            ? 'bg-blue-800/40 font-bold text-blue-300 border-l-4 border-blue-500'
                                            : 'hover:bg-[#34465b]'
                                        }
                                    `}
                                >
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-3 flex-shrink-0">
                                        {member.fullName ? member.fullName.charAt(0) : '#'}
                                    </div>
                                    <span className="text-right flex-grow">
                                        {member.displayName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupItem;