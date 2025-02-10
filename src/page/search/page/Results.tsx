import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setHistoryData } from "../slice/HistorySlice";
import back from "../../../assets/explore/back.svg";
import sc from "../../../assets/explore/sc.svg";
import loader from "../../home/vod_loader.gif";
import {
  useGetTabListQuery,
  useLazyGetSuggestionsQuery,
  usePostSearchMutation,
} from "@/store/api/search/searchApi";
import Header from "./Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoFeed from "@/page/home/components/VideoFeed";
import empty from "../../home/empty.png";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";

// import ImageWithPlaceholder from "../comp/imgPlaceholder";
import he from "he";
import personE from "../../../assets/explore/personE.svg";

// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";

interface ResultsProps {}

const Results: React.FC<ResultsProps> = ({}) => {
  const [tabs, setTabs] = useState([]);
  interface Tab {
    key: string;
    // Add other properties if needed
  }

  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  // const { data: TabsData } = useGetTabListQuery("");
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const dispatch = useDispatch();
  const [loadingTabs, setLoadingTabs] = useState(true); // Track tab loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [postSearch, { data, isLoading }] = usePostSearchMutation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions
  const [isFocused, setIsFocused] = useState(false); // Manage input focus
  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetSuggestionsQuery(); // Lazy query for autocomplete

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      postSearch({
        search: query,
        tab: activeTab?.key,
        page: currentPage,
      });
    }
  };

  useEffect(() => {
    postSearch({
      search: query,
      tab: "",
      page: currentPage,
    }).then((response) => {
      if (response?.data?.data?.orders) {
        setTabs(response.data.data.orders); // Store tabs separately
        setActiveTab(response.data.data.orders[0]); // Set first tab active
      }
      setLoadingTabs(false); // Tabs have loaded
    });
  }, []);

  useEffect(() => {
    if (!loadingTabs && activeTab) {
      postSearch({
        search: query,
        tab: activeTab?.key,
        page: currentPage,
      });
    }
  }, [activeTab, currentPage, loadingTabs]);

  useEffect(() => {
    if (data?.data?.list && !loadingTabs) {
      setMovies((prevMovies) =>
        currentPage === 1
          ? data.data?.list
          : [...prevMovies, ...data.data?.list]
      );
    }
  }, [data]);

  // useEffect(() => {
  //   if (data?.data) {
  //     setTabs(data?.data?.orders);
  //     setActiveTab(data?.data?.orders[0]);
  //   }
  // }, [data]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      handleSearch();
      setCurrentPage(1); // Reset to page 1 for a new query
    }
  };

  const noData = !data || data?.data?.list.length === 0;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        if (!isLoading && !noData) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  // Fetch autocomplete suggestions when the query changes
  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        triggerAutocomplete(query);
      }, 300); // Debounce to avoid too many API calls
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]); // Clear suggestions if query is empty
    }
  }, [query, triggerAutocomplete]);

  // Update suggestions when autocomplete data arrives
  useEffect(() => {
    if (autocompleteData) {
      setSuggestions(autocompleteData.data);
    }
  }, [autocompleteData]);

  // Handle form submit (trigger search)
  const onSearch = (suggestion: any) => {
    if (suggestion.trim()) {
      dispatch(setHistoryData({ data: suggestion.trim() }));
      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
      handleSearch();
      setCurrentPage(1); // Reset to page 1 for a new query
    }
  };

  // Handle suggestion click (trigger search with selected suggestion)
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Set the clicked suggestion as the query
    setSuggestions([]); // Clear suggestions after click
    onSearch(suggestion);
  };

  const highlightKeywords = (text: string, keyword: string) => {
    if (!keyword.trim()) return he.decode(text);
    const parts = he.decode(text).split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part: any, index: any) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="search_btn">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const calculateHeight = (width: number, height: number) => {
    // console.log(width,height)
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  function formatDuration(duration: any) {
    const hours = Math.floor(duration / 3600); // Get the hours
    const minutes = Math.floor((duration % 3600) / 60); // Get the remaining minutes
    const seconds = duration % 60; // Get the remaining seconds

    // Ensure all values are padded to 2 digits
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

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
    <div className="">
      <div className="fixed top-0 z-[99999] bg-[#15131c] w-full">
        {/* header */}
        <form
          onSubmit={handleSubmit}
          className="px-[16px] pb-[20px] pt-[20px] flex justify-between items-center gap-[10px]"
        >
          <img
            onClick={() => navigate("/search_overlay")}
            // className=" pt-[6px]"
            src={backButton}
            alt=""
          />
          {/* <FaAngleLeft size={22} onClick={() => navigate("/search_overlay")}/> */}

          <div className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]">
            <img src={sc} alt="" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
              placeholder="搜索影片"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks on suggestions
              className=" bg-transparent focus:outline-none text-[16px] font-[400] text-white w-full"
              type="text"
            />
            {query?.length > 0 && (
              <button
                type="button"
                className="cross-circle"
                onClick={() => setQuery("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path
                    d="M4 3.1668L6.9168 0.25L7.75 1.0832L4.8332 4L7.75 6.9168L6.9168 7.75L4 4.8332L1.0832 7.75L0.25 6.9168L3.1668 4L0.25 1.0832L1.0832 0.25L4 3.1668Z"
                    fill="white"
                    fill-opacity="0.8"
                  />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="search_btn w-[45px]">
            搜索
          </button>
        </form>
        {/* tabs */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className="mt-[150px] px-[16px]">
        {isLoading && currentPage === 1 ? (
          <div className=" flex justify-center items-center py-[200px]">
            <div className="heart">
              <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
            </div>
          </div>
        ) : (
          <>
            {movies?.length > 0 && (
              <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[10px]">
                <>
                  {movies?.map((card: any) => (
                    <div
                      onClick={() => {
                        setSelectedMovieId(card?.post_id);
                        setShowVideoFeed(true);
                      }}
                      key={card.post_id}
                      className="max-w-full pb-[12px] chinese_photo1 h-[325px]"
                    >
                      <div
                        // onClick={() => showDetailsVod(card)}
                        className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
                      >
                        <ImageWithPlaceholder
                          src={card?.preview_image}
                          alt={card.title || "Video"}
                          width={"100%"}
                          // height={240}
                          height={
                            card?.files[0]?.height &&
                            calculateHeight(
                              card?.files[0]?.width,
                              card?.files[0]?.height
                            )
                          }
                          className=" object-cover h-full w-full rounded-none"
                        />

                        <div className=" absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
                          <div className=" flex w-full  justify-between px-2">
                            <span className=" text-white text-[11px]  left-">
                              {card?.view_count} 次观看
                            </span>
                            <span className=" text-white text-[11px]  right-0">
                              {formatDuration(card?.files[0].duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="search_text font-cnFont px-[6px] line-clamp-2 text-left">
                          {card.title}
                        </p>
                      </div>
                      {/* <h1 className="text-white w-full text-[12px] font-[400] px-[6px] pt-[6px] leading-[20px] break-words">
                        {card.title.length > 50
                          ? `${card.title.slice(0, 50)}...`
                          : card.title}
                      </h1> */}
                      <div className=" flex w-full p-[6px] justify-between">
                        <div className=" flex justify-cente  items-center gap-[4px]">
                          {card.user.avatar ? (
                            <img
                              // onError={() => console.log("gg")}
                              className=" w-[20px] h-[20px] rounded-full"
                              src={card.user.avatar}
                              onError={(e) => (e.currentTarget.src = personE)}
                              alt=""
                            />
                          ) : (
                            <img
                              src={personE}
                              className=" w-[20px] h-[20px] rounded-full"
                              alt=""
                            />
                          )}
                          <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                            {card.user.name}
                            {/* {card?.files[0]?.width} & {card?.files[0]?.height} {} */}
                          </h1>
                        </div>
                        <div className=" flex justify-center items-center gap-[4px]">
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
                                <feComposite in2="hardAlpha" operator="out" />
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
                          {/* <FaHeart /> */}
                          <h1 className=" text-white text-[12px] font-[400] leading-[20px]">
                            {formatNumber(card?.like_count)}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>
              // <div className="flex gap-2 inner_div">
              //   {/* First Column */}
              //   <div className="flex flex-col gap-2 w-1/2">
              //     {movies
              //       .map((video, originalIndex) => ({ video, originalIndex })) // Preserve original index
              //       .filter((_, index) => index % 2 === 0) // Filter for the first column
              //       .map(
              //         (
              //           { video, originalIndex } // Map over filtered results
              //         ) => (
              //           <button
              //             key={originalIndex}
              //             className="cursor-pointer"
              // onClick={() => {
              //   setSelectedMovieId(video?.post_id);
              //   setShowVideoFeed(true);
              // }}
              //           >
              //             <div className="relative bg-search-img rounded-lg overflow-hidden">
              //               <ImageWithPlaceholder
              //                 src={video?.preview_image}
              //                 alt={video.title || "Video"}
              //                 width={"240px"}
              //                 height={"240px"}
              //                 className="lozad w-full h-full object-cover"
              //                 // style={{ minHeight: "240px", maxHeight: "340px" }}
              //               />
              //             </div>
              // <div className="mt-2">
              //   <p className="search_text font-cnFont line-clamp-2 text-left">
              //     {video.title}
              //   </p>
              // </div>
              //             <div className="flex justify-between items-center">
              //               <div className="flex gap-1 items-center">
              //                 {video?.user?.avatar ? (
              //                   <Avatar className="w-[20.25px] h-[20.25px] border-2 border-white ">
              //                     <AvatarImage src={video?.user?.avatar} />
              //                     <AvatarFallback>SM</AvatarFallback>
              //                   </Avatar>
              //                 ) : (
              //                   <Avatar className="w-[20.25px] p-3 bg-[#3a374d] flex justify-center items-center h-[20.25px] ">
              //                     <svg
              //                       xmlns="http://www.w3.org/2000/svg"
              //                       width="21"
              //                       height="30"
              //                       viewBox="0 0 21 30"
              //                       fill="none"
              //                     >
              //                       <path
              //                         fill-rule="evenodd"
              //                         clip-rule="evenodd"
              //                         d="M10.3206 17.5712C4.82551 17.5712 0.00585938 20.804 0.00585938 24.4875C0.00585938 29.2271 7.77035 29.2271 10.3206 29.2271C12.8709 29.2271 20.634 29.2271 20.634 24.4566C20.634 20.7885 15.8143 17.5712 10.3206 17.5712Z"
              //                         fill="white"
              //                       />
              //                       <path
              //                         fill-rule="evenodd"
              //                         clip-rule="evenodd"
              //                         d="M10.2666 14.4974H10.3102C14.0948 14.4974 17.1731 11.4191 17.1731 7.63443C17.1731 3.85117 14.0948 0.772888 10.3102 0.772888C6.52559 0.772888 3.4473 3.85117 3.4473 7.63162C3.43467 11.4036 6.49188 14.4834 10.2666 14.4974Z"
              //                         fill="white"
              //                       />
              //                     </svg>
              //                     {/* <AvatarFallback>SM</AvatarFallback> */}
              //                   </Avatar>
              //                 )}

              //                 <div className="mt-1 text-[14px] font-cnFont text-left text-[#bfbfbf] mb-1">
              //                   {video?.user?.name}
              //                 </div>
              //               </div>

              //               <div className="flex gap-1 items-center">
              // <svg
              //   xmlns="http://www.w3.org/2000/svg"
              //   width="19"
              //   height="17"
              //   viewBox="0 0 19 17"
              //   fill="none"
              //   className="mt-[8px]"
              // >
              //   <g filter="url(#filter0_d_3792_5241)">
              //     <path
              //       d="M12.0257 0.200195C10.993 0.200195 10.0888 0.6443 9.52515 1.39498C8.96152 0.6443 8.0573 0.200195 7.02456 0.200195C6.20248 0.201122 5.41433 0.528103 4.83303 1.1094C4.25174 1.6907 3.92475 2.47885 3.92383 3.30093C3.92383 6.80175 9.11455 9.63542 9.3356 9.75245C9.39387 9.78379 9.45899 9.8002 9.52515 9.8002C9.59131 9.8002 9.65643 9.78379 9.71469 9.75245C9.93575 9.63542 15.1265 6.80175 15.1265 3.30093C15.1255 2.47885 14.7986 1.6907 14.2173 1.1094C13.636 0.528103 12.8478 0.201122 12.0257 0.200195Z"
              //       fill="white"
              //     />
              //   </g>
              //   <defs>
              //     <filter
              //       id="filter0_d_3792_5241"
              //       x="0.723828"
              //       y="0.200195"
              //       width="17.6031"
              //       height="15.9996"
              //       filterUnits="userSpaceOnUse"
              //       color-interpolation-filters="sRGB"
              //     >
              //       <feFlood
              //         flood-opacity="0"
              //         result="BackgroundImageFix"
              //       />
              //       <feColorMatrix
              //         in="SourceAlpha"
              //         type="matrix"
              //         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              //         result="hardAlpha"
              //       />
              //       <feOffset dy="3.2" />
              //       <feGaussianBlur stdDeviation="1.6" />
              //       <feComposite
              //         in2="hardAlpha"
              //         operator="out"
              //       />
              //       <feColorMatrix
              //         type="matrix"
              //         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              //       />
              //       <feBlend
              //         mode="normal"
              //         in2="BackgroundImageFix"
              //         result="effect1_dropShadow_3792_5241"
              //       />
              //       <feBlend
              //         mode="normal"
              //         in="SourceGraphic"
              //         in2="effect1_dropShadow_3792_5241"
              //         result="shape"
              //       />
              //     </filter>
              //   </defs>
              // </svg>
              //                 <span className="like_count font-cnFont">
              //                   {video.like_count || 283}
              //                 </span>
              //               </div>
              //             </div>
              //           </button>
              //         )
              //       )}
              //   </div>

              //   {/* Second Column */}
              //   <div className="flex flex-col gap-2 w-1/2">
              //     {movies
              //       .map((video, originalIndex) => ({ video, originalIndex })) // Preserve original index
              //       .filter((_, index) => index % 2 !== 0) // Filter for the second column
              //       .map(
              //         (
              //           { video, originalIndex } // Map over filtered results
              //         ) => (
              //           <button
              //             key={originalIndex}
              //             className="cursor-pointer"
              //             onClick={() => {
              //               setSelectedMovieId(video?.post_id);
              //               setShowVideoFeed(true);
              //             }}
              //           >
              //             <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              //               <ImageWithPlaceholder
              //                 src={video?.preview_image}
              //                 alt={video.title || "Video"}
              //                 width={"240px"}
              //                 height={"240px"}
              //                 className="lozad w-full h-full object-cover"
              //                 // style={{ minHeight: "240px", maxHeight: "340px" }}
              //               />
              //             </div>
              //             <div className="mt-2">
              //               <p className="search_text line-clamp-2 text-left">
              //                 {video.title}
              //               </p>
              //             </div>
              //             <div className="flex justify-between items-center">
              //               <div className="flex gap-1 items-center">
              //                 {video?.user?.avatar ? (
              //                   <Avatar className="w-[20.25px] h-[20.25px] border-2 border-white ">
              //                     <AvatarImage src={video?.user?.avatar} />
              //                     <AvatarFallback>SM</AvatarFallback>
              //                   </Avatar>
              //                 ) : (
              //                   <Avatar className="w-[20.25px] p-3 bg-[#3a374d] flex justify-center items-center h-[20.25px] ">
              //                     <svg
              //                       xmlns="http://www.w3.org/2000/svg"
              //                       width="21"
              //                       height="30"
              //                       viewBox="0 0 21 30"
              //                       fill="none"
              //                     >
              //                       <path
              //                         fill-rule="evenodd"
              //                         clip-rule="evenodd"
              //                         d="M10.3206 17.5712C4.82551 17.5712 0.00585938 20.804 0.00585938 24.4875C0.00585938 29.2271 7.77035 29.2271 10.3206 29.2271C12.8709 29.2271 20.634 29.2271 20.634 24.4566C20.634 20.7885 15.8143 17.5712 10.3206 17.5712Z"
              //                         fill="white"
              //                       />
              //                       <path
              //                         fill-rule="evenodd"
              //                         clip-rule="evenodd"
              //                         d="M10.2666 14.4974H10.3102C14.0948 14.4974 17.1731 11.4191 17.1731 7.63443C17.1731 3.85117 14.0948 0.772888 10.3102 0.772888C6.52559 0.772888 3.4473 3.85117 3.4473 7.63162C3.43467 11.4036 6.49188 14.4834 10.2666 14.4974Z"
              //                         fill="white"
              //                       />
              //                     </svg>
              //                     {/* <AvatarFallback>SM</AvatarFallback> */}
              //                   </Avatar>
              //                 )}

              //                 <div className="mt-1 text-[14px] text-left text-[#bfbfbf] mb-1">
              //                   {video?.user?.name}
              //                 </div>
              //               </div>

              //               <div className="flex gap-1 items-center">
              //                 <svg
              //                   xmlns="http://www.w3.org/2000/svg"
              //                   width="19"
              //                   height="17"
              //                   viewBox="0 0 19 17"
              //                   fill="none"
              //                   className="mt-[8px]"
              //                 >
              //                   <g filter="url(#filter0_d_3792_5241)">
              //                     <path
              //                       d="M12.0257 0.200195C10.993 0.200195 10.0888 0.6443 9.52515 1.39498C8.96152 0.6443 8.0573 0.200195 7.02456 0.200195C6.20248 0.201122 5.41433 0.528103 4.83303 1.1094C4.25174 1.6907 3.92475 2.47885 3.92383 3.30093C3.92383 6.80175 9.11455 9.63542 9.3356 9.75245C9.39387 9.78379 9.45899 9.8002 9.52515 9.8002C9.59131 9.8002 9.65643 9.78379 9.71469 9.75245C9.93575 9.63542 15.1265 6.80175 15.1265 3.30093C15.1255 2.47885 14.7986 1.6907 14.2173 1.1094C13.636 0.528103 12.8478 0.201122 12.0257 0.200195Z"
              //                       fill="white"
              //                     />
              //                   </g>
              //                   <defs>
              //                     <filter
              //                       id="filter0_d_3792_5241"
              //                       x="0.723828"
              //                       y="0.200195"
              //                       width="17.6031"
              //                       height="15.9996"
              //                       filterUnits="userSpaceOnUse"
              //                       color-interpolation-filters="sRGB"
              //                     >
              //                       <feFlood
              //                         flood-opacity="0"
              //                         result="BackgroundImageFix"
              //                       />
              //                       <feColorMatrix
              //                         in="SourceAlpha"
              //                         type="matrix"
              //                         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              //                         result="hardAlpha"
              //                       />
              //                       <feOffset dy="3.2" />
              //                       <feGaussianBlur stdDeviation="1.6" />
              //                       <feComposite
              //                         in2="hardAlpha"
              //                         operator="out"
              //                       />
              //                       <feColorMatrix
              //                         type="matrix"
              //                         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              //                       />
              //                       <feBlend
              //                         mode="normal"
              //                         in2="BackgroundImageFix"
              //                         result="effect1_dropShadow_3792_5241"
              //                       />
              //                       <feBlend
              //                         mode="normal"
              //                         in="SourceGraphic"
              //                         in2="effect1_dropShadow_3792_5241"
              //                         result="shape"
              //                       />
              //                     </filter>
              //                   </defs>
              //                 </svg>
              //                 <span className="like_count">
              //                   {video.like_count || 283}
              //                 </span>
              //               </div>
              //             </div>
              //           </button>
              //         )
              //       )}
              //   </div>
              // </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <img
                  src={loader}
                  className="w-[50px] h-[50px]"
                  alt="Loading more"
                />
              </div>
            )}
            {data?.data?.list.length === 0 &&
              (currentPage === 1 ? (
                <div className={`flex justify-center items-center py-[200px]`}>
                  <div className="flex flex-col items-center">
                    <img src={empty} className="w-[80px]" alt="" />
                    <h1 className="text-center text-white/60">搜索结果为空</h1>
                  </div>
                </div>
              ) : (
                <div className={`flex justify-center items-center py-[20px]`}>
                  <div>
                    <h1 className="text-white/60">搜索结果为空</h1>
                  </div>
                </div>
              ))}
          </>
        )}
        {/* <div ref={observerRef} className="h-[1px]" /> */}
      </div>

      {isFocused && suggestions.length > 0 && (
        <ul className="fixed top-[60px] px-[16px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-black text-white z-[99999] overflow-y-auto">
          {suggestions.map((suggestion: any, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.title)}
              className="cursor-pointer gap-5 mb-4 flex items-center justify-between"
            >
              <div className="flex truncate gap-5 items-center">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.9521 9.53764C14.1523 8.90982 14.2603 8.24084 14.2603 7.54667C14.2603 3.93104 11.3293 1 7.71367 1C4.09804 1 1.16699 3.93104 1.16699 7.54667C1.16699 11.1623 4.09804 14.0934 7.71367 14.0934C9.43465 14.0934 11.0006 13.4293 12.1691 12.3433M12.267 12.44L14.8336 15"
                      stroke="#AAAAAA"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span className="truncate">
                  {highlightKeywords(suggestion?.title, query)}
                </span>
              </div>

              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M11 17V11M11 11H17M11 11L20.5 21"
                    stroke="white"
                    stroke-opacity="0.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;
