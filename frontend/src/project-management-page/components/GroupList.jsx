import Button from "../../components/Button";
import GroupItem from "./GroupItem";
import { Add } from "iconsax-react";

const GroupList = ({ groups }) => {
  return (
    <div className="w-full max-w-md p-4 rounded-xl shadow-sm bg-[#0c1e33]/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-bg-blue">گروه‌ها</h2>
        <Button
          leftIcon={false}
          textShow={false}
          className="w-4 border border-blue-300 rounded-full p-2 hover:bg-blue-100 transition"
          rightIconComponent={<Add size="20" variant="Linear" />}
        />
      </div>

      {groups.map((name, index) => (
        <GroupItem key={index} name={name} />
      ))}
    </div>
  );
};

export default GroupList;
