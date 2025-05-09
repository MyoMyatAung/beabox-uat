import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link, useLocation } from "react-router-dom";
import Card from "@/components/profile/noti/card";
import balancebell from "@/assets/profile/balancebell.png";
const BalanceNoti = () => {
  const state = useLocation();
  console.log(state?.state?.data, "state");
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C] z-50">
          <Link to={paths.noti}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">余额提醒</p>
          <div className="px-2"></div>
        </div>
        <div className="space-y-5 pb-10">
          {state?.state?.data?.length ? (
            state?.state?.data?.map((item: any) => (
              <Card item={item} type="balance" />
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center h-[80vh]">
              <img src={balancebell} className="w-10" alt="" />
              <p className="text-[14px] mt-2">目前没有新的通知</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceNoti;
