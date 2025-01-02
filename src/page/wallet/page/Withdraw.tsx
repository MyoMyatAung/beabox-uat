import React, { useState } from "react";
import BalNew from "./BalNew";
import { useNavigate } from "react-router-dom";
import loader from "../../home/vod_loader.gif";
import { useGetCoinListQuery, useGetPaymentMethodQuery } from "@/store/api/wallet/walletApi";
import { paths } from "@/routes/paths";
import { ChevronLeft } from "lucide-react";
import RechRecord from "./RechRecord";
import WithDetails from "./WithDetails";

interface WithdrawProps {}

const Withdraw: React.FC<WithdrawProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(1);
  const { data: paymentMeth, isLoading } = useGetPaymentMethodQuery("");
  const navigate = useNavigate();
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
                钱包充值
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
            <BalNew title="可提取金额" amount={0} to={paths.wallet_recharge} />
            {isLoading ? (
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
                <WithDetails payment={paymentMeth?.data} />
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

export default Withdraw;
