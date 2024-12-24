import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import chinese from "../../../assets/explore/chinese.png";
import avatar from "../../../assets/explore/avatar.png";
import "../explore.css";
import { useNavigate } from "react-router-dom";

interface RecommandProps {
  title: string;
}

const Recommand: React.FC<RecommandProps> = ({ title }) => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshCard = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
    clearTimeout;
  };
  return (
    <div className=" pb-[20px] pt-[10px]">
      {/* header */}
      <div className=" flex justify-between items-center">
        <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
          {title}
        </h1>
        <ChevronRight
          onClick={() => navigate("/rec_more", { state: { title } })}
          className="rec_exp_more_btn px-[2px]"
        />
      </div>
      {/* content */}
      <div className=" py-[12px] grid grid-cols-2 gap-[18px]">
        {refresh ? (
          <>
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className=" w-[175px] h-[170px] animate-pulse bg-slate-800"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className=" w-[175px] h-[170px] animate-pulse bg-slate-800"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className=" w-[175px] h-[170px] animate-pulse bg-slate-800"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className=" w-[175px] h-[170px] animate-pulse bg-slate-800"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-[175px">
              <div className=" relative  chinese_photo">
                <img className=" w-[175px]" src={chinese} alt="" />
                <span className=" text-white text-[11px] absolute bottom-2 left-2">
                  29.3k views
                </span>
                <span className=" text-white text-[11px] absolute bottom-2 right-2">
                  00:23:32
                </span>
              </div>
              <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                Legend of Fuyao
              </h1>
              {/* uploader */}
              <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                <img
                  className=" w-[26px] h-[26px] rounded-full"
                  src={avatar}
                  alt=""
                />
                <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                  Peter Parker
                </h1>
              </div>
            </div>
            <div className="w-[175px">
              <div className=" relative  chinese_photo">
                <img className=" w-[175px]" src={chinese} alt="" />
                <span className=" text-white text-[11px] absolute bottom-2 left-2">
                  29.3k views
                </span>
                <span className=" text-white text-[11px] absolute bottom-2 right-2">
                  00:23:32
                </span>
              </div>
              <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                Legend of Fuyao
              </h1>
              {/* uploader */}
              <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                <img
                  className=" w-[26px] h-[26px] rounded-full"
                  src={avatar}
                  alt=""
                />
                <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                  Peter Parker
                </h1>
              </div>
            </div>

            <div className="w-[175px">
              <div className=" relative  chinese_photo">
                <img className=" w-[175px]" src={chinese} alt="" />
                <span className=" text-white text-[11px] absolute bottom-2 left-2">
                  29.3k views
                </span>
                <span className=" text-white text-[11px] absolute bottom-2 right-2">
                  00:23:32
                </span>
              </div>
              <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                Legend of Fuyao
              </h1>
              {/* uploader */}
              <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                <img
                  className=" w-[26px] h-[26px] rounded-full"
                  src={avatar}
                  alt=""
                />
                <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                  Peter Parker
                </h1>
              </div>
            </div>
            <div className="w-[175px">
              <div className=" relative  chinese_photo">
                <img className=" w-[175px]" src={chinese} alt="" />
                <span className=" text-white text-[11px] absolute bottom-2 left-2">
                  29.3k views
                </span>
                <span className=" text-white text-[11px] absolute bottom-2 right-2">
                  00:23:32
                </span>
              </div>
              <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                Legend of Fuyao
              </h1>
              {/* uploader */}
              <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                <img
                  className=" w-[26px] h-[26px] rounded-full"
                  src={avatar}
                  alt=""
                />
                <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                  Peter Parker
                </h1>
              </div>
            </div>
          </>
        )}
      </div>
      {/* buttons */}
      <div className="flex justify-center gap-[20px] px-[10px]">
        <button
          onClick={() => navigate("/rec_more", { state: { title } })}
          className="more_btn w-1/2 p-[16px]"
        >
          More
        </button>
        <button onClick={refreshCard} className="more_btn w-1/2 p-[16px]">
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Recommand;
