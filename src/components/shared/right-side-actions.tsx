import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHeart } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { RiShareForwardFill } from "react-icons/ri";

const RightSideActions = () => {
  return (
    <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center relative mb-4">
        <Avatar className="w-[40.25px] h-[40.25px] border-2 border-white ">
          <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <button className="flex justify-center items-center absolute -bottom-2">
          <span className="bg-red-500 py-[1.5px] px-1.5 rounded-full text-xs">+</span>
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button className="rounded-full">
          <FaHeart className="w-[27px] h-[25px]" />
        </button>
        <span className="text-[11px]">1.3M</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button className="rounded-full">
          <AiFillMessage className="w-[27px] h-[25px]" />
        </button>
        <span className="text-[11px]">1.3M</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button className="rounded-full">
          <RiShareForwardFill className="w-[27px] h-[25px]" />
        </button>
        <span className="text-[11px]">Share</span>
      </div>
    </div>
  );
};

export default RightSideActions;
