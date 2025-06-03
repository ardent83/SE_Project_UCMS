import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import PhaseItem from "./PhaseItem";
import { Add } from "iconsax-react";

const PhaseList = ({ phases, projectId, userRole }) => { 
  const navigate = useNavigate();

  const handlePhaseClick = (phaseId) => {
    navigate(`/project/${projectId}/phase/${phaseId}`);
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">فازها</h2>
        {userRole === "Instructor" && ( 
          <Button
            rightIcon={false}
            buttonText={"فاز جدید"}
            className="w-29 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
            leftIconComponent={<Add size="20" variant="Linear" />}
          />
        )}
      </div>
      {phases.length === 0 ? (
        <p className="text-gray-600 text-center py-4">هیچ فازی برای این پروژه تعریف نشده است.</p>
      ) : (
        phases.map((phase) => (
          <div
            key={phase.phaseId}
            onClick={() => handlePhaseClick(phase.phaseId)}
            className="cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          >
            <PhaseItem title={phase.title} />
          </div>
        ))
      )}
    </div>
  );
};

export default PhaseList;