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
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { FaHeart } from "react-icons/fa";

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

  const calculateHeight = (width: number, height: number) => {
    if (width < height) {
      return 112; // Portrait
    }
    if (width > height) {
      return 240; // Landscape
    }
    return 200;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  // console.log(list);
  return (
    <div className=" pb-[20px] pt-[10px] px-[10px]">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <div className=" grid grid-cols-2 gap-[20px]">
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[312px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[312px]"></div>
          </div>
        </div>
      ) : (
        <>
          {list?.map((ll: any, index) => (
            <div key={index} className="flex flex-col w-full items-center">
              {/* header */}
              <div className=" flex w-full justify-between items-center py-[12px] px-[10p]">
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
              <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[18px]">
                <>
                  {ll.posts.map((card: any) => (
                    <div
                      key={card.post_id}
                      className="max-w-full pb-[12px chinese_photo h-[315px]"
                    >
                      <div
                        onClick={() => showDetailsVod(card)}
                        className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
                      >
                        <ImageWithPlaceholder
                          src={card?.preview_image}
                          alt={card.title || "Video"}
                          width={"100%"}
                          // height={240}
                          height={calculateHeight(
                            card?.files[0]?.width,
                            card?.files[0]?.height
                          )}
                          className=" object-cover h-full w-full rounded-none"
                        />

                        <div className=" absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
                          <div className=" flex w-full  justify-between px-2">
                            <span className=" text-white text-[11px]  left-">
                              {card?.view_count} 次观看
                            </span>
                            <span className=" text-white text-[11px]  right-0">
                              {formatDuration(card?.files[0].duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h1 className="text-white w-full text-[12px] font-[400] px-[6px] pt-[6px leading-[20px] break-words">
                        {card.title.length > 50
                          ? `${card.title.slice(0, 50)}...`
                          : card.title}
                      </h1>
                      <div className=" flex w-full p-[6px] justify-between">
                        <div className=" flex justify-cente  items-center gap-[8px]">
                          {card.user.avatar ? (
                            <img
                              onError={() => console.log("gg")}
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
                            {/* {card?.files[0]?.width} & {card?.files[0]?.height} {} */}
                          </h1>
                        </div>
                        <div className=" flex justify-center items-center gap-[4px]">
                          <FaHeart />
                          <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                            {formatNumber(card?.like_count)}
                          </h1>
                        </div>
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
