import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearData,
  selectHistoryData,
  setHistoryData,
} from "../slice/HistorySlice";
import "../search.css";
import { useNavigate } from "react-router-dom";

interface HistoryProps {}

const History: React.FC<HistoryProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [ref, setRef] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const historys = useSelector(selectHistoryData);
  const handleDelete = () => {
    dispatch(clearData({}));
  };
  // console.log(historys)

  const handleSearch = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate refresh logic, e.g., re-fetching or resetting data
      setIsLoading(false);
    }, 1000); // 1 second delay
  };

  return (
    <div>
      {/* header */}
      <div className=" flex justify-between items-center">
        <h1 className=" text-white text-[14px] font-[700] leading-[16px]">
          搜索记录
        </h1>
        <span
          onClick={handleDelete}
          className=" text-white/60 text-[12px] font-[500] leading-[18px]"
        >
          清除
        </span>
      </div>
      <div className=" flex gap-[8px] py-[20px] flex-wrap">
        {historys?.map((hs: any, index: any) => (
          <button
            key={index}
            onClick={() => handleSearch(hs)}
            className="history_box p-[12px] text-white font-[400]"
          >
            {hs}
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;
