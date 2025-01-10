import React from "react";
import { setHistoryData } from "../slice/HistorySlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../search.css"

interface HotProps {}

const Hot: React.FC<HotProps> = ({}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const hot = [
    "Spider Man",
    "Disney",
    "Scooby-Doo",
    "Mulan",
    "Dead-pool",
    "Moana",
  ];

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
          Hot Search
        </h1>
      </div>
      <div className=" flex gap-[8px] py-[20px] flex-wrap">
        {hot?.map((ht: any) => (
          <button
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
