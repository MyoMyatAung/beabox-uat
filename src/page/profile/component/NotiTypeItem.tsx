import { useGetNotiQuery } from "@/store/api/profileApi";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  message: string;
  src: string;
  type: string;
  path: string;
};

const NotiTypeItem = ({ title, message, src, type, path }: Props) => {
  const { data, isLoading } = useGetNotiQuery(type);

  const isNotiRead =
    !isLoading && data?.data.length > 0
      ? data.data.every((noti: any) => noti.is_read)
      : true;

  return (
    <Link to={`/notifications/${path}`} className="flex justify-between">
      <div className="flex items-center gap-4">
        <img src={src} className="w-10 h-10 mt-1" alt="" />
        <div className="w-full">
          <div className="flex items-center text-[14px] justify-between font-bold">
            <p>{title}</p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[12px] w-[80%] text-[#888]">{message}</p>
            <p className="text-[10px] text-[#888]"></p>
          </div>
        </div>
      </div>
      {!isNotiRead && (
        <div className="w-2 h-2 rounded-full bg-[#FF0004] mt-2"></div>
      )}
    </Link>
  );
};

export default NotiTypeItem;
