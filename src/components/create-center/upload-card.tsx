import { Link } from "react-router-dom";

const UploadCard = ({ item }: any) => {
  return (
    <Link
      to={`/video-detail/${item?.post_id}`}
      className="grid grid-cols-2 items-center"
    >
      <img
        src={item?.preview_image}
        className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
        alt=""
      />
      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#888] truncate">{item?.title}</p>
        <div className="flex justify-between items-center">
          <button className="bg-[#00FFC31F] text-[#00FFC3] rounded-full px-2 py-1">
            {item?.status}
          </button>
          <p className="text-[10px] text-[#bbb]">{item?.time_ago}</p>
        </div>
      </div>
    </Link>
  );
};

export default UploadCard;
