import React from "react";
import { setHistoryData } from "../slice/HistorySlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTop20PostsQuery } from "@/page/home/services/homeApi";

interface MayProps {}

const May: React.FC<MayProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useTop20PostsQuery({});
  const post = data?.data;

  // const may = [
  //   "Sigma Boy Trend",
  //   "STITCH",
  //   "Stitches Shawn Mandese",
  //   "Sayonara bye bye",
  //   "Sea full of stars",
  //   "Moana",
  // ];

  const handleSearch = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div>
      {/* header */}
      <div className=" flex justify-between items-center">
        <h1 className=" text-white text-[14px] font-[700] leading-[16px]">
          You may like
        </h1>
        <span
          // onClick={handleDelete}
          className=" text-white/60 text-[12px] font-[500] leading-[18px]"
        >
          Refresh
        </span>
      </div>
      <div className=" flex flex-col gap-[8px] py-[20px] flex-wrap">
        {post?.map((val: any) => (
          <button
            onClick={() => handleSearch(val?.title)}
            className=" p-[12px] text-white font-[400] flex gap-[8px] items-center"
          >
            <div className="w-[4px] h-[4px] bg-[#888] flex-shrink-0"></div>
            <h1 className=" text-start ml-2">{val?.title}</h1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default May;
