import React from "react";
import { setHistoryData } from "../slice/HistorySlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTop20PostsQuery } from "@/page/home/services/homeApi";
import loader from "@/page/home/vod_loader.gif";

interface MayProps {}

const May: React.FC<MayProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, refetch } = useTop20PostsQuery({});
  const post = data?.data;

  // const may = [
  //   "Sigma Boy Trend",
  //   "STITCH",
  //   "Stitches Shawn Mandese",
  //   "Sayonara bye bye",
  //   "Sea full of stars",
  //   "Moana",
  // ];

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="mt-5">
      {/* header */}
      <div className=" flex justify-between items-center">
        <h1 className=" text-white text-[17px] font-[700] leading-[16px]">
          猜你喜欢
        </h1>
        <span
          onClick={handleRefresh}
          className=" text-white/60 flex items-center gap-2 text-[14px] font-[500] leading-[18px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.48113 1.63188C5.43671 1.23461 6.4947 1.1654 7.49228 1.43491C8.48987 1.70443 9.37281 2.29799 10.0043 3.12447C10.0343 3.16373 10.0689 3.199 10.1061 3.22895L8.32014 3.24092C7.98143 3.24359 7.70861 3.51974 7.71127 3.85845C7.71326 4.19717 7.99008 4.46999 8.32879 4.46733L11.3892 4.4467C11.5542 4.44537 11.7119 4.37816 11.8264 4.25904C11.9408 4.13992 12.0027 3.98022 11.9981 3.81519L11.9029 0.595177C11.8929 0.257129 11.6101 -0.00971146 11.2721 0.000271211C10.9334 0.0102529 10.6672 0.293074 10.6772 0.631769L10.7191 2.06246C9.94984 1.18741 8.93975 0.555894 7.81184 0.251099C6.55217 -0.0889426 5.21669 -0.00177294 4.01093 0.499303C2.80516 0.999714 1.79771 1.88674 1.14355 3.02069C0.488751 4.15528 0.223256 5.47412 0.386948 6.7751C0.550647 8.07603 1.1349 9.28712 2.05055 10.2213C2.96619 11.1556 4.16207 11.7605 5.45368 11.9422C6.74596 12.1246 8.06093 11.8724 9.19616 11.2262C10.3307 10.5801 11.2225 9.57594 11.7336 8.36941C11.866 8.05733 11.7203 7.69732 11.4088 7.56555C11.0968 7.43313 10.7367 7.57886 10.6043 7.89096C10.1977 8.85052 9.48903 9.64764 8.58938 10.1601C7.68904 10.6724 6.6477 10.8721 5.6249 10.7277C4.60212 10.5839 3.65392 10.1048 2.92652 9.36286C2.19986 8.62089 1.73471 7.65797 1.60429 6.62188C1.47386 5.5858 1.68547 4.53574 2.20584 3.63407C2.72622 2.73172 3.52674 2.02836 4.48158 1.63174L4.48113 1.63188Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
          刷新
        </span>
      </div>
      {/* <div className=" flex flex-col gap-[8px] py-[20px] flex-wrap">
        {post?.map((val: any) => (
          <button
            onClick={() => handleSearch(val?.title)}
            className=" p-[12px] text-white font-[400] flex gap-[8px] items-center"
          >
            <div className="w-[4px] h-[4px] bg-[#888] flex-shrink-0"></div>
            <h1 className=" text-start may_text ml-2">{val?.title}</h1>
          </button>
        ))}
      </div> */}
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[300px]">
          <img src={loader} alt="" className="w-[70px] h-[70px]" />
        </div>
      ) : (
        <div className="flex flex-col gap-[8px] py-[20px]">
          {post?.map((val: any, index: number) => (
            <button
              key={index}
              onClick={() => handleSearch(val?.title)}
              className={`px-[12px] py-[4px]  font-[400] flex gap-[8px] items-center rounded-lg ${
                index < 2
                  ? "bg-first-two text-[16px] font-bold flex relative  items-center justify-between"
                  : ""
              }`}
            >
              {index < 2 ? (
                <>
                  <div className="font-bold flex truncate items-center gap-2">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#EAACFF] flex-shrink-0"></div>
                    <div className=" max-w-[calc(100%-40px)] truncate">
                      {val?.title}
                    </div>
                    <span className="text-xl">🔥</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[5px] h-[5px] rounded-full bg-[#888] flex-shrink-0"></div>
                  <h1 className="text-start truncate may_text ml-2">
                    {val?.title}
                  </h1>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default May;
