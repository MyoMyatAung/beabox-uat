import { Link } from "react-router-dom";
import UploadImg from "./upload-img";

const UploadCard = ({ item, config, imgdomain }: any) => {
  let color = config?.filter((el: any) => el?.keyword == item?.status);
  let bgcolor = color && color[0]?.bg_color_code;
  let textcolor = color && color[0]?.text_color_code;
  // console.log(`${imgdomain}/${item?.preview_image}`);
  return (
    <div
      // to={`/video-detail/${item?.post_id}`}
      className="grid grid-cols-2 items-center"
    >
      {item?.preview_image?.endsWith(".txt") ? (
        <UploadImg imgsrc={item?.preview_image} />
      ) : (
        <img
          src={`${imgdomain}/${item?.preview_image}`}
          className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
          alt=""
        />
      )}

      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#888] truncate">{item?.title}</p>
        <div className="flex justify-between items-center">
          <button
            className={`bg-[${bgcolor}] text-[${textcolor}] rounded-full px-2 py-1 capitalize`}
          >
            {item?.status}
          </button>
          <p className="text-[10px] text-[#bbb]">{item?.time_ago}</p>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
