import Button from "../../components/Button";
import PhaseItem from "./PhaseItem";
import { Add } from "iconsax-react";

const PhaseList = ({ phases }) => {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">فازها</h2>
        <Button
          rightIcon={false}
          buttonText={"کلاس جدید"}
          className="w-29 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
          leftIconComponent={<Add size="20" variant="Linear" />}
        />
      </div>
      {phases.map((title, index) => (
        <PhaseItem key={index} title={title} />
      ))}
    </div>
  );
};


export default PhaseList;
