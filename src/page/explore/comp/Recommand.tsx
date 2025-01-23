import React, { useEffect, useState } from "react";

import uiLeft from "../../../assets/explore/uiLeftt.svg";
import "../explore.css";
import { useNavigate } from "react-router-dom";
import {
  useGetExploreListQuery,
  useGetExploreTagQuery,
} from "@/store/api/explore/exploreApi";
import { Person } from "@/assets/profile";
import { useDispatch } from "react-redux";
import { setDetails, setTitle } from "@/store/slices/exploreSlice";
import { paths } from "@/routes/paths";

interface RecommandProps {
  title: string;
  list_id: string;
  // setshow : any
}

const Recommand: React.FC<RecommandProps> = ({ title, list_id }) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const { data, isLoading, refetch } = useGetExploreListQuery({
    id: list_id,
  });
  useEffect(() => {
    if (data?.data) {
      setList(data?.data);
    }
  }, [data, list]);
  // console.log(" this is mf", list);
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

  const showMore = (tt: any) => {
    dispatch(setTitle(tt));
    navigate(paths.recommand_more, { state: { tt } });
  };

  function formatDuration(duration: any) {
    const hours = Math.floor(duration / 3600); // Get the hours
    const minutes = Math.floor((duration % 3600) / 60); // Get the remaining minutes
    const seconds = duration % 60; // Get the remaining seconds

    // Ensure all values are padded to 2 digits
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

  // console.log(list);
  return (
    <div className=" pb-[20px] px-[10px] pt-[10px] ">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-10">
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
          <div className="w-[175px] rounded-[8px] h-[140px] bg-white/20"></div>
        </div>
      ) : (
        <>
          {list?.map((ll: any, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* header */}
              <div className=" flex w-full justify-between items-center">
                <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
                  {ll.title}
                </h1>
                <div
                  // onClick={() => navigate(paths.recommand_more, { state: { title } })}
                  onClick={() => showMore(ll.title)}
                  className="rec_exp_more_btn"
                >
                  <img src={uiLeft} alt="" />
                </div>
              </div>{" "}
              {/* content */}
              <div className=" py-[12px] grid grid-cols-2 justify-cente w-full items-cente  gap-[18px]">
                <>
                  {ll.posts.map((card: any) => (
                    <div key={card.post_id} className="w-[175px pb-[12px]">
                      <div
                        onClick={() => showDetailsVod(card)}
                        className=" relative  chinese_photo"
                      >
                        <img
                          className=" w-[175px] h-[100px] rounded-[8px] object-cover"
                          src={card.preview_image}
                          alt=""
                        />
                        <div className=" absolute left-0 mx-auto right-0 bottom-0 flex justify-around items-center w-full bg-blac">
                          <div className=" flex w-full justify-between px-2">
                            <span className=" text-white text-[11px]  left-">
                              {card?.view_count} 次观看
                            </span>
                            <span className=" text-white text-[11px]  right-0">
                              {formatDuration(card.files[0].duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h1 className="text-white text-[14px] font-[500] leading-[20px] py-[4px]">
                        {card.title.length > 10
                          ? `${card.title.slice(0, 10)}...`
                          : card.title}
                      </h1>
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
              </div>{" "}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Recommand;
