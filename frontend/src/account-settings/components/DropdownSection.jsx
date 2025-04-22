import React, { useState } from "react";
import { ArrowDown2 } from 'iconsax-react';

const DropdownSection = ({ title, children, bgColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`w-full flex flex-col mt-6`}>
      <div
        className={`w-full max-w-264 h-14.5 rounded-[0.625rem] px-4 flex justify-between items-center cursor-pointer bg-[var(--bg)]`}
        style={{"--bg" : `${bgColor}`}}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <span
            className={`transition-transform duration-400 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <ArrowDown2 color="var(--color-white)" size={32} />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-heading-h5 text-white">{title}</span>
        </div>
      </div>
      <div
        className={`transition-all duration-600 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'} px-10`}
      >
        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DropdownSection;