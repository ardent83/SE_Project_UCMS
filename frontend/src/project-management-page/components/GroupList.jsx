import React, { useCallback } from "react";
import Button from "../../components/Button";
import GroupItem from "./GroupItem";
import { Add } from "iconsax-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GroupList = ({ teams, userRole, currentUserId }) => {
  const fetchTeamMembers = useCallback(async (teamId, role) => {
    try {
      let apiEndpoint;
      if (role === "Instructor") {
        apiEndpoint = `${apiBaseUrl}/api/Teams/instructor/${teamId}`;
      } else if (role === "Student") {
        apiEndpoint = `${apiBaseUrl}/api/Teams/student/${teamId}`;
      } else {
        throw new Error("نقش کاربر پشتیبانی نمی‌شود.");
      }

      const response = await fetch(apiEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.studentTeams || [];
    } catch (err) {
      console.error(`Error fetching members for team ${teamId}:`, err);
      throw err;
    }
  }, []);

  return (
    <div className="w-full max-w-md p-4 rounded-xl shadow-sm bg-[#0c1e33]/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-bg-blue">گروه‌ها</h2>
        {userRole === "Instructor" && ( 
          <Button
            leftIcon={false}
            textShow={false}
            className="w-4 border border-blue-300 rounded-full p-2 hover:bg-blue-100 transition"
            rightIconComponent={<Add size="20" variant="Linear" />}
          />
        )}
      </div>

      <div className="teams-list-section">
        {teams.length === 0 && (
          <p className="text-center text-sm text-gray-500">گروهی یافت نشد.</p>
        )}
        {teams.map((team) => (
          <GroupItem
            key={team.id}
            team={team}
            userRole={userRole}
            currentUserId={currentUserId}
            fetchTeamMembers={fetchTeamMembers}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupList;