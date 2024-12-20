import { FaPlus } from "react-icons/fa";

const Upload = () => {
  return (
    <div className="bg-gradient-to-r from-[#A385FF1F] to-[#FFFFFF1F] h-[153px] rounded flex justify-center items-center">
      <div>
        <label>
          <input className="hidden" type="file" name="file" id="" />
          <div className="flex flex-col items-center gap-2">
            <div className="bg-[#FFFFFF14] w-[33px] h-[33px] flex justify-center items-center rounded-full">
              <FaPlus size={12} />
            </div>
            <p className="text-[#65626B] text-[10px]">Upload Vidoe</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Upload;
