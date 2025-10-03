import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { paths } from "@/routes/paths";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";

const NotiButton = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.persist.user);
  const notiData = JSON.parse(localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY) || "{}");

  const { data: systemNoti, isLoading: isSystemNotiLoading } = useGetNotiQuery("system");
  const { data: creatorNoti, isLoading: isCreatorNotiLoading } = useGetNotiQuery("creator");
  const { data: balanceAlertNoti, isLoading: isBalanceAlertNotiLoading } = useGetNotiQuery("balance_alert");

  const isSystemNotiRead = !isSystemNotiLoading && systemNoti.data.length > 0 ? systemNoti.data.every((noti: any) => noti.is_read) : true;
  const isCreatorNotiRead = !isCreatorNotiLoading && creatorNoti.data.length > 0 ? creatorNoti.data.every((noti: any) => noti.is_read) : true;
  const isBalanceAlertNotiRead = !isBalanceAlertNotiLoading && balanceAlertNoti.data.length > 0 ? balanceAlertNoti.data.every((noti: any) => noti.is_read) : true;
  const isAllNotiRead = isSystemNotiRead && isCreatorNotiRead && isBalanceAlertNotiRead;

  const isShowRedDot = user?.token ? !isAllNotiRead : !notiData?.isReadForUnauthenticated;

  const bellHandeler = () => {
    navigate(paths.noti);
  };
  return (
    <button
      onClick={bellHandeler}
      className="relative z-[1900] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
    >
      {(isShowRedDot) && (
        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#FF0004]"></div>
      )}
      <Bell />
    </button>
  );
};

export default NotiButton;
