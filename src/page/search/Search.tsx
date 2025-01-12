import React, { useState } from "react";
import sc from "../../assets/explore/sc.svg";
import back from "../../assets/explore/back.svg";
import "./search.css";
import History from "./comp/History";
import Hot from "./comp/Hot";
import May from "./comp/May";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHistoryData } from "./slice/HistorySlice";

interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div className=" px-[16px] bg-[#16131C] h-full min-h-screen">
      {/* header */}
      <div className=" pb-[32px] pt-[20px] flex justify-between items-center gap-[10px]">
        <img
          onClick={() => navigate("/")}
          className=" pt-[6px]"
          src={back}
          alt=""
        />
        <div
          //   onSubmit={handleSubmit}
          className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]"
        >
          <img src={sc} alt="" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
            placeholder="Search Videos"
            className=" bg-transparent focus:outline-none text-[16px] font-[400] text-[#888] w-full"
            type="text"
          />
        </div>
        <button onClick={handleSubmit} className="search_btn">
          Search
        </button>
      </div>
      {/* initial */}
      <History />
      <Hot />
      <May />
    </div>
  );
};

export default Search;
