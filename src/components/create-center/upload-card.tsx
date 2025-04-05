import { Link } from "react-router-dom";
import UploadImg from "./upload-img";

const UploadCard = ({ item, config, imgdomain }: any) => {
  let color = config?.find((el: any) => el?.keyword == item?.status);
  let bgcolor = color?.bg_color_code;
  let textcolor = color?.text_color_code;
  // console.log(config);
  const filterStatus = config?.find(
    (data: any) => data?.keyword == item?.status
  );
  const imageurl = item?.files[0]?.image_url;
  // console.log(item?.files[0]?.image_url, "item card");

  return (
    <div className="grid grid-cols-2 items-center">
      {item?.preview_image?.endsWith(".txt") ? (
        <UploadImg imgsrc={item?.preview_image} />
      ) : (
        <img
          src={`${imageurl}/${item?.preview_image}`}
          className="w-[128px] border border-gray-800 h-[80px] object-cover object-center rounded-[8px]"
          alt=""
        />
      )}

      <div className="flex flex-col gap-4">
        <p className="text-[14px] text-[#888] truncate">{item?.title}</p>
        <div className="flex justify-between items-center">
          <button
            style={{
              color: textcolor,
              background: bgcolor,
            }}
            className={`rounded-full px-2 py-1 capitalize`}
          >
            {filterStatus?.title}
          </button>
          <p className="text-[10px] text-[#bbb]">{item?.time_ago}</p>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
