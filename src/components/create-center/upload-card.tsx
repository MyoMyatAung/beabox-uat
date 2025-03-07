import { Link } from "react-router-dom";

const UploadCard = () => {
  return (
    <Link to={"/video-detail/1"} className="grid grid-cols-2 items-center">
      <img
        src="https://i.pinimg.com/236x/9e/21/11/9e211145e18c20159145b584738a8e2d.jpg"
        className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
        alt=""
      />
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#888] truncate">
          Spider man no way home, no more home, no no no no no no no{" "}
        </p>
        <div className="flex justify-between items-center">
          <button className="bg-[#00FFC31F] text-[#00FFC3] rounded-full px-2 py-1">
            Publishing
          </button>
          <p className="text-[10px] text-[#bbb]">12 hr ago</p>
        </div>
      </div>
    </Link>
  );
};

export default UploadCard;
