import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import System from "@/assets/profile/system1.png";
import Balance from "@/assets/profile/balance1.png";
import Creator from "@/assets/profile/Wallet.png";

import { dateForamtter } from "@/lib/utils";

const NotiDetail = () => {
  const state = useLocation();
  // console.log(state.state);
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-[#16131C] px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-[#16131C] z-50">
          <div onClick={() => navigate(-1)}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </div>
          <p className="text-[16px]">Details</p>
          <div></div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10"
              // src={state.state.data.type === "system" ? System : Balance}
              src={
                (state.state.data.type == "balance_alert" && Balance) ||
                (state.state.data.type == "system" && System) ||
                (state.state.data.type == "creator" && Creator)
              }
              alt=""
            />

            <div className="">
              <p className="text-[14px]">
                {(state.state.data.type == "balance_alert" && "余额提醒") ||
                  (state.state.data.type == "system" && "系统通知") ||
                  (state.state.data.type == "creator" && "创作者里程碑提醒")}
              </p>
              <p className="text-[#777777] text-[14px]">
                {dateForamtter(state.state.data.created_at)}
              </p>
            </div>
          </div>
          <div className="">
            <p className="text-[16px]">{state.state.data.title}</p>
            <p className="text-[#777777] text-[14px]">
              {state.state.data.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotiDetail;
