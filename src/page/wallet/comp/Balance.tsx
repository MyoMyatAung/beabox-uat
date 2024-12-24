import React, { useEffect, useState } from "react";
import "../wallet.css";
import coin from "../../../assets/wallet/coin.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
interface BalanceProps {}

const Balance: React.FC<BalanceProps> = ({}) => {
    const [balance,SetBalance] = useState("")
    const { data } = useGetMyProfileQuery("");

    useEffect(() => {
        SetBalance(data?.data.wallet_balance)
    },[data])


  return (
    <div className=" p-[20px]">
      <div className="balance_box p-[22px] flex flex-col gap-[12px]">
        {/* head */}
        <div className=" flex justify-cente items-center gap-[6px]">
          <img className=" w-[18px] h-[18px]" src={coin} alt="" />
          <span className=" text-white text-[14px] font-[500] leading-[20px]">
            Balance
          </span>
          <FaRegEye />
          {/* <FaRegEyeSlash /> */}
        </div>
        <div className="">
            <span className=" text-white text-[32px] font-[500] leading-[20px]">{balance ? balance : "0"} </span>
        </div>
      </div>
    </div>
  );
};

export default Balance;
