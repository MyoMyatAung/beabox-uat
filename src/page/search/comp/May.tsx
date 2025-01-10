import React from "react";
import { setHistoryData } from "../slice/HistorySlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface MayProps {}

const May: React.FC<MayProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const may = [
    "Sigma Boy Trend",
    "STITCH",
    "Stitches Shawn Mandese",
    "Sayonara bye bye",
    "Sea full of stars",
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
        {may?.map((mm: any) => (
          <button
            onClick={() => handleSearch(mm)}
            className=" p-[12px] text-white font-[400] flex justify- gap-[8px] items-center"
          >
            <span className=" w-[4px] h-[4px] bg-[#888]"></span>
            <h1 className=" text-start">{mm}</h1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default May;
