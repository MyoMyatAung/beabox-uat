import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  message: string;
  src: string;
  type: string;
  path: string;
};

const formatRelativeTime = (timestamp?: string) => {
  if (!timestamp) return "";
  const value = new Date(timestamp).getTime();
  if (Number.isNaN(value)) return "";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - value) / 1000));
  if (diffSeconds < 60) {
    const seconds = Math.max(diffSeconds, 1);
    return `${seconds}秒前`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}小时前`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}天前`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}周前`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}个月前`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}年前`;
};

const NotiTypeItem = ({ title, message, src, type, path }: Props) => {
  const { data, isLoading } = useGetNotiQuery(type, {
    refetchOnMountOrArgChange: true,
  });
  const notiData = JSON.parse(
    localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY) || "{}"
  );
  const user = useSelector((state: any) => state.persist.user);

  const latestNotiMessage =
    (!isLoading && data?.data?.[0]?.message) || message || "";
  const latestNotiTime = !isLoading
    ? formatRelativeTime(data?.data?.[0]?.created_at)
    : "";

  let isNotiRead = true;
  if (!user?.token) {
    if (type === "system") {
      isNotiRead = notiData?.isReadForUnauthenticatedSystem;
    } else if (type === "creator") {
      isNotiRead = notiData?.isReadForUnauthenticatedCreator;
    } else if (type === "balance_alert") {
      isNotiRead = notiData?.isReadForUnauthenticatedBalance;
    }
  } else {
    isNotiRead =
      !isLoading && data?.data.length > 0
        ? data.data.every((noti: any) => noti.is_read)
        : true;
  }

  return (
    <Link to={`/notifications/${path}`} className="flex justify-between">
      <div className="flex items-center gap-4 w-full">
        <img src={src} className="w-10 h-10 mt-1" alt="" />
        <div className="w-full">
          <div className="flex items-center text-[14px] justify-between font-bold">
            <p>{title}</p>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="text-[12px] w-[80%] text-[#888] line-clamp-2 leading-4">
              {latestNotiMessage || "目前没有新的通知"}
            </p>
            <p className="text-[10px] text-[#888] text-right flex-shrink-0">
              {latestNotiTime || ""}
            </p>
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
