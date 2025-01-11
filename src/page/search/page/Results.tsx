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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoFeed from "@/page/home/components/VideoFeed";

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
  const [postSearch, { data, isLoading }] = usePostSearchMutation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
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
    postSearch({
      search: query,
      tab: activeTab,
      page: currentPage,
    });
  }, [activeTab]);

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

  // If a movie is selected, display the `VideoFeed` component
  if (showVideoFeed && selectedMovieId) {
    return (
      <VideoFeed
        videos={movies}
        currentActiveId={selectedMovieId}
        setShowVideoFeed={setShowVideoFeed}
        query={query}
      />
    );
  }

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
            className=" bg-transparent focus:outline-none text-[16px] font-[400] text-[#888] w-full"
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
        {isLoading ? (
          <div className=" flex justify-center items-center py-[200px]">
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

            {movies?.length > 0 && (
              <div className="flex gap-2 inner_div">
                {/* First Column */}
                <div className="flex flex-col gap-2 w-1/2">
                  {movies
                    .map((video, originalIndex) => ({ video, originalIndex })) // Preserve original index
                    .filter((_, index) => index % 2 === 0) // Filter for the first column
                    .map(
                      (
                        { video, originalIndex } // Map over filtered results
                      ) => (
                        <button
                          key={originalIndex}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMovieId(video?.post_id);
                            setShowVideoFeed(true);
                          }}
                        >
                          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={
                                video?.preview_image ||
                                "https://via.placeholder.com/150"
                              }
                              alt={video.title || "Video"}
                              className="w-full h-full object-cover"
                              style={{ minHeight: "240px", maxHeight: "340px" }}
                            />
                          </div>
                          <div className="mt-2">
                            <p className="search_text line-clamp-2 text-left">
                              {video.title}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                              <Avatar className="w-[20px] h-[20px] border-2 border-white ">
                                <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                              <div className="mt-1 text-[14px] text-left text-[#bfbfbf] mb-1">
                                {video?.user?.name}
                              </div>
                            </div>

                            <div className="flex gap-1 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="17"
                                viewBox="0 0 19 17"
                                fill="none"
                                className="mt-[8px]"
                              >
                                <g filter="url(#filter0_d_3792_5241)">
                                  <path
                                    d="M12.0257 0.200195C10.993 0.200195 10.0888 0.6443 9.52515 1.39498C8.96152 0.6443 8.0573 0.200195 7.02456 0.200195C6.20248 0.201122 5.41433 0.528103 4.83303 1.1094C4.25174 1.6907 3.92475 2.47885 3.92383 3.30093C3.92383 6.80175 9.11455 9.63542 9.3356 9.75245C9.39387 9.78379 9.45899 9.8002 9.52515 9.8002C9.59131 9.8002 9.65643 9.78379 9.71469 9.75245C9.93575 9.63542 15.1265 6.80175 15.1265 3.30093C15.1255 2.47885 14.7986 1.6907 14.2173 1.1094C13.636 0.528103 12.8478 0.201122 12.0257 0.200195Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <filter
                                    id="filter0_d_3792_5241"
                                    x="0.723828"
                                    y="0.200195"
                                    width="17.6031"
                                    height="15.9996"
                                    filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB"
                                  >
                                    <feFlood
                                      flood-opacity="0"
                                      result="BackgroundImageFix"
                                    />
                                    <feColorMatrix
                                      in="SourceAlpha"
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      result="hardAlpha"
                                    />
                                    <feOffset dy="3.2" />
                                    <feGaussianBlur stdDeviation="1.6" />
                                    <feComposite
                                      in2="hardAlpha"
                                      operator="out"
                                    />
                                    <feColorMatrix
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in2="BackgroundImageFix"
                                      result="effect1_dropShadow_3792_5241"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in="SourceGraphic"
                                      in2="effect1_dropShadow_3792_5241"
                                      result="shape"
                                    />
                                  </filter>
                                </defs>
                              </svg>
                              <span className="like_count">
                                {video.like_count || 283}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                </div>

                {/* Second Column */}
                <div className="flex flex-col gap-2 w-1/2">
                  {movies
                    .map((video, originalIndex) => ({ video, originalIndex })) // Preserve original index
                    .filter((_, index) => index % 2 !== 0) // Filter for the second column
                    .map(
                      (
                        { video, originalIndex } // Map over filtered results
                      ) => (
                        <button
                          key={originalIndex}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMovieId(video?.post_id);
                            setShowVideoFeed(true);
                          }}
                        >
                          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={
                                video?.preview_image ||
                                "https://via.placeholder.com/150"
                              }
                              alt={video.title || "Video"}
                              className="w-full h-full object-cover"
                              style={{ minHeight: "240px", maxHeight: "340px" }}
                            />
                          </div>
                          <div className="mt-2">
                            <p className="search_text line-clamp-2 text-left">
                              {video.title}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                              <Avatar className="w-[20px] h-[20px] border-2 border-white ">
                                <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                              <div className="mt-1 text-[14px] text-left text-[#bfbfbf] mb-1">
                                {video?.user?.name}
                              </div>
                            </div>

                            <div className="flex gap-1 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="17"
                                viewBox="0 0 19 17"
                                fill="none"
                                className="mt-[8px]"
                              >
                                <g filter="url(#filter0_d_3792_5241)">
                                  <path
                                    d="M12.0257 0.200195C10.993 0.200195 10.0888 0.6443 9.52515 1.39498C8.96152 0.6443 8.0573 0.200195 7.02456 0.200195C6.20248 0.201122 5.41433 0.528103 4.83303 1.1094C4.25174 1.6907 3.92475 2.47885 3.92383 3.30093C3.92383 6.80175 9.11455 9.63542 9.3356 9.75245C9.39387 9.78379 9.45899 9.8002 9.52515 9.8002C9.59131 9.8002 9.65643 9.78379 9.71469 9.75245C9.93575 9.63542 15.1265 6.80175 15.1265 3.30093C15.1255 2.47885 14.7986 1.6907 14.2173 1.1094C13.636 0.528103 12.8478 0.201122 12.0257 0.200195Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <filter
                                    id="filter0_d_3792_5241"
                                    x="0.723828"
                                    y="0.200195"
                                    width="17.6031"
                                    height="15.9996"
                                    filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB"
                                  >
                                    <feFlood
                                      flood-opacity="0"
                                      result="BackgroundImageFix"
                                    />
                                    <feColorMatrix
                                      in="SourceAlpha"
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      result="hardAlpha"
                                    />
                                    <feOffset dy="3.2" />
                                    <feGaussianBlur stdDeviation="1.6" />
                                    <feComposite
                                      in2="hardAlpha"
                                      operator="out"
                                    />
                                    <feColorMatrix
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in2="BackgroundImageFix"
                                      result="effect1_dropShadow_3792_5241"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in="SourceGraphic"
                                      in2="effect1_dropShadow_3792_5241"
                                      result="shape"
                                    />
                                  </filter>
                                </defs>
                              </svg>
                              <span className="like_count">
                                {video.like_count || 283}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                </div>
              </div>
              // <div className="grid grid-cols-2 gap-[8px] mt-2">
              //   {movies?.map((movie, index) => (
              //     <div key={index} className="h-full w-full overflow-hidden">
              //       <img
              //         src={movie?.preview_image}
              //         className="w-full h-auto object-cover"
              //       />
              //     </div>
              //   ))}
              // </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
