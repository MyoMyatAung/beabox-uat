import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGetConfigQuery, usePostCommentMutation } from "../services/homeApi";
import Top20Movies from "./Top20Movies";
import { useDispatch, useSelector } from "react-redux";
import FeedFooter from "./FeedFooter";
import { useNavigate } from "react-router-dom";
import HeartCount from "./Heart";
import VideoContainer from "./VideoContainer";
import { showToast } from "../services/errorSlice";
import Ads from "./Ads";
import loader from "../vod_loader.gif";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import sc from "../../../assets/explore/sc.svg";
import VideoContainerFeed from "./VideoContainerFeed";
import ShowHeartCom from "./ShowHeartCom";
import CountdownCircle from "./CountdownCircle";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { decryptImage } from "@/utils/imageDecrypt";
import PreventSwipeBack from "@/components/shared/PreventSwipeBack";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

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
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [currentActivePost, setCurrentActivePost] =
    useState<any>(currentActiveId);
  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0);
  const [topmovies, setTopMovies] = useState(false);
  const { data: config } = useGetConfigQuery({});
  const user = useSelector((state: any) => state.persist.user);
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);

  const [postComment] = usePostCommentMutation();
  const navigate = useNavigate();
  const [hearts, setHearts] = useState<number[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [videosToRender, setVideosToRender] = useState<any[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const abortControllerRef = useRef<AbortController[]>([]);
  const videoData = useRef<any[]>([]);
  const indexRef = useRef(0);
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [containerTranslateY, setContainerTranslateY] = useState(0);
  const snapDuration = 400;
  const dragThreshold = 50;
  const lastScrollTime = useRef(0);
  const scrollCooldown = 200;
  const [initialPositionSet, setInitialPositionSet] = useState(false);

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id));
  };

  const currentVideo = videosToRender[currentVideoIndex] || null;
  const decryptionCache = useRef(new Map<string, string>());

  const decryptThumbnail = async (thumbnail: string): Promise<string> => {
    if (!thumbnail) return "";
    if (decryptionCache.current.has(thumbnail)) {
      return decryptionCache.current.get(thumbnail) || "";
    }
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

          // Check if this is initial load or pagination
          const isInitialLoad = videosToRender.length === 0;

          setVideosToRender(videosWithDecryptedPreviews);

          // Only set position on initial load, not when new videos are added via pagination
          if (isInitialLoad && !initialPositionSet) {
            // Find the index of currentActiveId
            const activeIndex = videosWithDecryptedPreviews.findIndex(
              (video) => video.post_id === currentActiveId
            );
            if (activeIndex !== -1) {
              setCurrentVideoIndex(activeIndex);
              setCurrentActivePost(currentActiveId);

              // Ensure DOM is ready before setting initial position
              // Use double requestAnimationFrame for better reliability
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  const targetY = -activeIndex * window.innerHeight;
                  setContainerTranslateY(targetY);
                  setInitialPositionSet(true);
                });
              });
            } else {
              // If no active ID found, default to first video
              setCurrentVideoIndex(0);
              setCurrentActivePost(videosWithDecryptedPreviews[0]?.post_id);
              // Even for index 0, ensure proper initialization
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setContainerTranslateY(0);
                  setInitialPositionSet(true);
                });
              });
            }
          }

          setIsDecrypting(false);
        };
        run();
      } catch (error) {}
    }
  }, [videos, currentActiveId]);

  // Navigate to next video with continuous scroll
  const navigateToNext = () => {
    if (currentVideoIndex < videosToRender.length - 1 && !isSnapping) {
      setIsSnapping(true);
      const newIndex = currentVideoIndex + 1;
      const newTranslateY = -newIndex * window.innerHeight;

      setContainerTranslateY(newTranslateY);
      setCurrentVideoIndex(newIndex);
      setCurrentActivePost(videosToRender[newIndex]?.post_id);

      console.log("scrolled", newIndex, videosToRender.length - 3);
      if (newIndex >= videosToRender.length - 3) {
        console.log("scrolled need");
        setPage((prev: any) => prev + 1);
      }

      setTimeout(() => setIsSnapping(false), snapDuration);
    }
  };

  const navigateToPrevious = () => {
    if (currentVideoIndex > 0 && !isSnapping) {
      setIsSnapping(true);
      const newIndex = currentVideoIndex - 1;
      const newTranslateY = -newIndex * window.innerHeight;

      setContainerTranslateY(newTranslateY);
      setCurrentVideoIndex(newIndex);
      setCurrentActivePost(videosToRender[newIndex]?.post_id);

      setTimeout(() => setIsSnapping(false), snapDuration);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: navigateToNext,
    onSwipedDown: navigateToPrevious,
    preventScrollOnSwipe: true,
    trackMouse: false,
    delta: dragThreshold,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
    trackTouch: false,
  });

  useEffect(() => {
    const handlePopState = () => {
      setShowVideoFeed(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Handle drag navigation
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (isSnapping) return;
      setIsDragging(true);
      setDragStartY(e.clientY);
      setDragCurrentY(e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setDragCurrentY(e.clientY);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) {
        setIsDragging(false);
        setDragStartY(0);
        setDragCurrentY(0);
        return;
      }

      const dragDistance = dragCurrentY - dragStartY;

      if (Math.abs(dragDistance) > dragThreshold) {
        lastScrollTime.current = now;

        if (dragDistance < 0 && currentVideoIndex < videosToRender.length - 1) {
          navigateToNext();
        } else if (dragDistance > 0 && currentVideoIndex > 0) {
          navigateToPrevious();
        }
      }

      setIsDragging(false);
      setDragStartY(0);
      setDragCurrentY(0);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isSnapping) return;
      setIsDragging(true);
      setDragStartY(e.touches[0].clientY);
      setDragCurrentY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setDragCurrentY(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) {
        setIsDragging(false);
        setDragStartY(0);
        setDragCurrentY(0);
        return;
      }

      const dragDistance = dragCurrentY - dragStartY;

      if (Math.abs(dragDistance) > dragThreshold) {
        lastScrollTime.current = now;

        if (dragDistance < 0 && currentVideoIndex < videosToRender.length - 1) {
          navigateToNext();
        } else if (dragDistance > 0 && currentVideoIndex > 0) {
          navigateToPrevious();
        }
      }

      setIsDragging(false);
      setDragStartY(0);
      setDragCurrentY(0);
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    currentVideoIndex,
    videosToRender,
    isDragging,
    dragStartY,
    dragCurrentY,
    isSnapping,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        navigateToPrevious();
      } else if (e.key === "ArrowDown") {
        navigateToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVideoIndex, videosToRender, isSnapping]);

  // Use useLayoutEffect for initial positioning to ensure DOM measurements are accurate
  useLayoutEffect(() => {
    if (videosToRender.length > 0 && !initialPositionSet) {
      const activeIndex = videosToRender.findIndex(
        (video) => video.post_id === currentActiveId
      );
      if (activeIndex >= 0) {
        // Force a layout recalculation before setting position
        if (videoContainerRef.current) {
          // Force browser to calculate styles
          videoContainerRef.current.offsetHeight;
          videoContainerRef.current.getBoundingClientRect();
        }
        const targetY = -activeIndex * window.innerHeight;
        setContainerTranslateY(targetY);
        setCurrentVideoIndex(activeIndex);
        setInitialPositionSet(true);
      }
    }
  }, [videosToRender, currentActiveId, initialPositionSet]);

  useEffect(() => {
    if (videosToRender[currentVideoIndex]) {
      setCurrentActivePost(videosToRender[currentVideoIndex].post_id);
    }
  }, [currentVideoIndex, videosToRender]);

  useEffect(() => {
    if (currentActivePost) {
      setCountdown(3);
      setCountNumber(0);
    }
  }, [currentActivePost]);

  if (topmovies) {
    return <Top20Movies setTopMovies={setTopMovies} />;
  }

  const handleBack = () => {
    setShowVideoFeed(false);
  };

  const handleComment = async (post_id: { post_id: any }) => {
    if (user?.token) {
      if (!content.trim()) return;
      try {
        const deviceInfo = getDeviceInfo();
        const response: any = await postComment({
          post_id: post_id,
          content: content,
          device: deviceInfo.deviceName,
          app_version: deviceInfo.appVersion,
        }).unwrap();
        setContent("");
        dispatch(
          showToast({
            message: response?.message || "Comment posted successfully",
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

  const [isLastVideoVisible, setIsLastVideoVisible] = useState(false);

  useEffect(() => {
    setIsLastVideoVisible(currentVideoIndex === videosToRender.length - 1);
  }, [currentVideoIndex, videosToRender]);

  const handleSearch = () => {
    navigate("/search_overlay");
  };

  return (
    <>
      <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="app bg-black">
        {!search && <PreventSwipeBack />}

        {isDecrypting ? (
          <div className="app bg-[#16131C]">
            <div style={{ textAlign: "center", padding: "20px" }}>
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
            <div
              {...handlers}
              ref={videoContainerRef}
              className={`app__videos ${
                isOpen ? "opacity-50" : ""
              } h-screen overflow-hidden`}
              style={{ pointerEvents: isOpen ? "none" : "auto" }}
            >
              <AnimatePresence>
                {!hideBar && !hideNew && (
                  <motion.div
                    className="fixed top-3 left-0 flex gap-2 items-center w-full z-[9999]"
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
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

              {/* Continuous scrolling video container */}
              <div
                className={`videos-container ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  position: "relative",
                  height: `${videosToRender.length * window.innerHeight}px`,
                  minHeight: `${videosToRender.length * window.innerHeight}px`,
                  transform: (() => {
                    if (isDragging) {
                      const dragDistance = dragCurrentY - dragStartY;
                      const dragOffset = dragDistance * 0.3;
                      return `translateY(${
                        containerTranslateY + dragOffset
                      }px)`;
                    }
                    return `translateY(${containerTranslateY}px)`;
                  })(),
                  transition: isDragging
                    ? "none"
                    : isSnapping
                    ? "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                    : !initialPositionSet
                    ? "none"
                    : undefined,
                  willChange: "transform",
                }}
              >
                {videosToRender.map((video: any, index: number) => {
                  // Only render videos within a sliding window of 5 (2 before, current, 2 after) for smoother transitions
                  const distance = Math.abs(index - currentVideoIndex);
                  const shouldRender = distance <= 2;

                  if (!shouldRender) {
                    // Don't render anything for videos outside the window
                    return null;
                  }

                  return (
                    <div
                      key={video.post_id}
                      className="video1 select-none"
                      data-post-id={video.post_id}
                      style={{
                        height: `${window.innerHeight}px`,
                        position: "absolute",
                        top: `${index * window.innerHeight}px`,
                        left: 0,
                        right: 0,
                        width: "100%",
                        paddingBottom: "70px",
                        boxSizing: "border-box",
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
                          setVideosData={setVideos}
                          setrenderVideos={setVideosToRender}
                          videoData={videoData}
                          indexRef={indexRef}
                          abortControllerRef={abortControllerRef}
                          container={videoContainerRef.current}
                          width={width}
                          height={height}
                          status={index === currentVideoIndex}
                          countNumber={
                            index === currentVideoIndex ? countNumber : 0
                          }
                          video={video}
                          setCountNumber={setCountNumber}
                          config={config}
                          countdown={
                            index === currentVideoIndex ? countdown : 3
                          }
                          setWidth={setWidth}
                          setHeight={setHeight}
                          setHearts={setHearts}
                          setCountdown={setCountdown}
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

                      {index === currentVideoIndex &&
                        hearts.map((id: any) => (
                          <HeartCount id={id} key={id} remove={removeHeart} />
                        ))}
                    </div>
                  );
                })}
              </div>

              {/* Comment section */}
              <AnimatePresence>
                {!hideBar && !hideNew && (
                  <motion.div
                    className="add_comment w-full py-3 z-[9999999] fixed bottom-0 left-0"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                        onClick={() => handleComment(currentVideo?.post_id)}
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

              {isLastVideoVisible && (
                <div className="flex justify-center items-center p-3 w-full">
                  <img
                    src={loader}
                    className="w-[80px] h-[80px]"
                    alt="Loading"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {!videos?.length && <></>}
      </div>
    </>
  );
};

export default React.memo(VideoFeedVirtual);
