import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setHistoryData } from "../slice/HistorySlice";
import back from "../../../assets/explore/back.svg";
import sc from "../../../assets/explore/sc.svg";
import loader from "../../home/vod_loader.gif";
import {
  useGetTabListQuery,
  usePostSearchMutation,
} from "@/store/api/search/searchApi";
import Header from "./Header";

interface ResultsProps {}

const Results: React.FC<ResultsProps> = ({}) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("Top");
  const { data: TabsData } = useGetTabListQuery("");
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  // const swiperRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [currentPage, setcurrentPage] = useState(1);
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [postSearch, { data, isLoading  }] = usePostSearchMutation();
  const handleSearch = () => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));

      postSearch({
        search: query,
        tab: activeTab,
        page: currentPage,
      });
    }
  };
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery, tabs]);

  useEffect(() => {
    if (data?.data) {
      setMovies(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (TabsData?.data) {
      setTabs(TabsData.data);
    }
  }, [TabsData]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const noData = !data || data?.data?.length === 0;
  // console.log(noData)

  return (
    <div className="px-[16px]">
      {/* header */}
      <div className=" pb-[32px] pt-[20px] flex justify-between items-center gap-[10px]">
        <img
          onClick={() => navigate("/search_overlay")}
          className=" pt-[6px]"
          src={back}
          alt=""
        />
        <div className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]">
          <img src={sc} alt="" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
            placeholder="Search Videos"
            className=" bg-transparent focus:outline-none text-[12px] font-[400] text-[#888] w-full"
            type="text"
          />
        </div>
        <button onClick={handleSubmit} className="search_btn">
          Search
        </button>
      </div>
      {/* tabs */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="">
        {isLoading  ? (
           <div
           className=" flex justify-center items-center py-[200px]"
          >
            <div className="heart">
              <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
            </div>
          </div>
        ) : (
          <>
            {noData && (
              <div className="flex justify-center items-center py-[200px]">
                <h1 className="">No Video yet!</h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
