import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import PhaseItem from "./PhaseItem";
import { Add } from "iconsax-react";
import NoPhaseImage from "../assets/NoPhase.svg";

const PhaseList = ({ phases, projectId, userRole, onAddPhaseClick }) => {
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
            onClick={onAddPhaseClick}
            className="w-29 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
            leftIconComponent={<Add size="20" variant="Linear" />}
          />
        )}
      </div>

      {phases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-50 rounded-xl mt-4">
          <img
            src={NoPhaseImage}
            alt="هیچ فازی یافت نشد"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <p className="text-gray-600 mb-4 font-bold text-lg">
            هیچ فازی برای این پروژه تعریف نشده است.
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            برای سازماندهی بهتر پروژه خود، فازهای جدیدی را اضافه کنید.
          </p>
        </div>
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
