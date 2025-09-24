// this is using @tanstack/react-virtual
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useVirtualizer, defaultRangeExtractor } from "@tanstack/react-virtual";
import { useGetConfigQuery, usePostCommentMutation } from "../services/homeApi";
// import Player from "./Player";
// import VideoSidebar from "./VideoSidebar";
import Top20Movies from "./Top20Movies";
import { useDispatch, useSelector } from "react-redux";
import FeedFooter from "./FeedFooter";
import { useNavigate } from "react-router-dom";
// import SearchPlayer from "./SearchPlayer";
import HeartCount from "./Heart";
// import VideoContainer from "./VideoContainer";
// import { setVideos } from "../services/videosSlice";
import { showToast } from "../services/errorSlice";
import Ads from "./Ads";
import loader from "../vod_loader.gif";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import sc from "../../../assets/explore/sc.svg";
import VideoContainerFeed from "./VideoContainerFeed";
// import ShowHeartCom from "./ShowHeartCom";
// import CountdownCircle from "./CountdownCircle";
// import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { decryptImage } from "@/utils/imageDecrypt";
import PreventSwipeBack from "@/components/shared/PreventSwipeBack";
import { AnimatePresence, motion } from "framer-motion";

const VideoFeedVirtual = ({
  videos,
  currentActiveId,
  setShowVideoFeed,
  query,
  setVideos,
  setPage,
  search = false,
}: {
  videos: any;
  currentActiveId: any;
  setShowVideoFeed: any;
  query: any;
  setPage: any;
  setVideos: any;
  search: any;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [currentActivePost, setCurrentActivePost] =
    useState<any>(currentActiveId); // Active post ID

  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const { data: config } = useGetConfigQuery({});
  const user = useSelector((state: any) => state.persist.user);
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);

  const [postComment] = usePostCommentMutation();

  const navigate = useNavigate();
  const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
  const abortControllerRef = useRef<AbortController[]>([]); // Array to store AbortControllers
  const videoData = useRef<any[]>([]); // Array to store AbortControllers
  const indexRef = useRef(0); // Track the current active video index
  const [isDecrypting, setIsDecrypting] = useState(true);

  // Map video id -> index for fast lookup
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    videosToRender.forEach((video, i) => map.set(video.post_id, i));
    return map;
  }, [videosToRender]);

  // Get start index ONLY when videos are fully loaded
  const startIndex = useMemo(() => {
    if (!currentActiveId || !videosToRender.length || isDecrypting) return 0;
    const index = indexById.get(currentActiveId) ?? 0;
    return Math.max(0, Math.min(index, videosToRender.length - 1));
  }, [currentActiveId, indexById, videosToRender.length, isDecrypting]);

  const didJumpRef = useRef(false);
  const isVideosReady = !isDecrypting && videosToRender.length > 0;
  const [isPositioning, setIsPositioning] = useState(false);
  const [hasPositioned, setHasPositioned] = useState(false);

  // Show loading while deciding which video to play
  const isDecidingVideo = isVideosReady && !hasPositioned;

  // Custom range extractor for first-paint readiness
  const rangeExtractor = useCallback(
    (range: any) => {
      const base = defaultRangeExtractor(range);

      // On first paint, ensure ±5 items around startIndex are rendered
      if (
        !didJumpRef.current &&
        isVideosReady &&
        startIndex != null &&
        startIndex > 0
      ) {
        const pad = 5; // render ±5 around the target item on first paint
        const extraStart = Math.max(0, startIndex - pad);
        const extraEnd = Math.min(videosToRender.length - 1, startIndex + pad);
        const extra = Array.from(
          { length: extraEnd - extraStart + 1 },
          (_, i) => extraStart + i
        );
        return Array.from(new Set([...base, ...extra])).sort((a, b) => a - b);
      }

      return base;
    },
    [startIndex, videosToRender.length, isVideosReady]
  );

  // Calculate initial offset ONLY when videos are ready
  const initialOffset = useMemo(() => {
    if (isVideosReady && startIndex > 0) {
      return startIndex * window.innerHeight;
    }
    return 0;
  }, [startIndex, isVideosReady]);

  const virtualizer = useVirtualizer({
    count: videosToRender.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight, // Each video is roughly screen height
    overscan: 5, // Render 5 items before/after visible area for smoother scrolling
    getItemKey: (index) => videosToRender[index]?.post_id ?? index,
    rangeExtractor,
    scrollMargin: 0,
    horizontal: false,
    // Pre-position to the target video for instant jump ONLY when ready
    ...(initialOffset > 0 ? { initialOffset } : {}),
  });

  // Handle scrolling to target video ONLY when videos are fully ready
  useLayoutEffect(() => {
    if (!isVideosReady) return;

    // Use scrollToIndex for precise positioning
    if (
      !didJumpRef.current &&
      startIndex >= 0 &&
      startIndex < videosToRender.length
    ) {
      console.log(
        `🎯 Scrolling to video at index ${startIndex} for currentActiveId: ${currentActiveId}`
      );
      console.log(`📊 Total videos: ${videosToRender.length}`);
      console.log(`🎬 Target video:`, videosToRender[startIndex]);

      // Show loading only if we need to jump (not first video)
      if (startIndex > 0) {
        setIsPositioning(true);
      }

      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        // Ensure the parent container is scrollable
        if (parentRef.current) {
          parentRef.current.style.overflow = "auto";
          parentRef.current.style.height = "100vh";
        }

        virtualizer.scrollToIndex(startIndex, {
          align: "start",
          behavior: "auto",
        });
        didJumpRef.current = true;
        setHasPositioned(true);

        // Force a measure to ensure virtualizer knows the correct positions
        virtualizer.measure();

        // Hide loading after positioning is complete
        if (startIndex > 0) {
          setTimeout(() => {
            setIsPositioning(false);
          }, 200);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [startIndex, isVideosReady, virtualizer, videosToRender.length]);

  // Reset state when currentActiveId changes
  useEffect(() => {
    if (currentActiveId) {
      // Reset all positioning state
      didJumpRef.current = false;
      setIsPositioning(false);
      setHasPositioned(false);

      // Force the virtualizer to recalculate
      virtualizer.measure();
    }
  }, [currentActiveId]);
  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

  // Infinite loading logic - trigger when near the end
  useEffect(() => {
    const virtualItems = virtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index >= videosToRender.length - 4) {
      // Load more when 4 items from the end
      setPage((prev: any) => prev + 1);
    }
  }, [virtualizer.getVirtualItems(), videosToRender.length, setPage]);

  // Track currently active video based on scroll position
  useEffect(() => {
    const virtualItems = virtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    // Find the video that's most visible (closest to center of viewport)
    const viewportCenter =
      (virtualizer.scrollElement?.scrollTop || 0) + window.innerHeight / 2;
    let closestVideo = virtualItems[0];
    let closestDistance = Math.abs(
      closestVideo.start + closestVideo.size / 2 - viewportCenter
    );

    virtualItems.forEach((item) => {
      const itemCenter = item.start + item.size / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestVideo = item;
      }
    });

    const activeVideo = videosToRender[closestVideo.index];
    if (activeVideo && activeVideo.post_id !== currentActivePost) {
      setCurrentActivePost(activeVideo.post_id);
    }
  }, [virtualizer.getVirtualItems(), videosToRender, currentActivePost]);

  // Add at the top of your Home component
  const decryptionCache = useRef(new Map<string, string>());

  // Add this utility function inside your Home component
  const decryptThumbnail = async (thumbnail: string): Promise<string> => {
    if (!thumbnail) return "";

    // Check cache first
    if (decryptionCache.current.has(thumbnail)) {
      return decryptionCache.current.get(thumbnail) || "";
    }

    // If it's not a .txt file, cache and return as-is
    if (!thumbnail.endsWith(".txt")) {
      decryptionCache.current.set(thumbnail, thumbnail);
      return thumbnail;
    }

    try {
      const decryptedUrl = await decryptImage(thumbnail);
      decryptionCache.current.set(thumbnail, decryptedUrl);
      return decryptedUrl;
    } catch (error) {
      console.error("Error decrypting thumbnail:", error);
      return "";
    }
  };

  useEffect(() => {
    if (videos.length > 0) {
      let initialVideos = [...videos];

      try {
        const run = async () => {
          const videosWithDecryptedPreviews = await Promise.all(
            initialVideos.map(async (video: any) => ({
              ...video,
              decryptedPreview: await decryptThumbnail(video.preview_image),
            }))
          );
          setVideosToRender(videosWithDecryptedPreviews);
          setIsDecrypting(false);
        };

        run();
      } catch (error) {}

      // setVideosToRender(firstThreeVideos);
    }
  }, [videos, currentActiveId]); // Add currentActiveId as a dependency

  // useEffect(() => {
  //   if (!start) {
  //     const initialVideos = videos.slice(0, videosPerLoad) || [];

  //     if (initialVideos.length > 1) {
  //       setVideosToRender(initialVideos);
  //       setStart(true);
  //     }
  //   }
  // }, [videos]); // Runs only once on mount

  useEffect(() => {
    const handlePopState = () => {
      setShowVideoFeed(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (currentActivePost) {
      // Reset state when the active post changes
      setCountdown(3);
      setCountNumber(0);
    }
  }, [currentActivePost]);

  if (topmovies) {
    return <Top20Movies setTopMovies={setTopMovies} />;
  }

  const handleBack = () => {
    setShowVideoFeed(false);
    // Restore scroll position after a small delay to ensure component has rendered
  };

  const handleComment = async (post_id: { post_id: any }) => {
    if (user?.token) {
      if (!content.trim()) return;

      try {
        // Get device information
        const deviceInfo = getDeviceInfo();

        const response = await postComment({
          post_id: post_id, // Assuming all comments belong to the same post
          content: content,
          device: deviceInfo.deviceName,
          app_version: deviceInfo.appVersion,
        }).unwrap();
        setContent("");
        dispatch(
          showToast({
            message:
              (response as any)?.message || "Comment posted successfully",
            type: "success",
          })
        );
      } catch (error: any) {
        dispatch(
          showToast({
            message: error?.data?.message || "Failed to post comment",
            type: "error",
          })
        );
        console.error("Failed to post reply:", error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleSearch = () => {
    navigate("/search_overlay");
  };

  // const sendEventToNative = (name: string, text: any) => {
  //   if (
  //     (window as any).webkit &&
  //     (window as any).webkit.messageHandlers &&
  //     (window as any).webkit.messageHandlers.jsBridge
  //   ) {
  //     (window as any).webkit.messageHandlers.jsBridge.postMessage({
  //       eventName: name,
  //       value: text,
  //     });
  //   }
  // };

  // const handleFullscreen = (video: any) => {
  //   sendEventToNative("beabox_fullscreen", {
  //     post_id: video?.post_id,
  //     like_api_url: `${import.meta.env.VITE_API_URL}/post/like`,
  //     token: `Bearer ${user?.token}`,
  //     video_url: video?.files[0].resourceURL,
  //     share_link: config?.data?.share_link,
  //     title: video.title,
  //     like_count: video?.like_count,
  //     is_like: video?.is_liked,
  //   });
  // };

  // if (isOpen) {
  //   return ;
  // }

  return (
    <>
      <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="app bg-black">
        {!search && <PreventSwipeBack />}

        {isDecrypting ? (
          <div className="app bg-[#16131C]">
            <div
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div className="heart">
                <img
                  src={loader}
                  className="w-[100px] h-[100px]"
                  alt="Loading"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {(isPositioning || isDecidingVideo) && (
              <div className="app bg-[#16131C] absolute inset-0 z-[10000]">
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div className="heart">
                    <img
                      src={loader}
                      className="w-[100px] h-[100px]"
                      alt="Loading"
                    />
                  </div>
                </div>
              </div>
            )}
            <div
              ref={parentRef}
              className={`app__videos ${isOpen ? "opacity-50" : ""}`}
              style={{
                pointerEvents: isOpen ? "none" : "auto",
                height: "100vh",
                overflow: "auto",
              }}
            >
              <AnimatePresence>
                {!hideBar && !hideNew && (
                  <motion.div
                    className="fixed top-3 left-0  flex gap-2 items-center w-full z-[9999]"
                    initial={{ y: "-100%", opacity: 0 }} // Starts above (negative Y)
                    animate={{ y: "0", opacity: 1 }} // Slides down to normal position
                    exit={{ y: "-100%", opacity: 0 }} // Exits upward
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                  >
                    <button className="p-3" onClick={handleBack}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="none"
                      >
                        <path
                          d="M8.95748 0.326623C8.85923 0.243209 8.74251 0.17703 8.61401 0.131875C8.48551 0.0867197 8.34775 0.0634766 8.20863 0.0634766C8.06951 0.0634766 7.93175 0.0867197 7.80325 0.131875C7.67475 0.17703 7.55803 0.243209 7.45978 0.326623L0.428239 6.28126C0.349798 6.34756 0.287565 6.4263 0.245104 6.51298C0.202642 6.59967 0.180786 6.69259 0.180786 6.78644C0.180786 6.88029 0.202642 6.97321 0.245104 7.0599C0.287565 7.14658 0.349798 7.22533 0.428239 7.29162L7.45978 13.2463C7.8744 13.5974 8.54286 13.5974 8.95748 13.2463C9.37209 12.8951 9.37209 12.3291 8.95748 11.9779L2.83132 6.78286L8.96594 1.58777C9.37209 1.24382 9.37209 0.670574 8.95748 0.326623Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    <div className="relative flex-1 mr-5">
                      <div className="absolute top-2 left-3">
                        <img src={sc} alt="" />
                      </div>
                      <input
                        className="feed-input w-full pl-[45px] py-[8px]"
                        placeholder={query}
                        onClick={handleSearch}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const video = videosToRender[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      data-post-id={video?.post_id}
                      ref={virtualizer.measureElement}
                      className="video1 pb-[70px]"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      {video?.file_type !== "video" ? (
                        <a href={video?.ads_info?.jump_url} target="_blank">
                          <img
                            src={video?.files[0]?.resourceURL}
                            alt=""
                            className="h-full w-full"
                          />
                        </a>
                      ) : (
                        <VideoContainerFeed
                          // refetchUser={refetchUser}
                          setVideosData={setVideos}
                          setrenderVideos={setVideosToRender}
                          videoData={videoData}
                          indexRef={indexRef}
                          abortControllerRef={abortControllerRef}
                          container={parentRef.current}
                          width={width}
                          height={height}
                          status={false}
                          countNumber={countNumber}
                          video={video}
                          setCountNumber={setCountNumber}
                          config={config}
                          countdown={countdown}
                          setWidth={setWidth}
                          setHeight={setHeight}
                          setHearts={setHearts}
                          setCountdown={setCountdown}
                          // setShowHeart={setShowHeart}
                          // coin={profile?.coins}
                        />
                      )}

                      {video?.type !== "ads" &&
                        video?.type !== "ads_virtual" && (
                          <FeedFooter
                            badge={video?.user?.badge}
                            id={video?.user?.id}
                            tags={video?.tag}
                            title={video?.title}
                            username={video?.user?.name}
                            city={video?.city}
                          />
                        )}

                      {(video?.type === "ads" ||
                        video?.type === "ads_virtual") && (
                        <Ads ads={video?.ads_info} type={video?.type} />
                      )}

                      {hearts.map((id: any) => (
                        <HeartCount id={id} key={id} remove={removeHeart} />
                      ))}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence>
                {!hideBar && !hideNew && (
                  <motion.div
                    className="add_comment w-full py-3 z-[9999999] fixed bottom-0 left-0"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                  >
                    <div className="flex items-center feed_add_comment gap-2 px-4">
                      <input
                        type="text"
                        className="w-full p-[6px] bg-transparent border-none outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="我来说两句～"
                      />
                      <button
                        className="p-3"
                        onClick={() => handleComment(currentActivePost)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="22"
                          viewBox="0 0 24 22"
                          fill="none"
                        >
                          <path
                            d="M12.2705 11.7305L3.00345 12.6274L0.56437 20.427C0.468914 20.7295 0.496117 21.0574 0.640043 21.3401C0.783968 21.6227 1.03349 21.8374 1.33422 21.9378C1.63518 22.0382 1.96335 22.0164 2.24826 21.8772L22.5589 12.0422C22.8198 11.9151 23.0233 11.6943 23.1289 11.424C23.2345 11.1537 23.2345 10.8535 23.1289 10.5832C23.0233 10.3129 22.8198 10.0921 22.5589 9.96495L2.26219 0.123036C1.97731 -0.0164383 1.64889 -0.038204 1.34796 0.0622005C1.04724 0.162848 0.797965 0.377508 0.65378 0.659921C0.509855 0.94258 0.482651 1.2705 0.578108 1.57295L3.01719 9.37255L12.2672 10.2695C12.6408 10.3066 12.9257 10.6209 12.9257 10.9963C12.9257 11.3719 12.6408 11.6862 12.2672 11.7231L12.2705 11.7305Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {!videos?.length && <></>}
      </div>
    </>
  );
};

export default React.memo(VideoFeedVirtual);

// import { useEffect, useRef, useState } from "react";
// import { useGetConfigQuery, usePostCommentMutation } from "../services/homeApi";
// import { useSwipeable } from "react-swipeable";
// import Top20Movies from "./Top20Movies";
// import { useDispatch, useSelector } from "react-redux";
// import FeedFooter from "./FeedFooter";
// import { useNavigate } from "react-router-dom";
// import HeartCount from "./Heart";

// import { showToast } from "../services/errorSlice";
// import Ads from "./Ads";
// import loader from "../vod_loader.gif";
// import LoginDrawer from "@/components/profile/auth/login-drawer";
// import sc from "../../../assets/explore/sc.svg";
// import { decryptImage } from "@/utils/imageDecrypt";
// import PreventSwipeBack from "@/components/shared/PreventSwipeBack";
// import { getDeviceInfo } from "@/lib/deviceInfo";
// import "../home.css";
// import VideoContainerFeed from "./VideoContainerFeed";

// const VideoFeed = ({
//   videos,
//   currentActiveId,
//   setShowVideoFeed,
//   query,
//   setVideos,
//   search = false,
// }: {
//   videos: any;
//   currentActiveId: any;
//   setShowVideoFeed: any;
//   query: any;
//   setVideos: any;
//   search: any;
// }) => {
//   const videoContainerRef = useRef<HTMLDivElement>(null);
//   const [content, setContent] = useState("");
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [countdown, setCountdown] = useState(3);
//   const [countNumber, setCountNumber] = useState(0);
//   const [topmovies, setTopMovies] = useState(false);
//   const { data: config } = useGetConfigQuery({});
//   const user = useSelector((state: any) => state.persist.user);
//   const [postComment] = usePostCommentMutation();
//   const navigate = useNavigate();
//   const [hearts, setHearts] = useState<number[]>([]);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   const dispatch = useDispatch();
//   const [isOpen, setIsOpen] = useState(false);
//   const abortControllerRef = useRef<AbortController[]>([]);
//   const videoData = useRef<any[]>([]);
//   const [isDecrypting, setIsDecrypting] = useState(true);
//   const [isSwiping, setIsSwiping] = useState(false);
//   const [decryptedVideos, setDecryptedVideos] = useState<any[]>([]);

//   const removeHeart = (id: number) => {
//     setHearts((prev) => prev.filter((heartId) => heartId !== id));
//   };

//   const decryptionCache = useRef(new Map<string, string>());

//   const decryptThumbnail = async (thumbnail: string): Promise<string> => {
//     if (!thumbnail) return "";
//     if (decryptionCache.current.has(thumbnail))
//       return decryptionCache.current.get(thumbnail) || "";
//     if (!thumbnail.endsWith(".txt")) {
//       decryptionCache.current.set(thumbnail, thumbnail);
//       return thumbnail;
//     }
//     try {
//       const decryptedUrl = await decryptImage(thumbnail);
//       decryptionCache.current.set(thumbnail, decryptedUrl);
//       return decryptedUrl;
//     } catch (error) {
//       console.error("Error decrypting thumbnail:", error);
//       return "";
//     }
//   };

//   console.log(decryptedVideos);
//   useEffect(() => {
//     if (videos.length > 0) {
//       const decryptAndSetVideos = async () => {
//         setIsDecrypting(true);
//         const decrypted = await Promise.all(
//           videos.map(async (video: any) => ({
//             ...video,
//             decryptedPreview: await decryptThumbnail(video.preview_image),
//           }))
//         );
//         setDecryptedVideos(decrypted);
//         setIsDecrypting(false);

//         // Find and set the index of the currentActiveId
//         const activeIndex = decrypted.findIndex(
//           (video) => video.post_id === currentActiveId
//         );
//         if (activeIndex !== -1) {
//           setCurrentVideoIndex(activeIndex);
//         }
//       };
//       decryptAndSetVideos();
//     }
//   }, [videos, currentActiveId]);

//   console.log(currentVideoIndex);
//   const handlers = useSwipeable({
//     onSwipedUp: () => {
//       if (currentVideoIndex < decryptedVideos.length - 1) {
//         setIsSwiping(true);
//         setCurrentVideoIndex(currentVideoIndex + 1);
//         setTimeout(() => setIsSwiping(false), 300);
//       }
//     },
//     onSwipedDown: () => {
//       if (currentVideoIndex > 0) {
//         setIsSwiping(true);
//         setCurrentVideoIndex(currentVideoIndex - 1);
//         setTimeout(() => setIsSwiping(false), 300);
//       }
//     },
//     preventDefaultTouchmoveEvent: true,
//     trackMouse: true,
//     delta: 60,
//     swipeDuration: 500,
//     touchEventOptions: { passive: false },
//     trackTouch: true,
//   });

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowUp" && currentVideoIndex > 0) {
//         setCurrentVideoIndex(currentVideoIndex - 1);
//       } else if (
//         e.key === "ArrowDown" &&
//         currentVideoIndex < decryptedVideos.length - 1
//       ) {
//         setCurrentVideoIndex(currentVideoIndex + 1);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentVideoIndex, decryptedVideos.length]);

//   const handleBack = () => {
//     setShowVideoFeed(false);
//   };

//   const handleComment = async (post_id: any) => {
//     if (user?.token) {
//       if (!content.trim()) return;

//       try {
//         const deviceInfo = getDeviceInfo();
//         const response = await postComment({
//           post_id: post_id,
//           content: content,
//           device: deviceInfo.deviceName,
//           app_version: deviceInfo.appVersion,
//         }).unwrap();
//         setContent("");
//         dispatch(
//           showToast({
//             message: response?.message,
//             type: "success",
//           })
//         );
//       } catch (error) {
//         dispatch(
//           showToast({
//             message: error?.data?.message,
//             type: "success",
//           })
//         );
//         console.error("Failed to post reply:", error);
//       }
//     } else {
//       setIsOpen(true);
//     }
//   };

//   const handleSearch = () => {
//     navigate("/search_overlay");
//   };

//   if (isOpen) {
//     return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
//   }

//   if (topmovies) {
//     return <Top20Movies setTopMovies={setTopMovies} />;
//   }

//   const currentVideo = decryptedVideos[currentVideoIndex] || null;

//   console.log(currentVideo);

//   return (
//     <div className="app bg-black">
//       {!search && <PreventSwipeBack />}

//       {isDecrypting && decryptedVideos?.length === 0 ? (
//         <div className="app bg-[#16131C]">
//           <div style={{ textAlign: "center", padding: "20px" }}>
//             <div className="heart">
//               <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-center items-center w-full">
//           <div className="max-w-[1024px] home-main w-full">
//             <div className="fixed top-3 left-0 flex gap-2 items-center w-full z-[9999]">
//               <button className="p-3" onClick={handleBack}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="10"
//                   height="14"
//                   viewBox="0 0 10 14"
//                   fill="none"
//                 >
//                   <path
//                     d="M8.95748 0.326623C8.85923 0.243209 8.74251 0.17703 8.61401 0.131875C8.48551 0.0867197 8.34775 0.0634766 8.20863 0.0634766C8.06951 0.0634766 7.93175 0.0867197 7.80325 0.131875C7.67475 0.17703 7.55803 0.243209 7.45978 0.326623L0.428239 6.28126C0.349798 6.34756 0.287565 6.4263 0.245104 6.51298C0.202642 6.59967 0.180786 6.69259 0.180786 6.78644C0.180786 6.88029 0.202642 6.97321 0.245104 7.0599C0.287565 7.14658 0.349798 7.22533 0.428239 7.29162L7.45978 13.2463C7.8744 13.5974 8.54286 13.5974 8.95748 13.2463C9.37209 12.8951 9.37209 12.3291 8.95748 11.9779L2.83132 6.78286L8.96594 1.58777C9.37209 1.24382 9.37209 0.670574 8.95748 0.326623Z"
//                     fill="white"
//                   />
//                 </svg>
//               </button>
//               <div className="relative flex-1 mr-5">
//                 <div className="absolute top-2 left-3">
//                   <img src={sc} alt="" />
//                 </div>
//                 <input
//                   className="feed-input w-full pl-[45px] py-[8px]"
//                   placeholder={query}
//                   onClick={handleSearch}
//                 />
//               </div>
//             </div>

//             {currentVideo && (
//               <div
//                 {...handlers}
//                 className="app__videos pb-[80px] h-screen overflow-hidden relative"
//               >
//                 <div
//                   className={`video-container  ${
//                     isSwiping ? "swipe-transition" : ""
//                   }`}
//                   style={{
//                     transform: `translateY(-${currentVideoIndex * 100}vh)`,
//                     transition: isSwiping ? "transform 0.5s ease-out" : "none",
//                   }}
//                 >
//                   <div
//                     className="video1 mt-[20px] h-screen w-full relative"
//                     data-post-id={currentVideo?.post_id}
//                     style={{
//                       transform: `translateY(${currentVideoIndex * 100}vh)`,
//                       transition: isSwiping ? "transform 1s ease-in" : "none",
//                     }}
//                   >
//                     {currentVideo?.file_type !== "video" ? (
//                       <a
//                         href={currentVideo?.ads_info?.jump_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <img
//                           src={currentVideo?.files[0]?.resourceURL}
//                           alt=""
//                           className="h-full w-full object-cover"
//                         />
//                       </a>
//                     ) : (
//                       <VideoContainerFeed
//                         videoData={videoData}
//                         indexRef={currentVideoIndex}
//                         abortControllerRef={abortControllerRef}
//                         container={videoContainerRef.current}
//                         status={true}
//                         countNumber={countNumber}
//                         video={currentVideo}
//                         setCountNumber={setCountNumber}
//                         config={config}
//                         countdown={countdown}
//                         setWidth={setWidth}
//                         setHeight={setHeight}
//                         setHearts={setHearts}
//                         setCountdown={setCountdown}
//                         width={width}
//                         height={height}
//                       />
//                     )}

//                     {currentVideo?.type !== "ads" &&
//                       currentVideo?.type !== "ads_virtual" && (
//                         <FeedFooter
//                           badge={currentVideo?.user?.badge}
//                           id={currentVideo?.user?.id}
//                           tags={currentVideo?.tag}
//                           title={currentVideo?.title}
//                           username={currentVideo?.user?.name}
//                           city={currentVideo?.city}
//                         />
//                       )}

//                     {(currentVideo?.type === "ads" ||
//                       currentVideo?.type === "ads_virtual") && (
//                       <Ads
//                         ads={currentVideo?.ads_info}
//                         type={currentVideo?.type}
//                       />
//                     )}

//                     {hearts.map((id: any) => (
//                       <HeartCount id={id} key={id} remove={removeHeart} />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div className="absolute bottom-0 add_comment w-full py-3">
//               <div className="flex items-center feed_add_comment gap-2 px-4">
//                 <input
//                   type="text"
//                   className="w-full p-[6px] bg-transparent border-none outline-none"
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   placeholder="写评论"
//                 />
//                 <button
//                   className="p-3"
//                   onClick={() => handleComment(currentVideo?.post_id)}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="22"
//                     viewBox="0 0 24 22"
//                     fill="none"
//                   >
//                     <path
//                       d="M12.2705 11.7305L3.00345 12.6274L0.56437 20.427C0.468914 20.7295 0.496117 21.0574 0.640043 21.3401C0.783968 21.6227 1.03349 21.8374 1.33422 21.9378C1.63518 22.0382 1.96335 22.0164 2.24826 21.8772L22.5589 12.0422C22.8198 11.9151 23.0233 11.6943 23.1289 11.424C23.2345 11.1537 23.2345 10.8535 23.1289 10.5832C23.0233 10.3129 22.8198 10.0921 22.5589 9.96495L2.26219 0.123036C1.97731 -0.0164383 1.64889 -0.038204 1.34796 0.0622005C1.04724 0.162848 0.797965 0.377508 0.65378 0.659921C0.509855 0.94258 0.482651 1.2705 0.578108 1.57295L3.01719 9.37255L12.2672 10.2695C12.6408 10.3066 12.9257 10.6209 12.9257 10.9963C12.9257 11.3719 12.6408 11.6862 12.2672 11.7231L12.2705 11.7305Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoFeed;
