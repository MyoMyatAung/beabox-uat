import React, { useState } from "react";

interface NoticeProps {
  notice: any;
  handleNoticeClose: () => void;
}

const Notice: React.FC<NoticeProps> = ({ notice, handleNoticeClose }) => {
  // console.log(notice)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTextIndex, setActiveTextIndex] = useState<number>(0);

  // Validate the active notice and text
  const activeNotice = notice[activeIndex] || null;
  const activeText = activeNotice?.notices?.[activeTextIndex] || {
    title: "",
    content: "",
  };

  return (
    <div className="">
      <div className="w-[330px] flex flex-col gap-0 justify-center items-center">
        <div className="initial_popup_ad_box_notice w-full h-[500px] overflow-hidde pr-[10px] py-[10px]">
          <div className="flex flex-col justify-cente scrollbar-hide h-full">
            <div className="w-full flex">
              {notice?.map((app: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col w-full justify-center items-center cursor-pointer"
                  onClick={() => setActiveIndex(index)} // Handle click to set active
                >
                  <h1
                    className={`text-center text-white text-[18px] font-[600] `}
                  >
                    {app.title}
                  </h1>
                  {activeIndex === index && (
                    <span className="initial_popup_ad_box_notice_active"></span>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 h-full pb-[20px] gap-2 pt-[20px]">
              {/* titles */}
              <div className="col-span-2 flex flex-col gap-[8px] initial_popup_ad_box_notice_title_box px-[4px] py-[6px]">
                {activeNotice?.notices?.map((nn: any, index: number) => (
                  <div
                    key={nn.id}
                    onClick={() => setActiveTextIndex(index)}
                    className={`${
                      activeTextIndex === index
                        ? "initial_popup_ad_box_notice_title_box_gg_active"
                        : "initial_popup_ad_box_notice_title_box_gg"
                    }`}
                  >
                    <h1 className="text-white text-center px-[12px] py-[8px]  text-[14px] font-[500] leading-[14px]">
                      {nn.title}
                    </h1>
                  </div>
                ))}
              </div>
              {/* texts */}
              <div className="col-span-3 flex flex-col gap-[8px] text-white h-full pt-2">
                <h1 className="text-white text-[14px] font-[500] leading-[12px]">
                  {activeText.title}
                </h1>
                <p className="text-[#888] text-[10px] font-[500]">
                  {activeText.content}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={handleNoticeClose}
          className="initial_popup_ad_box_close p-[9px] mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23"
            viewBox="0 0 24 23"
            fill="none"
          >
            <path
              d="M17.75 5.75L6.25 17.25"
              stroke="white"
              strokeWidth="1.49593"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.25 5.75L17.75 17.25"
              stroke="white"
              strokeWidth="1.49593"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Notice;
