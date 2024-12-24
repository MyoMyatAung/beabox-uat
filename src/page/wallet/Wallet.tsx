import React from "react";
import banner from "../../assets/wallet/banner.jpg";
import Header from "./Header";
import Balance from "./comp/Balance";
import Tabs from "./comp/Tabs";
import Transit from "./comp/Transit";

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  return (
    <div className=" flex justify-center items-center">
      <div className="relative w-screen xl:w-[800px]">
        {/* Background Image */}
        <img
          className="absolute left-0 right-0 top-0 w-full h-screen object-cover z-[-1]"
          src={banner}
          alt="Wallet Banner"
        />
        {/* Gradient Overlay */}
        <div className="absolute left-0 top-0 w-full h-screen z-[-1] bg-gradient-to-b from-black/10 via-black/100 to-black/100"></div>

        {/* Content */}
        <div className="relative backdrop-brightness-[0.8] backdrop:blur-xl">
          <Header lv={true} title="Wallet" />
          <Balance />
          <Tabs />
          <Transit />
        </div>
        <h1 className=" px-[30px] pb-[20px] text-[#888] text-[14px] font-[400] leading-[20px]">
          Tip: Gold coins are used for gifting creators to support them for
          future contents.
        </h1>
      </div>
    </div>
  );
};

export default Wallet;
