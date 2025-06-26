import React from "react";
import Button from "../../components/Button";
import GroupItem from "./GroupItem";
import { Add } from "iconsax-react";
import NoGroupsImage from '../assets/NoGroup.svg';

const GroupList = ({ teams, userRole, currentUserId, onAddGroupClick, onDeleteTeamRequest }) => {
    return (
        <div className="w-full max-w-md p-4 rounded-xl shadow-sm bg-[#0c1e33]/40" data-testid="group-list-container"> {/* Added data-testid */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-bg-blue">گروه‌ها</h2>
                {userRole === "Instructor" && (
                    <Button
                        leftIcon={false}
                        textShow={false}
                        onClick={onAddGroupClick}
                        className="w-4 border border-blue-300 rounded-full p-2 hover:bg-blue-100 transition"
                        rightIconComponent={<Add size="20" variant="Linear" />}
                        data-testid="create-group-button" // Added data-testid
                    />
                )}
            </div>

            <div className="teams-list-section">
                {(teams && teams.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-800/10 rounded-xl mt-4" data-testid="no-groups-message"> {/* Added data-testid */}
                        <img src={NoGroupsImage} alt="گروهی یافت نشد" className="w-32 h-32 mb-4 opacity-70" />
                        <p className="text-gray-200 mb-4 font-bold text-lg">
                            هیچ گروهی برای این پروژه تعریف نشده است.
                        </p>
                        <p className="text-gray-300 mb-6 text-sm">
                            با ایجاد گروه‌ها، اعضا را سازماندهی و وظایف را تقسیم‌بندی کنید.
                        </p>
                        {userRole === "Instructor" && (
                            <Button
                                rightIcon={false}
                                buttonText={"ایجاد گروه جدید"}
                                onClick={onAddGroupClick}
                                className="w-35 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                                leftIconComponent={<Add size="20" variant="Linear" />}
                                data-testid="create-group-empty-state-button" // Added data-testid
                            />
                        )}
                    </div>
                ) : (
                    (teams || []).map((team) => (
                        <GroupItem
                            key={team.id}
                            team={team}
                            userRole={userRole}
                            currentUserId={currentUserId}
                            onDeleteTeamRequest={onDeleteTeamRequest}
                            data-testid={`group-item-${team.id}`} // Added data-testid (if not already there from previous step)
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default GroupList;
