import React from "react";

const PhaseItem = ({ title }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-right text-sm font-medium mb-2"
         data-testid="phase-item"> {/* Added data-testid */}
      {title}
    </div>
  );
};

export default PhaseItem;
