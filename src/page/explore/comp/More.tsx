// import { ChevronLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import more from "../../../assets/explore/more.png";
// import Loader from "../../../page/home/vod_loader.gif";
// import "../explore.css";
// import "../../home/home.css";
// import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";
// import { useDispatch, useSelector } from "react-redux";
// import { setDetails, setMoreTab } from "@/store/slices/exploreSlice";
// import VodDetails from "./VodDetails";
// import { paths } from "@/routes/paths";
// import InfiniteScroll from "react-infinite-scroll-component";
// import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
// import empty from "../../../page/home/empty.png";
// import personE from "../../../assets/explore/personE.svg";
// import VideoFeed from "@/page/home/components/VideoFeed";

// interface MoreProps {}

// const More: React.FC<MoreProps> = () => {
//   const [show, setshow] = useState<boolean>(false);
//   const { title, more_tab, tags } = useSelector((state: any) => state.explore);
//   const [selectedMovieId, setSelectedMovieId] = useState(null);
//   const [showVideoFeed, setShowVideoFeed] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [list, setList] = useState<any[]>([]);
//   const [filter, setFilter] = useState<any[]>([]);
//   const [customLoad, setCustomLoad] = useState(false);
//   const { data, isLoading, isFetching, refetch } = useGetExploreTagQuery({
//     order: more_tab ? more_tab : "created_at",
//     tag: title ? title : "Latest Drama",
//     page: page,
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     // window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [more_tab]);

//   useEffect(() => {
//     if (data?.data) {
//       setFilter(data?.data.filter);
//       setList((prev) => {
//         const newList = [...prev, ...data.data.list];
//         return newList.filter(
//           (item, index, self) =>
//             index === self.findIndex((t) => t.post_id === item.post_id) // Assuming `id` is unique
//         );
//       });
//       const loadedItems =
//         data?.pagination?.current_page * data?.pagination?.per_page;
//       setHasMore(loadedItems < data?.pagination?.total);
//       // console.log(loadedItems);
//       if (!more_tab) {
//         // console.log("gg");
//         dispatch(setMoreTab(filter[0]?.key));
//       }
//     } else {
//       setHasMore(false);
//     }
//   }, [data, dispatch, filter]);
//   // console.log(list)

//   const popularItems = Array.from({ length: 10 }, (_, i) => ({
//     title: `My Boss (2021) - ${i + 1}`,
//     views: 3685 + i * 10,
//     likes: 1245 + i * 5,
//   }));

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
//     }
//     return num;
//   };

//   const latestItems: any[] = []; // Empty for "Latest"

//   const renderItems = more_tab === "Popular" ? popularItems : latestItems; // Change to more_tab

//   const fetchMoreData = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   const showDetailsVod = (item: any) => {
//     // dispatch(setDetails(file));
//     // navigate("/vod_details");
//     setSelectedMovieId(item?.post_id);
//     setShowVideoFeed(true);
//   };

//   const handleTabChange = (ff: any) => {
//     if (ff.key === more_tab) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }
//     setCustomLoad(true);
//     dispatch(setMoreTab(ff.key));

//     // if (isFetching || isLoading) return;

//     setList([]); // Reset list when switching tabs
//     setPage(1); // Reset page number

//     setTimeout(() => {
//       setCustomLoad(false);
//     }, 500);
//   };

//   const calculateHeight = (width: number, height: number) => {
//     if (width > height) {
//       return 112; // Portrait
//     }
//     if (width < height) {
//       return 240; // Landscape
//     }
//     return 200;
//   };

//   const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
//     event.stopPropagation(); // Prevent triggering the parent click event
//     navigate(paths.getUserProfileId(userId));
//   };

//   // console.log(data?.data);
//   // console.log(more_tab);

