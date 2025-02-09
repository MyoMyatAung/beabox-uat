import React from "react";
import { setHistoryData } from "../slice/HistorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../search.css";
import { useGetConfigQuery } from "@/page/home/services/homeApi";

interface HotProps {}

const Hot: React.FC<HotProps> = ({}) => {
  const { data, isLoading } = useGetConfigQuery({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hot = data?.data?.hot_search?.split(",");

  const handleSearch = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div className="mt-[15px]">
      {/* header */}
      <div className=" flex justify-between items-center">
        <h1 className=" text-white text-[17px] font-[700] leading-[16px]">
          热门搜索
        </h1>
      </div>
      <div className=" flex gap-[8px] py-[20px] flex-wrap">
        {hot?.map((ht: any, index: any) => (
          <button
            key={index}
            onClick={() => handleSearch(ht)}
            className="history_box p-[12px] text-white font-[400]"
          >
            {ht}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hot;
