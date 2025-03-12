import React from "react";
import Upload from "../profile/upload";
import { FaPlus } from "react-icons/fa";
import { Image } from "lucide-react";

const UploadVideo = () => {
  return (
    <div className="grid grid-cols-2 mx-5 gap-5 my-5">
      <div className="bg-gradient-to-r from-[#A385FF1F] to-[#FFFFFF1F] h-[120px] rounded flex justify-center items-center relative">
        <img
          src="https://i.pinimg.com/236x/9e/21/11/9e211145e18c20159145b584738a8e2d.jpg"
          className="w-full h-full p-1 object-cover object-center rounded blur-[2px]"
          alt=""
        />
        <button className="absolute bg-[#00000066] text-[10px] w-[59px] h-[32px] flex justify-center items-center rounded-full px-2">
          Remove
        </button>
      </div>
      <div className="bg-gradient-to-r from-[#A385FF1F] to-[#FFFFFF1F] h-[120px] rounded flex justify-center items-center">
        <div>
          <label>
            <input className="hidden" type="file" name="file" id="" />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#FFFFFF14] w-[33px] h-[33px] flex justify-center items-center rounded-full">
                <Image size={12} />
              </div>
              <p className="text-[#65626B] text-[10px]">Upload Image</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