//   // if (showVideoFeed && selectedMovieId) {
//   //   return (
//   //     <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
//   //       <VideoFeed
//   //         videos={list}
//   //         currentActiveId={selectedMovieId}
//   //         setShowVideoFeed={setShowVideoFeed}
//   //         query={"query"}
//   //       />
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="">
//       {showVideoFeed && selectedMovieId ? (
//         <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
//           <VideoFeed
//             setPage={setPage}
//             setVideos={setList}
//             videos={list}
//             currentActiveId={selectedMovieId}
//             setShowVideoFeed={setShowVideoFeed}
//             query={"搜索影片"}
//           />
//         </div>
//       ) : (
//         <></>
//       )}
//       <div className="px-[10px] flex flex-col relative min-h-scree bg-[#16131C] mx-auto">
//         {/* Header */}
//         <div className=" fixed z-[99] w-full bg-transparent bg-[#16131C]">
//           <div className="flex justify-center w-full py-[12px] bg-[#16131C] relative">
//             <ChevronLeft
//               onClick={() => navigate("/")}
//               className="rec_exp_more_btn px-[2px] fixed left-5 z-[999]"
//             />
//             <h1
//               // onClick={() => {
//               //   window.scrollTo({ top: 0, behavior: "smooth" });
//               // }}
//               className=" pr-[10px] text-white text-[18px] font-[500]"
//             >
//               {tags}
//             </h1>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-[8px] bg-[#16131C] pb-[12px]">
//             {filter?.map((ff: any, index) => (
//               <button
//                 key={index}
//                 className={`text-white text-[14px] font-[400] leading-[16px] px-[16px] py-[8px] ${
//                   more_tab === ff.key
//                     ? "more_tabs_buttons_active"
//                     : "more_tabs_buttons"
//                 }`}
//                 onClick={() => handleTabChange(ff)} // Update more_tab
//               >
//                 {ff.title}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* List */}
//         {data?.data?.list?.length === 0 && (
//           <div className=" mt-[80px]">
//             <div className={`flex justify-center items-center py-[200px]`}>
//               <div className="flex flex-col items-center">
//                 <img src={empty} className="w-[80px]" alt="" />
//                 <h1 className="text-center text-white/60">搜索结果为空</h1>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* {isFetching && (
//           <div className=" flex h-screen items-center justify-center w-screen py-[200px]">
//             <div className="">
//               <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
//             </div>
//           </div>
//         )} */}
//         <div className="py-[20px] flex flex-col gap-[20px] w-full mt-[60px]">
//           {isLoading || customLoad ? (
//             <div className=" flex justify-center w-screen py-[200px]">
//               <div className="">
//                 <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className=" grid grid-cols-2 relative gap-[6px]">
//                 {list?.map((item: any, index) => (
//                   <div
//                     onClick={() => showDetailsVod(item)}
//                     key={index}
//                     className="chinese_photo h-[320px] max-w-full relative pt-[20px]"
//                   >
//                     <div
//                       className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
//                       // onClick={() => showDetailsVod(item)}
//                     >
//                       <ImageWithPlaceholder
//                         src={item?.preview_image}
//                         alt={item.title || "Video"}
//                         width={"100%"}
//                         height={calculateHeight(
//                           item?.files[0]?.width,
//                           item?.files[0]?.height
//                         )}
//                         className=" object-cover h-full w-full rounded-none"
//                       />
//                     </div>
//                     <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
//                       {/* <h1 className="search_text font-cnFont px-[6px] line-clamp-2 text-left"> */}
//                       {item.title.length > 50
//                         ? `${item.title.slice(0, 50)}...`
//                         : item.title}
//                     </h1>
//                     <div className="  w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center ">
//                       <div className=" flex justify-center items-center gap-[4px]">
//                         {item.user?.avatar ? (
//                           <img
//                             className=" w-[20px] h-[20px] rounded-full"
//                             src={item.user.avatar}
//                             onError={(e) => (e.currentTarget.src = personE)}
//                             alt=""
//                           />
//                         ) : (
//                           <img
//                             src={personE}
//                             className="w-[20px] h-[20px] rounded-full"
//                             alt=""
//                           />
//                         )}
//                         <h1
//                           className=" text-[#888] text-[14px] font-[500] cursor-pointer hover:text-white"
//                           onClick={(e) =>
//                             navigateToUserProfile(item.user.id, e)
//                           }
//                         >
//                           {item.user.name}
//                         </h1>
//                       </div>
//                       <span className="flex gap-[5px] items-center">
//                         {/* <FaHeart /> */}
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="13"
//                           height="12"
//                           viewBox="0 0 13 12"
//                           fill="none"
//                         >
//                           <path
//                             d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
//                             stroke="#BBBBBB"
//                             stroke-width="0.8"
//                           />
//                         </svg>
//                         <h1 className=" text-[#888] text-[14px] font-[400] leading-[20px]">
//                           {formatNumber(item?.like_count)}
//                         </h1>
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 <InfiniteScroll
//                   className="py-[20px]"
//                   dataLength={list.length}
//                   next={fetchMoreData}
//                   hasMore={hasMore}
//                   loader={
//                     <div className=" flex justify-center w-screen absolute bottom-[-30px] left-[-20px]">
//                       <div className="">
//                         <img
//                           src={Loader}
//                           className="w-[70px] h-[70px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   }
//                   endMessage={
//                     <div className=" hidden bg-whit pt-20 justify-center items-center">
//                       <p className="py-10" style={{ textAlign: "center" }}>
//                         <b>No video yet!</b>
//                       </p>
//                     </div>
//                   }
//                 >
//                   <></>
//                 </InfiniteScroll>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default More;

import { ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import more from "../../../assets/explore/more.png";
import Loader from "../../../page/home/vod_loader.gif";
import "../explore.css";
import "../../home/home.css";
import { useGetExploreTagQuery } from "@/store/api/explore/exploreApi";
import { useDispatch, useSelector } from "react-redux";
import { setDetails, setMoreTab } from "@/store/slices/exploreSlice";
import VodDetails from "./VodDetails";
import { paths } from "@/routes/paths";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import empty from "../../../page/home/empty.png";
import personE from "../../../assets/explore/personE.svg";
import VideoFeed from "@/page/home/components/VideoFeed";
import Artplayer from "artplayer";
import Hls from "hls.js";
import LoadingAnimation from "@/page/search/comp/LoadingAnimation";

interface MoreProps {}

const More: React.FC<MoreProps> = () => {
  const [show, setshow] = useState<boolean>(false);
  const { title, more_tab, tags } = useSelector((state: any) => state.explore);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState<any[]>([]);
  const [customLoad, setCustomLoad] = useState(false);
  const { data, isLoading, isFetching, refetch } = useGetExploreTagQuery({
    order: more_tab ? more_tab : "created_at",
    tag: title ? title : "Latest Drama",
    page: page,
  });

  // Video player states
  const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
  const [playingVideos, setPlayingVideos] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);

  const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    window.scrollTo(0, 0);

    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [more_tab]);

  useEffect(() => {
    if (data?.data) {
      setFilter(data?.data.filter);
      setList((prev) => {
        const newList = [...prev, ...data.data.list];
        return newList.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.post_id === item.post_id) // Assuming `id` is unique
        );
      });
      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
      // console.log(loadedItems);
      if (!more_tab) {
        // console.log("gg");
        dispatch(setMoreTab(filter[0]?.key));
      }
    } else {
      setHasMore(false);
    }
  }, [data, dispatch, filter]);
  // console.log(list)

  const popularItems = Array.from({ length: 10 }, (_, i) => ({
    title: `My Boss (2021) - ${i + 1}`,
    views: 3685 + i * 10,
    likes: 1245 + i * 5,
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const latestItems: any[] = []; // Empty for "Latest"

  const renderItems = more_tab === "Popular" ? popularItems : latestItems; // Change to more_tab

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showDetailsVod = (item: any) => {
    // dispatch(setDetails(file));
    // navigate("/vod_details");
    setSelectedMovieId(item?.post_id);
    setShowVideoFeed(true);
  };

  const handleTabChange = (ff: any) => {
    if (ff.key === more_tab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCustomLoad(true);
    dispatch(setMoreTab(ff.key));

    // if (isFetching || isLoading) return;

    setList([]); // Reset list when switching tabs
    setPage(1); // Reset page number

    setTimeout(() => {
      setCustomLoad(false);
    }, 500);
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

  const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click event
    navigate(paths.getUserProfileId(userId));
  };

  // console.log(data?.data);
  // console.log(more_tab);

  // if (showVideoFeed && selectedMovieId) {
  //   return (
  //     <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
  //       <VideoFeed
  //         videos={list}
  //         currentActiveId={selectedMovieId}
  //         setShowVideoFeed={setShowVideoFeed}
  //         query={"query"}
  //       />
  //     </div>
  //   );
  // }

  const handleLongPress = (card: any) => {
    if (playingVideos[card.post_id]) return;
    if (!card?.preview?.url) return;

    // Pause any currently playing video
    if (activeLongPressCard) {
      const currentPlayer =
        artPlayerInstances.current[activeLongPressCard?.post_id];
      if (currentPlayer) {
        currentPlayer.muted = true;
        currentPlayer.pause();
        setPlayingVideos((prev) => ({
          ...prev,
          [activeLongPressCard.post_id]: false,
        }));
      }
    }

    if (card?.preview?.url) {
      initializePlayer(card);
    }
    setLoadingVideoId(card.post_id);
    setActiveLongPressCard(card);
  };

  const initializePlayer = (card: any) => {
    const container = videoPlayerRefs.current[card.post_id];
    if (!container) return;

    // Destroy previous instance if exists
    if (artPlayerInstances.current[card.post_id]) {
      artPlayerInstances.current[card.post_id]?.destroy();
    }

    const isM3u8 = card?.preview?.url?.includes(".m3u8");

    const options: Artplayer["Option"] = {
      container: container,
      url: card.preview.url,
      muted: true,
      autoplay: true,
      loop: true,
      isLive: false,
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      moreVideoAttr: {
        playsInline: true,
        preload: "auto" as const,
      },
      type: isM3u8 ? "m3u8" : "auto",
      customType: {
        m3u8: (videoElement: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoElement);
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoElement.src = url;
          }
        },
      },
      icons: {
        loading: `<div style="display:none"></div>`,
        state: `<div style="display:none"></div>`,
      },
    };

    try {
      const player = new Artplayer(options);
      artPlayerInstances.current[card.post_id] = player;

      player.on("ready", () => {
        player.play();
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
      });

      player.on("play", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
      });

      player.on("pause", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
      });

      player.on("video:playing", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
      });

      player.on("video:waiting", () => {
        setLoadingVideoId(card.post_id);
      });

      player.on("error", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
        setLoadingVideoId(null);
      });
    } catch (error) {
      setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
      console.error("Error initializing ArtPlayer:", error);
      setLoadingVideoId(null);
    }
  };

  const handleTouchStart = (card: any) => {
    if (loadingVideoId === card.post_id) return;
    if (playingVideos[card.post_id]) return;

    longPressTimer.current = setTimeout(() => {
      handleLongPress(card);
    }, 500); // 500ms threshold for long press
  };

  // Clean up all players when component unmounts
  useEffect(() => {
    return () => {
      Object.values(artPlayerInstances.current).forEach((player) => {
        player?.destroy();
      });
      artPlayerInstances.current = {};

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }

      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="">
      {showVideoFeed && selectedMovieId ? (
        <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
          <VideoFeed
            setPage={setPage}
            setVideos={setList}
            videos={list}
            currentActiveId={selectedMovieId}
            setShowVideoFeed={setShowVideoFeed}
            query={"搜索影片"}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="px-[10px] flex flex-col relative min-h-scree bg-[#16131C] mx-auto">
        {/* Header */}
        <div className=" fixed z-[99] w-full bg-transparent bg-[#16131C]">
          <div className="flex justify-center w-full py-[12px] bg-[#16131C] relative">
            <ChevronLeft
              onClick={() => navigate("/")}
              className="rec_exp_more_btn px-[2px] fixed left-5 z-[999]"
            />
            <h1
              // onClick={() => {
              //   window.scrollTo({ top: 0, behavior: "smooth" });
              // }}
              className=" pr-[10px] text-white text-[18px] font-[500]"
            >
              {tags}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-[8px] bg-[#16131C] pb-[12px]">
            {filter?.map((ff: any, index) => (
              <button
                key={index}
                className={`text-white text-[14px] font-[400] leading-[16px] px-[16px] py-[8px] ${
                  more_tab === ff.key
                    ? "more_tabs_buttons_active"
                    : "more_tabs_buttons"
                }`}
                onClick={() => handleTabChange(ff)} // Update more_tab
              >
                {ff.title}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {data?.data?.list?.length === 0 && (
          <div className=" mt-[80px]">
            <div className={`flex justify-center items-center py-[200px]`}>
              <div className="flex flex-col items-center">
                <img src={empty} className="w-[80px]" alt="" />
                <h1 className="text-center text-white/60">搜索结果为空</h1>
              </div>
            </div>
          </div>
        )}
        {/* {isFetching && (
          <div className=" flex h-screen items-center justify-center w-screen py-[200px]">
            <div className="">
              <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
            </div>
          </div>
        )} */}
        <div className="py-[20px] flex flex-col gap-[20px] w-full mt-[60px]">
          {isLoading || customLoad ? (
            <div className=" flex justify-center w-screen py-[200px]">
              <div className="">
                <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
              </div>
            </div>
          ) : (
            <>
              <div className=" grid grid-cols-2 relative gap-[6px]">
                {list?.map((item: any, index) => (
                  <div
                    key={index}
                    className="chinese_photo h-[320px] max-w-full relative pt-[20px]"
                  >
                    <div className="w-full h-[2px] relative">
                      <LoadingAnimation
                        loadingVideoId={loadingVideoId}
                        postId={item?.post_id}
                      />
                    </div>

                    <div
                      className="relative flex justify-center items-center bg-[#010101] rounded-[4px] overflow-hidden h-[240px]"
                      onClick={() => showDetailsVod(item)}
                      onTouchStart={() => handleTouchStart(item)}
                    >
                      {/* Video Player */}
                      <div
                        ref={(el) =>
                          (videoPlayerRefs.current[item.post_id] = el)
                        }
                        className="w-full h-full object-cover rounded-none"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 1,
                          backgroundColor: "#000",
                          opacity:
                            activeLongPressCard?.post_id === item.post_id &&
                            loadingVideoId !== item.post_id
                              ? 1
                              : 0,
                          transition: "opacity 1s ease",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Image */}
                      <ImageWithPlaceholder
                        src={item?.preview_image}
                        alt={item.title || "Video"}
                        className="object-cover h-full w-full rounded-none"
                        style={{
                          opacity:
                            activeLongPressCard?.post_id === item.post_id &&
                            loadingVideoId !== item.post_id
                              ? 0
                              : 1,
                          transition: "opacity 1s ease",
                        }}
                      />
                    </div>
                    {/* <div
                      className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
                      // onClick={() => showDetailsVod(item)}
                    >
                      <ImageWithPlaceholder
                        src={item?.preview_image}
                        alt={item.title || "Video"}
                        width={"100%"}
                        height={calculateHeight(
                          item?.files[0]?.width,
                          item?.files[0]?.height
                        )}
                        className=" object-cover h-full w-full rounded-none"
                      />
                    </div> */}
                    <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
                      {/* <h1 className="search_text font-cnFont px-[6px] line-clamp-2 text-left"> */}
                      {item.title.length > 50
                        ? `${item.title.slice(0, 50)}...`
                        : item.title}
                    </h1>
                    <div className="  w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center ">
                      <div className=" flex justify-center items-center gap-[4px]">
                        {item.user?.avatar ? (
                          <img
                            className=" w-[20px] h-[20px] rounded-full"
                            src={item.user.avatar}
                            onError={(e) => (e.currentTarget.src = personE)}
                            alt=""
                          />
                        ) : (
                          <img
                            src={personE}
                            className="w-[20px] h-[20px] rounded-full"
                            alt=""
                          />
                        )}
                        <h1
                          className=" text-[#888] text-[14px] font-[500] cursor-pointer hover:text-white"
                          onClick={(e) =>
                            navigateToUserProfile(item.user.id, e)
                          }
                        >
                          {item.user.name}
                        </h1>
                      </div>
                      <span className="flex gap-[5px] items-center">
                        {/* <FaHeart /> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="12"
                          viewBox="0 0 13 12"
                          fill="none"
                        >
                          <path
                            d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
                            stroke="#BBBBBB"
                            stroke-width="0.8"
                          />
                        </svg>
                        <h1 className=" text-[#888] text-[14px] font-[400] leading-[20px]">
                          {formatNumber(item?.like_count)}
                        </h1>
                      </span>
                    </div>
                  </div>
                ))}
                <InfiniteScroll
                  className="py-[20px]"
                  dataLength={list.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className=" flex justify-center w-screen absolute bottom-[-30px] left-[-20px]">
                      <div className="">
                        <img
                          src={Loader}
                          className="w-[70px] h-[70px]"
                          alt="Loading"
                        />
                      </div>
                    </div>
                  }
                  endMessage={
                    <div className=" hidden bg-whit pt-20 justify-center items-center">
                      <p className="py-10" style={{ textAlign: "center" }}>
                        <b>No video yet!</b>
                      </p>
                    </div>
                  }
                >
                  <></>
                </InfiniteScroll>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default More;
