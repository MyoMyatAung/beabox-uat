import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import Divider from "@/components/shared/divider";
import System from "@/assets/profile/system1.png";
import Balance from "@/assets/profile/balance1.png";
import Creator from "@/assets/profile/Wallet.png";
import NotiTypeItem from "../component/NotiTypeItem";
import { useGetNotiQuery } from "@/store/api/profileApi";
import loader from "@/page/home/vod_loader.gif";

const Noti = () => {
  const { isLoading: isSystemLoading } = useGetNotiQuery("system", {
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: isBalanceLoading } = useGetNotiQuery("balance_alert", {
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: isCreatorLoading } = useGetNotiQuery("creator", {
    refetchOnMountOrArgChange: true,
  });

  const isLoading = isSystemLoading || isBalanceLoading || isCreatorLoading;

  return (
    <div className="w-full h-screen bg-[#16131C] px-5 flex flex-col items-center justify-between no-scrollbar relative">
      {isLoading && (
        <div className="fixed inset-0 w-full h-full bg-black flex justify-center items-center z-50">
          <div className="bg-[#000000E5] p-1 rounded">
            <img src={loader} alt="Loading" className="w-14" />
          </div>
        </div>
      )}
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C00] z-50">
          <Link to={paths.profile}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[18px] font-bold">通知</p>
          <div className="px-3"></div>
        </div>
        <div className="space-y-4 pb-10">
          <NotiTypeItem
            title="系统通知"
            message="在此查看您的系统通知"
            src={System}
            type="system"
            path="system"
          />
          <Divider show={true} />
          <NotiTypeItem
            title="余额提醒"
            message="在此查看您的余额提醒"
            src={Balance}
            type="balance_alert"
            path="balance"
          />
          <Divider show={true} />
          <NotiTypeItem
            title="创作者里程碑提醒"
            message="在此查看您作为创作者的成就"
            src={Creator}
            type="creator"
            path="creator"
          />
        </div>
      </div>
    </div>
  );
};

export default Noti;
