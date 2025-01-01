import { useGetMyProfileQuery } from "@/store/api/profileApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transit from "../../../assets/wallet/transit.png";

import "../wallet.css";
import { ChevronRight } from "lucide-react";

interface BalNewProps {
  title: string;
  to: string;
  amount: any;
}

const BalNew: React.FC<BalNewProps> = ({ title, to }) => {
  const [balance, setBalance] = useState("");
  const { data } = useGetMyProfileQuery("");
  const navigate = useNavigate();
  useEffect(() => {
    setBalance(data?.data.wallet_balance || "0");
  }, [data]);
  return (
    <div className=" py-[20px]">
      <div className=" flex justify-betwee new_bal_box p-[20px] -[10px] relative">
        <div className=" bg-white/  rounded-[20px flex flex-col gap-[12px]">
          {/* head */}
          <div className="flex justify-cente items-center gap-[6px]">
            <span className="text-white text-[14px] font-[500] leading-[20px] flex gap-[6px]">
              <img className=" w-[18px] h-[18px]" src={transit} alt="" />
              {title}
            </span>
            {/* Toggle between icons */}
          </div>
          <div className="">
            {/* Show balance or asterisks */}
            <span className="text-white text-[24px] font-[500] leading-[20px]">
              {balance} <span className=" text-[12px]">. 00</span>
            </span>
          </div>
          <div className="">
            <h1 className=" text-white text-[12px] font-[700] leading-[22px]">
              Withdrawable amount :{" "}
              <span className=" text-[#CD3EFF]">748.00</span> coins
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate(to)}
          className=" absolute z-[3] right-[20px] top-[40px] flex justify-center h-fit items-center rounded-[10px] bg-white/20 py-[4px] px-[8px]"
        >
          <span className=" text-[white] text-[12px] font-[500]">钱包提款</span>

          <ChevronRight width={18} height={18} />
        </button>
      </div>
    </div>
  );
};

export default BalNew;
