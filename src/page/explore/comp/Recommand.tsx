import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import chinese from "../../../assets/explore/chinese.png";
import avatar from "../../../assets/explore/avatar.png";
import uiLeft from "../../../assets/explore/uiLeftt.svg";
import "../explore.css";
import { useNavigate } from "react-router-dom";
import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";
import { Person } from "@/assets/profile";
import { useDispatch } from "react-redux";
import { setDetails } from "@/store/slices/exploreSlice";
import { paths } from "@/routes/paths";

interface RecommandProps {
  title: string;
  // setshow : any
}

const Recommand: React.FC<RecommandProps> = ({ title }) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const { data, isLoading, refetch } = useGetExploreTagQuery({
    order: "popular",
    tag: title,
  });
  useEffect(() => {
    if (data?.data) {
      setList(data?.data.list);
    }
  }, [data, list, isLoading]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshCard = async () => {
    setRefresh(true); // Show loading animation
    await refetch(); // Refetch data
    setRefresh(false); // Hide loading animation after refetch
  };
  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details);
  };
  // console.log(data.data)
  return (
    <div className=" pb-[20px] px-[10px] pt-[10px] flex flex-col items-center">
      {/* header */}
      <div className=" flex w-full justify-between items-center">
        <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
          {title}
        </h1>
        {/* <ChevronRight
        color="#E8B9FF"
          onClick={() => navigate("/rec_more", { state: { title } })}
          className="rec_exp_more_btn px-[2px]"
        /> */}
        <div
          onClick={() => navigate("/rec_more", { state: { title } })}
          className="rec_exp_more_btn"
        >
          <img src={uiLeft} alt="" />
        </div>
      </div>
      {/* content */}
      <div className=" py-[12px] grid grid-cols-2 justify-cente w-full items-cente  gap-[18px]">
        <>
          {isLoading || refresh ? (
            <>
              <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
              <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
              <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
              <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
            </>
          ) : (
            <>
              {list?.slice(0, 4).map((card: any) => (
                <div key={card.post_id} className="w-full">
                  <div
                    onClick={() => showDetailsVod(card)}
                    className=" relative  chinese_photo"
                  >
                    <img
                      className=" w-[175px] h-[100px] rounded-[8px] object-cover"
                      src={card.preview_image}
                      alt=""
                    />
                    <div className=" absolute bottom-0 flex justify-between px-[5px w-[165px]">
                      <div className=" flex w-full justify-around">
                        <span className=" text-white text-[11px]  left-2">
                          29.3k views
                        </span>
                        <span className=" text-white text-[11px]  right-0">
                          00:23
                        </span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                    {card.title.length > 10
                      ? `${card.title.slice(0, 10)}...`
                      : card.title}
                  </h1>
                  {/* uploader */}
                  <div className=" flex justify-cente py-[4px] items-center gap-[8px]">
                    {card.user.avatar ? (
                      <img
                        className=" w-[26px] h-[26px] rounded-full"
                        src={card.user.avatar}
                        alt=""
                      />
                    ) : (
                      <div className="w-[15px] h-[15px] rounded-full bg-[#FFFFFF12] flex justify-center items-center">
                        <Person />
                      </div>
                    )}
                    <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                      {card.user.name}
                    </h1>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      </div>
      {/* buttons */}
      <div className="fle hidden justify-center gap-[20px] px-[10px]">
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
