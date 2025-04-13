import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { paths } from "@/routes/paths";

// import ImageWithPlaceholder from "../comp/imgPlaceholder";
import he from "he";
import personE from "../../../assets/explore/personE.svg";

// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import { decryptImage } from "@/utils/imageDecrypt";

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
  // const { data: filter } = useGetConfigQuery({});
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [postSearch, { data, isLoading }] = usePostSearchMutation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions
  const [isFocused, setIsFocused] = useState(false); // Manage input focus
  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetSuggestionsQuery(); // Lazy query for autocomplete
  const [decryptedAvatars, setDecryptedAvatars] = useState<{
    [key: string]: string;
  }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleMoreRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);
  const scrollPositionRef = useRef(0);

  // const scrollPositions = useSelector((state: any) => state.scroll.positions);
  // const location = useLocation();

  // const res = filter?.data?.post_filter;
  // const firstKey = res ? Object.keys(res)[0] : null;

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

  // Add this state
  const [videoFeedHistoryState, setVideoFeedHistoryState] = useState(false);

  // Modify your video click handler
  const handleVideoClick = (postId: any) => {
    // Save scroll position
    const scrollY = window.scrollY;

    // Push new history state
    window.history.pushState(
      {
        isVideoFeed: true,
        scrollY,
      },
      ""
    );
    scrollPositionRef.current = window.scrollY;
    setSelectedMovieId(postId);
    setShowVideoFeed(true);
    setVideoFeedHistoryState(true);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (videoFeedHistoryState && !event.state) {
        setShowVideoFeed(false);
        setVideoFeedHistoryState(false);

        setTimeout(() => {
          if (event.state?.scrollY) {
            window.scrollTo(0, event.state?.scrollY);
          }
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []); // Empty dependency array means this runs once on mount

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

  // // Fetch autocomplete suggestions when the query changes
  // useEffect(() => {
  //   if (query.trim()) {
  //     const timer = setTimeout(() => {
  //       triggerAutocomplete({ query, page });
  //     }, 300); // Debounce to avoid too many API calls
  //     return () => clearTimeout(timer);
  //   } else {
  //     setSuggestions([]); // Clear suggestions if query is empty
  //   }
  // }, [query, triggerAutocomplete]);

  // // Update suggestions when autocomplete data arrives
  // useEffect(() => {
  //   if (autocompleteData) {
  //     setSuggestions(autocompleteData.data);
  //   }
  // }, [autocompleteData]);

  useEffect(() => {
    if (query.trim()) {
      // Reset the page to 1 when query changes
      setPage(1);

      const timer = setTimeout(() => {
        triggerAutocomplete({ query, page: 1 }); // Always pass page as 1
      }, 300); // Debounce to avoid too many API calls
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]); // Clear suggestions if query is empty
    }
  }, [query, triggerAutocomplete]);

  useEffect(() => {
    if (page !== 1 && query.trim()) {
      const timer = setTimeout(() => {
        triggerAutocomplete({ query, page }); // Call API with the updated page
      }, 300); // Debounce for API calls
      return () => clearTimeout(timer);
    }
  }, [page, query, triggerAutocomplete]);

  useEffect(() => {
    if (autocompleteData) {
      if (page === 1) {
        setSuggestions(autocompleteData.data);
      } else {
        setSuggestions((prevSuggestions) => [
          ...prevSuggestions,
          ...autocompleteData.data, // Append new suggestions to the existing ones
        ]);
      }
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
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const highlightKeywords = (text: string, keyword: string) => {
    if (!keyword.trim()) return he.decode(text);
    const safeKeyword = escapeRegExp(keyword); // Escape special chars
    const parts = he.decode(text).split(new RegExp(`(${safeKeyword})`, "gi"));

    return parts.map((part: string, index: number) =>
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

  useEffect(() => {
    const decryptAvatar = async (avatarUrl: string, userId: string) => {
      if (!avatarUrl.endsWith(".txt")) {
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: avatarUrl }));
        return;
      }

      try {
        const decryptedUrl = await decryptImage(avatarUrl);
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: decryptedUrl }));
      } catch (error) {
        console.error("Error decrypting avatar:", error);
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: "" }));
      }
    };

    movies.forEach((movie) => {
      if (movie.user.avatar) {
        decryptAvatar(movie.user.avatar, movie.user.id);
      }
    });
  }, [movies]);

  const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click event
    navigate(paths.getUserProfileId(userId));
  };

  // Handle Load More button click
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page number to fetch more results
  };

  useEffect(() => {
    const bodyElement = document.querySelector("body");

    if (suggestions.length > 0 && isFocused) {
      if (bodyElement) {
        bodyElement.style.overflow = "hidden";
      }
    } else {
      if (bodyElement) {
        bodyElement.style.overflow = "auto";
      }
    }
  }, [isFocused, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideAListItem = listRef.current.some(
        (ref) => ref && ref.contains(target)
      );

      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        !clickedInsideAListItem &&
        (!handleMoreRef.current || !handleMoreRef.current.contains(target))
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleVideoClick = (postId: any) => {
  //   // Save current scroll position before showing VideoFeed
  //   scrollPositionRef.current = window.scrollY;
  //   setSelectedMovieId(postId);
  //   setShowVideoFeed(true);
  // };

  // if (showVideoFeed && selectedMovieId) {
  //   return (
  //     <VideoFeed
  //       setVideos={setMovies}
  //       videos={movies}
  //       currentActiveId={selectedMovieId}
  //       setShowVideoFeed={(value: any) => {
  //         setShowVideoFeed(value);
  //         if (!value) {
  //           // Restore scroll position when closing VideoFeed
  //           setTimeout(() => {
  //             window.scrollTo(0, scrollPositionRef.current);
  //           }, 50);
  //         }
  //       }}
  //       query={query}
  //     />
  //   );
  // }

  return (
    <div className="">
      {showVideoFeed && selectedMovieId && (
        <VideoFeed
          search={true}
          setVideos={setMovies}
          videos={movies}
          currentActiveId={selectedMovieId}
          setShowVideoFeed={(value: any) => {
            setShowVideoFeed(value);
            if (!value) {
              setTimeout(() => {
                window.scrollTo(0, scrollPositionRef.current);
              }, 50);
            }
          }}
          query={query}
        />
      )}

      <div
        style={{
          display: showVideoFeed ? "none" : "block",
        }}
      >
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
                ref={inputRef}
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

        <div className="mt-[130px] px-[8px]">
          {isLoading && currentPage === 1 ? (
            <div className=" flex justify-center items-center py-[200px]">
              <div className="heart">
                <img
                  src={loader}
                  className="w-[100px] h-[100px]"
                  alt="Loading"
                />
              </div>
            </div>
          ) : (
            <>
              {movies?.length > 0 && (
                <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[8px]">
                  <>
                    {movies?.map((card: any) => (
                      <div
                        onClick={() => handleVideoClick(card?.post_id)}
                        key={card.post_id}
                        className="max-w-full pb-[12px] chinese_photo  h-[325px]"
                      >
                        <div
                          // onClick={() => showDetailsVod(card)}
                          className=" relative flex justify-center  items-center bg-[#010101] rounded-[4px] overflow-hidden  h-[240px]"
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
                            className="object-cover h-full w-full rounded-none"
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
                                className=" w-[20px] h-[20px] rounded-full"
                                src={
                                  decryptedAvatars[card.user.id] ||
                                  card.user.avatar
                                }
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
                            <h1
                              className=" text-white text-[12px] font-[400] leading-[20px] cursor-pointer hover:text-purple-300"
                              onClick={(e) =>
                                navigateToUserProfile(card.user.id, e)
                              }
                            >
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
              )}

              {isLoading && data?.data?.list?.length !== 1 && <div
                className="fex justify-center items-center py-4"
              >
                <img
                  src={loader}
                  className="w-[50px] h-[50px] m-auto"
                  alt="Loading more"
                />
              </div>}
              {data?.data?.list.length === 0 &&
                (currentPage === 1 ? (
                  <div
                    className={`flex justify-center items-center py-[200px]`}
                  >
                    <div className="flex flex-col items-center">
                      <img src={empty} className="w-[80px]" alt="" />
                      <h1 className="text-center text-white/60">
                        搜索结果为空
                      </h1>
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

        {query.length > 0 && isFocused && suggestions.length > 0 && (
          <ul className="fixed top-[60px] px-[16px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-[#16131C] text-white z-[99999] overflow-y-auto">
            {suggestions.map((suggestion: any, index) => (
              <li
                ref={(el) => (listRef.current[index] = el)}
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
            {autocompleteData?.pagination?.current_page <
              autocompleteData?.pagination?.last_page && (
              <li className="flex justify-center mt-4">
                <button
                  ref={handleMoreRef}
                  onClick={handleLoadMore}
                  className="text-[#888] text-[14px] py-2 px-6 rounded"
                >
                  点击加载更多
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Results;
