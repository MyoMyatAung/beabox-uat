import { ChevronRight, EarthLock } from "lucide-react";

const Privacy = () => {
  return (
    <div className="bg-[#FFFFFF0A] flex justify-between items-center p-3 rounded-[16px] mx-5">
      <div className="flex items-center gap-2">
        <EarthLock size={18} />
        <p className="text-[14px]">Who can see your post</p>
      </div>
      <div className="flex items-center gap-1 text-[#777]">
        <p className="text-[14px] ">Public</p>
        <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default Privacy;
