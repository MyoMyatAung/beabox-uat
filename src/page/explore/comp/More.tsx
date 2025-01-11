import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import more from "../../../assets/explore/more.png";
import "../explore.css";
import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";
import { useDispatch } from "react-redux";
import { setDetails } from "@/store/slices/exploreSlice";
import VodDetails from "./VodDetails";
import { paths } from "@/routes/paths";

interface MoreProps {}

const More: React.FC<MoreProps> = () => {
  const [show, setshow] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { title } = location.state || {};
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const { data, isLoading, refetch } = useGetExploreTagQuery({
    order: activeTab,
    tag: title,
  });
  useEffect(() => {
    if (data?.data) {
      setList(data?.data.list);
    }
    refetch();
  }, [data, list, activeTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // console.log(list)

  const popularItems = Array.from({ length: 10 }, (_, i) => ({
    title: `My Boss (2021) - ${i + 1}`,
    views: 3685 + i * 10,
    likes: 1245 + i * 5,
  }));

  const latestItems: any[] = []; // Empty for "Latest"

  const renderItems = activeTab === "popular" ? popularItems : latestItems;

  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details)
    // setshow(true);
  };
// console.log(list)
  return (
    <>
      {/* {show && <VodDetails setshow={setshow} />} */}
      <div className=" p-[20px]">
        {/* Header */}
        <div className=" flex justify-between pb-[12px]">
          <ChevronLeft
            onClick={() => navigate("/")}
            className="rec_exp_more_btn px-[2px]"
          />
          <h1 className=" w-2/3 text-white text-[18px] font-[500]">{title}</h1>
        </div>

        {/* Tabs */}
        <div className=" flex gap-[8px]">
          <button
            className={`text-white text-[14px] font-[400] leading-[16px] px-[16px] py-[8px] ${
              activeTab === "popular"
                ? "more_tabs_buttons_active"
                : "more_tabs_buttons"
            }`}
            onClick={() => setActiveTab("popular")}
          >
            Popular
          </button>
          <button
            className={`text-white text-[14px] font-[400] leading-[16px] px-[16px] py-[8px] ${
              activeTab === "latest"
                ? "more_tabs_buttons_active"
                : "more_tabs_buttons"
            }`}
            onClick={() => setActiveTab("latest")}
          >
            Latest
          </button>
        </div>

        {/* List */}
        <div className=" py-[20px] flex flex-col gap-[20px] w-full">
          {renderItems.length > 0
            ? list.map((item: any, index) => (
                <div
                onClick={() => showDetailsVod(item)}
                  key={index}
                  className=" flex w-full justify-center items-center gap-[16px]"
                >
                  <img
                    className=" w-[107px] h-[69px] rounded-[8px] object-cover object-center"
                    src={item.preview_image}
                    alt="More"
                  />
                  <div className=" w-2/3 flex flex-col h-[70px] justify-between">
                    <span className=" text-white text-[14px] font-[400]">
                      {item.title.length > 20
                        ? `${item.title.slice(0, 30)}...`
                        : item.title}{" "}
                    </span>
                    <div className=" flex justify-between text-[#AAA] text-[12px] font-[400] leading-[15px]">
                      <span>
                        {item.view_count ? item.view_count : "0"} views
                      </span>
                      <span>{item.like_count} likes</span>
                    </div>
                  </div>
                </div>
              ))
            : list.map((item: any, index) => (
                <div
                  key={index}
                  className=" flex w-full justify-center items-center gap-[16px]"
                >
                  <img
                    className=" w-[107px] h-[69px] rounded-[8px] object-cover object-center"
                    src={item.preview_image}
                    alt="More"
                  />
                  <div className=" w-2/3 flex flex-col h-[70px] justify-between">
                    <span className=" text-white text-[14px] font-[400]">
                      {item.title.length > 20
                        ? `${item.title.slice(0, 30)}...`
                        : item.title}{" "}
                    </span>
                    <div className=" flex justify-between text-[#AAA] text-[12px] font-[400] leading-[15px]">
                      <span>
                        {item.view_count ? item.view_count : "0"} views
                      </span>
                      <span>{item.like_count} likes</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default More;
