import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import chinese from "../../../assets/explore/chinese.png";
import avatar from "../../../assets/explore/avatar.png";
import "../explore.css";
import { useNavigate } from "react-router-dom";
import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";

interface RecommandProps {
  title: string;
}

const Recommand: React.FC<RecommandProps> = ({ title }) => {
  const [list, setList] = useState([]);
  const { data, isLoading, refetch } = useGetExploreTagQuery("");
  useEffect(() => {
    if (data?.data) {
      setList(data?.data.list);
    }
  }, [data, list]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshCard = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 300);
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
            <div className=" grid grid-cols-2 gap-[20px] justify-center">
              <div className="flex items-center gap-[20px] space-x-4">
                <div className="space-y-2">
                  <div className=" w-[335px] h-[150px] animate-pulse bg-slate-700"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {isLoading ? (
              <>
                <div className="w-[175px] h-[120px] bg-white/20"></div>
                <div className="w-[175px] h-[120px] bg-white/20"></div>
                <div className="w-[175px] h-[120px] bg-white/20"></div>
                <div className="w-[175px] h-[120px] bg-white/20"></div>
              </>
            ) : (
              <>
                {list?.slice(0, 4).map((card: any) => (
                  <div key={card.post_id} className="w-[175px">
                    <div className=" relative  chinese_photo">
                      <img
                        className=" w-[175px] h-[100px] rounded-[8px] object-cover"
                        src={card.preview_image}
                        alt=""
                      />
                      <span className=" text-white text-[11px] absolute bottom-2 left-2">
                        29.3k views
                      </span>
                      <span className=" text-white text-[11px] absolute bottom-2 right-2">
                        00:23:32
                      </span>
                    </div>
                    <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                      {card.title.length > 20
                        ? `${card.title.slice(0, 20)}...`
                        : card.title}
                    </h1>
                    {/* uploader */}
                    <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                      <img
                        className=" w-[26px] h-[26px] rounded-full"
                        src={card.user.avatar ? card.user.avatar : avatar}
                        alt=""
                      />
                      <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                        {card.user.name}
                      </h1>
                    </div>
                  </div>
                ))}
              </>
            )}
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
