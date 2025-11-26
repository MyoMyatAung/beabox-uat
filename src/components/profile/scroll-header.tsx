import { paths } from "@/routes/paths";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import SettingBtn from "./setting-btn";
import { Person } from "@/assets/profile";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";

interface ScrollHeaderProps {
  photo: string;
  name: string;
  setShow: (show: boolean) => void;
}

const ScrollHeader = ({
  photo,
  name,
  setShow,
}: ScrollHeaderProps) => {
  const user = useSelector((state: any) => state.persist.user);
  const notiData = JSON.parse(localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY) || "{}");

  const { data: systemNoti, isLoading: isSystemNotiLoading } = useGetNotiQuery("system");
  const { data: creatorNoti, isLoading: isCreatorNotiLoading } = useGetNotiQuery("creator");
  const { data: balanceAlertNoti, isLoading: isBalanceAlertNotiLoading } = useGetNotiQuery("balance_alert");

  const isSystemNotiRead = !isSystemNotiLoading && systemNoti?.data?.length > 0 ? systemNoti.data.every((noti: any) => noti.is_read) : true;
  const isCreatorNotiRead = !isCreatorNotiLoading && creatorNoti?.data?.length > 0 ? creatorNoti.data.every((noti: any) => noti.is_read) : true;
  const isBalanceAlertNotiRead = !isBalanceAlertNotiLoading && balanceAlertNoti?.data?.length > 0 ? balanceAlertNoti.data.every((noti: any) => noti.is_read) : true;
  const isAllNotiRead = isSystemNotiRead && isCreatorNotiRead && isBalanceAlertNotiRead;

  const isShowRedDot = user?.token ? !isAllNotiRead : !notiData?.isReadForUnauthenticatedSystem || !notiData?.isReadForUnauthenticatedCreator || !notiData?.isReadForUnauthenticatedBalance;
  return (
    <div className="flex justify-between items-center w-full z-[1800] relative">
      <div className="flex items-center gap-3">
        {photo ? (
          <AsyncDecryptedImage
            imageUrl={photo}
            className="w-[48px] z-[1500] h-[48px] rounded-full object-cover object-center"
            alt="Profile"
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
            <Person />
          </div>
        )}

        <p className="z-[1500]">{name}</p>
      </div>
      <div className="flex gap-3 z-[1500] items-center">
        <Link
          to={paths.noti}
          className="relative z-[1200] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          {isShowRedDot && (
            <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#FF0004]"></div>
          )}
          <Bell />
        </Link>
        <SettingBtn setShow={setShow} />
      </div>
    </div>
  );
};

export default ScrollHeader;
