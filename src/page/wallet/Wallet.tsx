import React from "react";
import banner from "../../assets/wallet/banner.jpg";
import banne2 from "../../assets/wallet/banne2.png";
import Header from "./Header";
import Balance from "./comp/Balance";
// import Tabs from "./comp/Tabs";
import Transit from "./comp/Transit";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Fixed Background */}
      <div
        className=" absolute left-0 top-0 w-full h-[400px] h-scree bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${banne2})` }}
      ></div>

      {/* Content */}
      <div className="relative flex justify-center items-center">
        <div className="relative w-screen xl:w-[800px] min-h-screen">
          <div className="relative backdrop-brightness-[0.8] backdrop-blur min-h-screen">
            {/* <Header lv={false} title="钱包" /> */}
            <div className=" flex px-[20px] relative pt-[10px]">
              <div className=" flex w-full justify-center items-center  py-[12px] bg-[#]">
                <ChevronLeft
                  className=" absolute left-[20px] z-[11]"
                  onClick={() => navigate(-1)}
                />
                <h1
                  className={` col-span-1 text-start text-white text-[18px] font-[500]`}
                >
                  钱包
                </h1>
              </div>
            </div>
            <Balance />
            <Transit />
          <h1 className="px-[30px]  pb-[20px] text-[#888] text-center text-[14px] font-[400] leading-[20px]">
            提示：金币用于赠送创作者支持供将来的内容使用
          </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
