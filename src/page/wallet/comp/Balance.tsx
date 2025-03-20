import React, { useEffect, useState } from "react";
import "../wallet.css";
import coin from "../../../assets/wallet/coin.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  useGetMyOwnProfileQuery,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import gg from "../../../assets/wallet/gg.svg";
import we from "../../../assets/wallet/we.svg";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";
import balc from "../../../assets/wallet/balc.png";

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = () => {
  const [balance, setBalance] = useState("");
  const [isHidden, setIsHidden] = useState(false); // State to toggle visibility
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, isLoading, refetch } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data);
  const navigate = useNavigate();
  useEffect(() => {
    setBalance(data?.data.coins || "0");
  }, [data]);

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  // console.log(user);

  return (
    <div className="p-[20px]">
      <div className="balance_box p-[22px] flex flex-col gap-[12px]">
        {/* head */}
        {/* <img src={balc} alt="" /> */}
        <div className="flex justify-cente items-center gap-[6px]">
          <img className="w-[18px] h-[18px]" src={coin} alt="" />
          <span className="text-white text-[14px] font-[500] leading-[20px]">
            可用余额
          </span>
          {/* Toggle between icons */}
          {isHidden ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={toggleVisibility}
            />
          ) : (
            <FaRegEye className="cursor-pointer" onClick={toggleVisibility} />
          )}
        </div>
        <div className="">
          {/* Show balance or asterisks */}
          <span className="text-white text-[32px] font-[500] leading-[20px]">
            {isHidden ? "****" : `${balance}`}

            {!isHidden && <span className=" text-[12px]">. 00</span>}
          </span>
        </div>
        <div className="">
          <h1 className=" text-white text-[12px] font-[700] leading-[22px]">
            总收入 :{" "}
            <span className=" text-[#CD3EFF]">
              {data?.data?.income_coins ? data?.data?.income_coins : "0"}
            </span>{" "}
            B币
          </h1>
        </div>
        {/* <p className=" w-full h-[1px] bg-white/20"></p> */}
        <div className=" flex justify-between items-center">
          <div
            onClick={() => navigate(paths.wallet_income)}
            className=" w-1/2 flex justify-between items-center income_box"
          >
            <div className=" flex justify-center items-center gap-[6px]">
              {/* <img src={we} alt="" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="23"
                viewBox="0 0 28 23"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23.8447 0.950571C23.9939 0.782753 24.2561 0.782752 24.4053 0.950571L27.5702 4.51112C27.7852 4.75296 27.6135 5.13526 27.2899 5.13526H25.625V9.26026C25.625 9.46736 25.4571 9.63526 25.25 9.63526H23C22.7929 9.63526 22.625 9.46736 22.625 9.26026V5.13526H20.9601C20.6365 5.13526 20.4648 4.75296 20.6798 4.51112L23.8447 0.950571ZM10.1562 1.70313C7.463 1.70313 4.879 2.77343 2.9745 4.67763C1.0702 6.58193 0 9.16588 0 11.8594C0 14.5529 1.0703 17.1366 2.9745 19.0411C4.8788 20.9454 7.46275 22.0156 10.1562 22.0156C12.8498 22.0156 15.4335 20.9453 17.338 19.0411C19.2423 17.1368 20.3125 14.5529 20.3125 11.8594C20.3096 9.16688 19.2392 6.58488 17.335 4.68063C15.4307 2.77633 12.8488 1.70613 10.1562 1.70313ZM10.1562 20.4531C7.87695 20.4531 5.6915 19.5479 4.079 17.9366C2.46767 16.3243 1.5625 14.1389 1.5625 11.8594C1.5625 9.57988 2.46777 7.39463 4.079 5.78213C5.6913 4.1708 7.87675 3.26563 10.1562 3.26563C12.4358 3.26563 14.621 4.1709 16.2335 5.78213C17.8448 7.39443 18.75 9.57988 18.75 11.8594C18.7471 14.1377 17.8408 16.3224 16.2295 17.9326C14.6192 19.544 12.4345 20.4501 10.1562 20.4531ZM8.58112 5.7889C8.89176 5.78757 9.14466 6.03832 9.14598 6.34895L9.14839 6.91171L10.2736 6.9069L10.2714 6.34409C10.2701 6.03345 10.5209 5.78063 10.8316 5.7794C11.1422 5.77816 11.395 6.02898 11.3963 6.33962L11.3987 6.94944C11.985 7.04935 12.4693 7.3109 12.8292 7.68555C13.2915 8.16673 13.5166 8.80098 13.5193 9.42394C13.5219 10.0469 13.3023 10.683 12.8442 11.1681C12.7672 11.2497 12.6843 11.3261 12.5958 11.3967C12.6847 11.4665 12.768 11.542 12.8456 11.6228C13.3078 12.104 13.5328 12.7383 13.5354 13.3612C13.538 13.9842 13.3184 14.6203 12.8603 15.1054C12.5038 15.483 12.0221 15.7486 11.4371 15.8537L11.4401 16.4634C11.4417 16.7741 11.1911 17.0271 10.8805 17.0287C10.5698 17.0302 10.3168 16.7796 10.3152 16.469L10.3124 15.9061L9.18688 15.9108L9.18929 16.4734C9.19061 16.7841 8.93987 17.037 8.62924 17.0383C8.3186 17.0396 8.06571 16.7889 8.06438 16.4782L8.06197 15.9155L7.50074 15.9179C7.19011 15.9192 6.93723 15.6685 6.93592 15.3578C6.93461 15.0472 7.18536 14.7943 7.496 14.793L8.05716 14.7906L8.02829 8.04143L7.46643 8.04383C7.15579 8.04516 6.90289 7.79442 6.90157 7.48378C6.90024 7.17315 7.15098 6.92025 7.46162 6.91892L8.02348 6.91652L8.02108 6.35376C8.01975 6.04313 8.27049 5.79023 8.58112 5.7889ZM9.1532 8.03662L9.16523 10.8488L10.8535 10.8413H10.8536C11.4171 10.8389 11.7915 10.6444 12.0264 10.3958C12.2682 10.1397 12.3959 9.79008 12.3944 9.42876C12.3928 9.06745 12.2621 8.71892 12.0181 8.46492C11.7824 8.21961 11.409 8.029 10.8504 8.02938L10.8405 8.0295L10.8301 8.02945L9.1532 8.03662ZM9.17004 11.9737L9.18207 14.7859L10.8696 14.7788H10.8697C11.4331 14.7763 11.8076 14.5817 12.0424 14.3331C12.2843 14.0769 12.412 13.7273 12.4105 13.366C12.409 13.0046 12.2783 12.6561 12.0343 12.402C11.7973 12.1553 11.4212 11.9639 10.8577 11.9663L10.8474 11.9662L9.17004 11.9737Z"
                  fill="white"
                />
              </svg>
              <span className=" text-white text-[14px] font-[400] leading-[15px]">
                收入
              </span>
            </div>
            <ChevronRight className=" mr-" />
          </div>
          <p className=" w-[1px] h-[30px] mx-2"></p>
          <div
            // onClick={() => navigate(paths.wallet_recharge)}
            onClick={() => navigate(paths.wallet_withdraw)}
            className=" w-1/2 flex justify-between items-center income_box"
          >
            <div className=" flex justify-center items-center gap-[6px]">
              <img src={we} alt="" />
              <span className=" text-white text-[14px] font-[400] leading-[15px]">
                提现
              </span>
            </div>
            <ChevronRight className=" mr-" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
