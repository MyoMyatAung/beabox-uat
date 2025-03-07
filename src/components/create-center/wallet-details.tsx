import React from "react";
import Divider from "./divider";

const WalletDetails = () => {
  return (
    <section className="bg-[#24222C] p-5 rounded-[20px] mx-5 my-5">
      <div className="flex justify-around items-center">
        <div className=" flex flex-col items-center justify-center">
          <p className="text-[18px]">12</p>
          <p className="text-[12px] text-[#888888]">Pending</p>
        </div>
        <Divider />
        <div className=" flex flex-col items-center justify-center">
          <p className="text-[18px]">12</p>
          <p className="text-[12px] text-[#888888]">Rejected</p>
        </div>
      </div>
      <button className="text-[14px] rounded-[12px] bg-[#FFFFFF1F] text-center w-full py-3 mt-5">
        View Details In Wallet
      </button>
    </section>
  );
};

export default WalletDetails;
