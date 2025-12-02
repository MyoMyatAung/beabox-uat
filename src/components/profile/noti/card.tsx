import Balance from "@/assets/profile/balance1.png";
import System from "@/assets/profile/system1.png";
import Creator from "@/assets/profile/Wallet.png";
import { useReadNotiMutation } from "@/store/api/profileApi";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";

const Card = ({ type, item }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [readNoti] = useReadNotiMutation();

  const src =
    (type == "balance" && Balance) ||
    (type == "system" && System) ||
    (type == "creator" && Creator);
  const jumpLabel =
    (type == "balance" && "钱包首页") ||
    (type == "system" && "进入首页") ||
    (type == "creator" && "进入创作者中心");

  const jumpPath =
    (type == "balance" && paths.wallet) ||
    (type == "system" && paths.home) ||
    (type == "creator" && paths.create_center) ||
    paths.home;

  const jumpState =
    (type == "balance" && { from: paths.balance_noti }) ||
    (type == "creator" && { from: paths.creator_noti }) ||
    undefined;

  const handleExpandAndRead = () => {
    if (!item.is_read) {
      readNoti({ id: item.id });
    }
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  return (
    <div className="bg-[#1E1C28] p-3 rounded-[12px]">
      <div className="flex gap-2 items-center">
        <img src={src || System} className="w-10 h-10 rounded-full" alt="" />
        <p className="text-[14px]">{item?.title}</p>
        {item?.is_read ? (
          <></>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#FF0004]"></div>
        )}
      </div>
      <div className="mt-3">
        <p
          className={`text-[14px] ${
            item.is_read ? "text-[#888]" : "text-white"
          } leading-4 ${!isExpanded && "line-clamp-2"}`}
        >
          {item?.message}{" "}
          <span onClick={handleCollapse} className="text-[14px] text-[#888]">
            ...隐藏
          </span>
        </p>
        {!isExpanded && item?.message?.length > 60 ? (
          <button
            onClick={handleExpandAndRead}
            className="text-[14px] text-[#888]"
          >
            ...查看更多
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full h-[1px] bg-[#444] my-3"></div>
      {/* <div className="flex items-center justify-between">
        <p className="text-[14px]">进入首页</p>
        <ChevronRight size={14} />
      </div> */}
      <Link
        to={jumpPath}
        state={jumpState}
        className="flex items-center justify-between"
      >
        <p className="text-[14px]">{jumpLabel}</p>
        <ChevronRight size={14} />
      </Link>
    </div>
  );
};

export default Card;
