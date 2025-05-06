import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BalNew from "./BalNew";
import { paths } from "@/routes/paths";
import RechDetails from "./RechDetails";
import loader from "../../home/vod_loader.gif";
import {
  useGetCoinListQuery,
  useGetPaymentMethodQuery,
} from "@/store/api/wallet/walletApi";
import RechRecord from "./RechRecord";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";

interface RechargeProps {}

const Recharge: React.FC<RechargeProps> = () => {
  const { data: coinList, isLoading: coinLoading } = useGetCoinListQuery("");
  const { data: paymentMeth, isLoading } = useGetPaymentMethodQuery("");
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, refetch } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data);

  return (
    <div className=" flex justify-center items-center">
      <div className="p-[20px]  w-screen xl:w-[800px]">
        {/* header */}
        <div className="grid grid-cols-4 items-center">
          <ChevronLeft onClick={() => navigate(-1)} />
          <div className="col-span-3 flex gap-[32px]">
            <div
              className="flex flex-col justify-center items-center gap-[5px] cursor-pointer"
              onClick={() => setActiveTab(1)}
            >
              <span className="text-[#fff] text-[18px] font-[500]">
                钱包充值
              </span>
              {activeTab === 1 ? (
                <span
                  className={`w-[24px] h-[3px] rounded-[2px] bg-white`}
                ></span>
              ) : (
                <span className="h-[3px]"></span>
              )}
            </div>
            <div
              className="flex flex-col justify-center items-center gap-[5px] cursor-pointer"
              onClick={() => setActiveTab(2)}
            >
              <span className="text-[#fff] text-[18px] font-[500]">
                {/* record */}
                提现记录
              </span>
              {activeTab === 2 ? (
                <span
                  className={`w-[24px] h-[3px] rounded-[2px] bg-white`}
                ></span>
              ) : (
                <span className="h-[3px]"></span>
              )}
            </div>
          </div>
        </div>
        {/* balace */}
        {activeTab === 1 ? (
          <div className="">
            <BalNew
              amount={data?.data?.income_coins}
              title="可提现余额"
              balance={data?.data?.coins}
              to={paths.wallet_withdraw}
              btnText={"钱包提款"}
              amountText={"作品收益"}
              amountType={"B币"}
            />
            {coinLoading ? (
              <div className=" flex justify-center items-center py-[100px]">
                <div className="heart">
                  <img
                    src={loader}
                    className="w-[100px] h-[100px]"
                    alt="Loading"
                  />
                </div>
              </div>
            ) : (
              <div className="">
                <RechDetails paymentMeth={paymentMeth} coin={coinList?.data} />
              </div>
            )}
          </div>
        ) : (
          <div className="">
            <RechRecord />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharge;
