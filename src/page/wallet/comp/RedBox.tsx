import React, { useEffect, useRef } from "react";
import "../wallet.css";
import invite from "../invite.png";
import { useNavigate } from "react-router-dom";

interface RedBoxProps {
  setShowBox: any;
}

const RedBox: React.FC<RedBoxProps> = ({ setShowBox }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowBox(false); // close popup if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowBox]);

  return (
    <div className="h-screen bg-black/60 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 left-0 z-[9999]">
      <div
        ref={boxRef}
        className="w-[340px] red_popup_box flex flex-col gap-0 justify-center items-center p-[16px]"
      >
        {/* header */}
        <div className=" flex w-full justify-between items-center py-[16px]">
          <div className=""></div>
          <h1 className="red_popup_box_head">我要赚钱</h1>
          <div onClick={() => setShowBox(false)} className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
            >
              <path
                d="M6 5.16688L10.6669 0.5L12 1.83312L7.33312 6.5L12 11.1669L10.6669 12.5L6 7.83312L1.33312 12.5L0 11.1669L4.66688 6.5L0 1.83312L1.33312 0.5L6 5.16688Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </div>
        </div>
        <p className=" text-white text-[16px] pb-4 font-[500]">
          继续赚取奖励，您可以上传作品或邀请朋友！
        </p>
        <div className=" flex flex-col justify-center items-center gap-[12px] w-full">
          {/* invite */}
          <div onClick={() => navigate("/wallet/invite")} className=" w-full flex justify-between items-center p-[16px] red_popup_box_list">
            {/* content */}
            <div className=" flex gap-[12px] justify-center items-center">
              <img className=" w-[36px] h-[36px]" src={invite} alt="" />
              <div className=" flex flex-col gap-[8px]">
                <span className=" text-white text-[14px] font-[500]">
                  邀请好友{" "}
                  <span className="recommand_span px-[6px] py-[1px]">推荐</span>{" "}
                </span>
                <span className=" text-white/80 text-[12px]">
                  邀请好友，瓜分百万现金红包
                </span>
              </div>
            </div>
            {/* icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="15"
              viewBox="0 0 8 15"
              fill="none"
            >
              <path
                d="M5.09133 7.49999L0 2.40866L1.45437 0.954285L8.00008 7.49999L1.45437 14.0457L0 12.5913L5.09133 7.49999Z"
                fill="white"
                fill-opacity="0.7"
              />
            </svg>
          </div>
          {/* upload */}
          <div onClick={() => navigate("/creator/upload/video")} className=" w-full flex justify-between items-center p-[16px] red_popup_box_list">
            {/* content */}
            <div className=" flex gap-[12px] justify-center items-center">
              {/* <img className=" w-[36px] h-[36px]" src={invite} alt="" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="37"
                viewBox="0 0 36 37"
                fill="none"
              >
                <path
                  d="M36 18.5087C36 28.4247 27.9209 36.5 18 36.5C8.07915 36.5 0 28.4247 0 18.5087C0 8.57525 8.07915 0.5 18 0.5C27.9209 0.5 36 8.57525 36 18.5087Z"
                  fill="url(#paint0_linear_3565_9788)"
                  fill-opacity="0.32"
                />
                <path
                  d="M13.8604 14.7325C13.803 14.6751 13.7575 14.6071 13.7264 14.5322C13.6954 14.4572 13.6794 14.3769 13.6794 14.2958C13.6794 14.2147 13.6954 14.1344 13.7264 14.0595C13.7575 13.9846 13.803 13.9165 13.8604 13.8592L17.5632 10.1563C17.6206 10.099 17.6886 10.0534 17.7635 10.0224C17.8385 9.99133 17.9188 9.97534 17.9999 9.97534C18.081 9.97534 18.1613 9.99133 18.2362 10.0224C18.3111 10.0534 18.3792 10.099 18.4365 10.1563L22.1393 13.8592C22.2552 13.975 22.3202 14.1321 22.3202 14.2958C22.3202 14.4596 22.2552 14.6167 22.1393 14.7325C22.0235 14.8483 21.8665 14.9133 21.7027 14.9133C21.539 14.9133 21.3819 14.8483 21.2661 14.7325L18.617 12.0826V18.6158C18.617 18.7795 18.552 18.9365 18.4362 19.0522C18.3205 19.168 18.1635 19.233 17.9999 19.233C17.8362 19.233 17.6792 19.168 17.5635 19.0522C17.4477 18.9365 17.3827 18.7795 17.3827 18.6158V12.0826L14.7336 14.7325C14.6763 14.7898 14.6083 14.8354 14.5333 14.8664C14.4584 14.8975 14.3781 14.9135 14.297 14.9135C14.2159 14.9135 14.1356 14.8975 14.0607 14.8664C13.9858 14.8354 13.9177 14.7898 13.8604 14.7325ZM26.6399 19.233V24.1701C26.6399 24.4975 26.5098 24.8114 26.2783 25.0429C26.0469 25.2744 25.7329 25.4044 25.4056 25.4044H10.5941C10.2668 25.4044 9.95285 25.2744 9.72138 25.0429C9.4899 24.8114 9.35986 24.4975 9.35986 24.1701V19.233C9.35986 18.9056 9.4899 18.5917 9.72138 18.3602C9.95285 18.1287 10.2668 17.9987 10.5941 17.9987H15.8399C15.9217 17.9987 16.0002 18.0312 16.0581 18.0891C16.1159 18.1469 16.1484 18.2254 16.1484 18.3073V18.5742C16.1484 19.6117 16.997 20.4865 18.0353 20.4673C18.5202 20.458 18.9821 20.2588 19.3216 19.9126C19.6612 19.5664 19.8514 19.1008 19.8513 18.6158V18.3073C19.8513 18.2254 19.8838 18.1469 19.9417 18.0891C19.9995 18.0312 20.078 17.9987 20.1599 17.9987H25.4056C25.7329 17.9987 26.0469 18.1287 26.2783 18.3602C26.5098 18.5917 26.6399 18.9056 26.6399 19.233ZM23.5541 21.7015C23.5541 21.5185 23.4999 21.3395 23.3981 21.1872C23.2964 21.035 23.1518 20.9164 22.9827 20.8463C22.8135 20.7762 22.6274 20.7579 22.4478 20.7936C22.2683 20.8293 22.1033 20.9175 21.9739 21.047C21.8444 21.1764 21.7562 21.3414 21.7205 21.5209C21.6848 21.7005 21.7031 21.8866 21.7732 22.0558C21.8433 22.2249 21.9619 22.3695 22.1141 22.4712C22.2664 22.573 22.4453 22.6273 22.6284 22.6273C22.8739 22.6273 23.1094 22.5297 23.283 22.3561C23.4566 22.1825 23.5541 21.9471 23.5541 21.7015Z"
                  fill="#F8E4FF"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_3565_9788"
                    x1="18"
                    y1="0.5"
                    x2="18"
                    y2="36.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E28EFF" />
                    <stop offset="1" stop-color="#633672" />
                  </linearGradient>
                </defs>
              </svg>
              <div className=" flex flex-col gap-[8px]">
                <span className=" text-white text-[14px] font-[500]">
                  上传作品{" "}
                  <span className="recommand_span px-[6px] py-[1px]">推荐</span>{" "}
                </span>
                <span className=" text-white/80 text-[12px]">
                  发布您的视频，持续获得收益
                </span>
              </div>
            </div>
            {/* icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="15"
              viewBox="0 0 8 15"
              fill="none"
            >
              <path
                d="M5.09133 7.49999L0 2.40866L1.45437 0.954285L8.00008 7.49999L1.45437 14.0457L0 12.5913L5.09133 7.49999Z"
                fill="white"
                fill-opacity="0.7"
              />
            </svg>
          </div>
          {/* spin */}
          <div className=" w-full flex justify-between items-center p-[16px] red_popup_box_list">
            {/* content */}
            <div className=" flex gap-[12px] justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="37"
                viewBox="0 0 36 37"
                fill="none"
              >
                <path
                  d="M36 18.5087C36 28.4247 27.9209 36.5 18 36.5C8.07915 36.5 0 28.4247 0 18.5087C0 8.57525 8.07915 0.5 18 0.5C27.9209 0.5 36 8.57525 36 18.5087Z"
                  fill="url(#paint0_linear_3565_9807)"
                  fill-opacity="0.32"
                />
                <path
                  d="M18 9C16.1705 9 14.3821 9.5425 12.861 10.5589C11.3398 11.5753 10.1542 13.02 9.45412 14.7102C8.75401 16.4004 8.57083 18.2603 8.92774 20.0546C9.28465 21.8489 10.1656 23.4971 11.4593 24.7907C12.7529 26.0844 14.4011 26.9653 16.1954 27.3223C17.9897 27.6792 19.8496 27.496 21.5398 26.7959C23.23 26.0958 24.6747 24.9102 25.6911 23.389C26.7075 21.8679 27.25 20.0795 27.25 18.25C27.2474 15.7975 26.272 13.4463 24.5379 11.7121C22.8037 9.97797 20.4525 9.00259 18 9ZM21.4785 11.2405C21.7569 14.3107 20.4014 15.7098 18.6226 16.9701C18.4225 14.7928 17.8719 12.5408 15.2099 10.9381C16.2192 10.5524 17.2975 10.3801 18.3768 10.4322C19.456 10.4842 20.5128 10.7594 21.4803 11.2405H21.4785ZM10.1891 18.7427C12.7097 16.9639 14.598 17.4371 16.5814 18.3523C14.7981 19.6144 13.1251 21.2171 13.0655 24.3212C12.2267 23.6405 11.5381 22.7933 11.0431 21.8332C10.548 20.8731 10.2572 19.8208 10.1891 18.7427ZM22.3297 24.7668C19.5325 23.4727 18.997 21.6022 18.7978 19.4303C19.9292 19.9515 21.1379 20.3864 22.4711 20.3864C23.4788 20.3864 24.5577 20.1374 25.7291 19.4899C25.5563 20.5561 25.1652 21.5751 24.5802 22.4832C23.9953 23.3912 23.2291 24.1686 22.3297 24.7668Z"
                  fill="#F8E4FF"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_3565_9807"
                    x1="18"
                    y1="0.5"
                    x2="18"
                    y2="36.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E28EFF" />
                    <stop offset="1" stop-color="#633672" />
                  </linearGradient>
                </defs>
              </svg>
              <div className=" flex flex-col gap-[8px]">
                <span className=" text-white text-[14px] font-[500]">
                  幸运大转盘{" "}
                  <span className="recommand_span px-[6px] py-[1px]">推荐</span>{" "}
                </span>
                <span className=" text-white/80 text-[12px]">
                  获得丰厚的奖励和奖金
                </span>
              </div>
            </div>
            {/* icon */}
            <span className="coming_soon">即将开放...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedBox;
