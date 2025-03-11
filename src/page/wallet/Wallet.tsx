import React from "react";
import banner from "../../assets/wallet/banner.jpg";
import Header from "./Header";
import Balance from "./comp/Balance";
// import Tabs from "./comp/Tabs";
import Transit from "./comp/Transit";

const Wallet: React.FC = () => {
  return (
    <>
      {/* Fixed Background */}
      <div
        className="fixed left-0 top-0 w-full h-screen bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${banner})` }}
      ></div>

      {/* Content */}
      <div className="relative flex justify-center items-center backdrop-blur-2xl bg-gradient-to-t from-black to-black/10">
        <div className="relative w-screen xl:w-[800px] min-h-screen">
          <div className="relative backdrop-brightness-[0.8] backdrop-blur-xl">
            <Header lv={false} title="钱包" />
            <Balance />
            <Transit />
          </div>
          <h1 className="px-[30px]  pb-[20px] text-[#888] text-center text-[14px] font-[400] leading-[20px]">
            提示：金币用于赠送创作者支持供将来的内容使用
          </h1>
        </div>
      </div>
    </>
  );
};

export default Wallet;
