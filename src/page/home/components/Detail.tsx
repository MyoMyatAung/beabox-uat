import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetConfigQuery,
  useGetMydayQuery,
  useGetUserMydayQuery,
  useWatchtPostMutation,
} from "../services/homeApi";
import HeartCount from "./Heart";
import Ads from "./Ads";
import VideoFooter from "./VideoFooter";
import { decryptImage } from "@/utils/imageDecrypt";

import loader from "../vod_loader.gif";
import LoadingBar from "./detail/LoadingBar";
import DetailContainer from "./detail/DetailContainer";
import DetailOneContainer from "./detail/DetailOneContainer";
import StoryAnimation from "./StoryAnimation";
import story from "@/assets/story.json";
import { useDispatch, useSelector } from "react-redux";
import { addSeenUser } from "../services/seenUsersSlice";

const Detail = () => {
  const { id } = useParams();
  //   const { data: myday } = useGetMydayQuery({ page: 1 });

  const [watchPost] = useWatchtPostMutation();
  const [isInteractingWithProgressBar, setisInteractingWithProgressBar] =
    useState(false);

  //   console.log(myday);

  //   const res = myday?.data?.find((item: any) => item?.id === id);

  // Get videos for current user
  const { data: my } = useGetUserMydayQuery({
    post_user_id: id,
  });

  //   console.log("aa", my);

  let data = my?.data;

  //   if (!res) {
  //   }

  //   const data = res?.posts;

  // console.log(myday);

  // Filter and prepare user data
  // const followers = myday?.data.filter((follower: any) => !follower?.uploaded);
  //const [currentUserId, setCurrentUserId] = useState(id);
  // const [isTransitioning, setIsTransitioning] = useState(false);

  //   // Get videos for current user
  //   const { data, refetch } = useGetUserMydayQuery({
  //     post_user_id: currentUserId,
  //   });

  // Find current user index and get adjacent users
  // const currentUserIndex =
  //   followers?.findIndex((user: any) => user.id === currentUserId) || 0;
  // const prevUserId =
  //   currentUserIndex > 0 ? followers[currentUserIndex - 1]?.id : null;
  // const nextUserId =
  //   currentUserIndex < followers?.length - 1
  //     ? followers[currentUserIndex + 1]?.id
  //     : null;

  // Video state management
  const videoData = useRef<any[]>([]);
  const indexRef = useRef(0);
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController[]>([]);
  const [hearts, setHearts] = useState<number[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [countNumber, setCountNumber] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const { data: config } = useGetConfigQuery({});
  const [isDecrypting, setIsDecrypting] = useState(true);
  const user = useSelector((state: any) => state?.persist?.user);
  const dispatch = useDispatch();

  // // Touch/swipe state for user navigation
  // const swipeThreshold = 80; // minimum distance for swipe
  // const swipeDirectionThreshold = 0.7; // ratio to determine if swipe is more horizontal than vertical

  // // Touch tracking refs
  // const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
  //   null
  // );
  // const isSwipingRef = useRef(false);
  // const swipeDetectedRef = useRef(false);

  // Add at the top of your component
  const decryptionCache = useRef(new Map<string, string>());

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id));
  };

  // Add decryption cache to speed up repeated decryption calls
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

  // // Handle swipe navigation between users
  // const handleSwipeNavigation = (direction: "left" | "right") => {
  //   if (isTransitioning) return;

  //   let targetUserId = null;

  //   if (direction === "left" && nextUserId) {
  //     targetUserId = nextUserId;
  //   } else if (direction === "right" && prevUserId) {
  //     targetUserId = prevUserId;
  //   }

  //   if (targetUserId) {
  //     console.log(`🔄 Navigating ${direction} to user: ${targetUserId}`);
  //     setIsTransitioning(true);
  //     setCurrentUserId(targetUserId);
  //     setCurrentIndex(0); // Reset video index when switching users
  //     indexRef.current = 0;

  //     // Update URL without full navigation to maintain state
  //     window.history.replaceState(null, "", `/story_detail/${targetUserId}`);

  //     setTimeout(() => {
  //       setIsTransitioning(false);
  //     }, 300);
  //   } else {
  //     console.log(
  //       `❌ No ${direction === "left" ? "next" : "previous"} user available`
  //     );
  //   }
  // };

  // // Document-level touch handling that bypasses all component interference
  // useEffect(() => {
  //   const handleDocumentTouchStart = (e: TouchEvent) => {
  //     // Only handle touches within our myday container
  //     const container = videoContainerRef.current;
  //     if (!container || !container.contains(e.target as Node)) return;

  //     const touch = e.touches[0];
  //     touchStartRef.current = {
  //       x: touch.clientX,
  //       y: touch.clientY,
  //       time: Date.now(),
  //     };
  //     isSwipingRef.current = false;
  //     swipeDetectedRef.current = false;

  //     console.log("📱 Touch start detected:", {
  //       x: touch.clientX,
  //       y: touch.clientY,
  //       target: e.target,
  //     });
  //   };

  //   const handleDocumentTouchMove = (e: TouchEvent) => {
  //     if (!touchStartRef.current) return;

  //     // Only handle touches within our myday container
  //     const container = videoContainerRef.current;
  //     if (!container || !container.contains(e.target as Node)) return;

  //     const touch = e.touches[0];
  //     const deltaX = touch.clientX - touchStartRef.current.x;
  //     const deltaY = touch.clientY - touchStartRef.current.y;
  //     const absDeltaX = Math.abs(deltaX);
  //     const absDeltaY = Math.abs(deltaY);

  //     // Detect if this is a horizontal swipe
  //     if (
  //       absDeltaX > 30 &&
  //       absDeltaX > absDeltaY * (1 / swipeDirectionThreshold)
  //     ) {
  //       if (!isSwipingRef.current) {
  //         console.log("🔄 Horizontal swipe detected");
  //         isSwipingRef.current = true;
  //       }
  //     }
  //   };

  //   const handleDocumentTouchEnd = (e: TouchEvent) => {
  //     if (!touchStartRef.current) return;

  //     // Only handle touches within our myday container
  //     const container = videoContainerRef.current;
  //     if (!container || !container.contains(e.target as Node)) {
  //       touchStartRef.current = null;
  //       isSwipingRef.current = false;
  //       swipeDetectedRef.current = false;
  //       return;
  //     }

  //     const touch = e.changedTouches[0];
  //     const deltaX = touch.clientX - touchStartRef.current.x;
  //     const deltaY = touch.clientY - touchStartRef.current.y;
  //     const absDeltaX = Math.abs(deltaX);
  //     const absDeltaY = Math.abs(deltaY);
  //     const timeDiff = Date.now() - touchStartRef.current.time;

  //     console.log("📱 Touch end analysis:", {
  //       deltaX,
  //       deltaY,
  //       absDeltaX,
  //       absDeltaY,
  //       timeDiff,
  //       meetsDistance: absDeltaX > swipeThreshold,
  //       isHorizontal: absDeltaX > absDeltaY * (1 / swipeDirectionThreshold),
  //       isQuick: timeDiff < 800,
  //       prevUserId,
  //       nextUserId,
  //     });

  //     // Check if this qualifies as a user navigation swipe
  //     if (
  //       absDeltaX > swipeThreshold &&
  //       absDeltaX > absDeltaY * (1 / swipeDirectionThreshold) &&
  //       timeDiff < 800 &&
  //       !swipeDetectedRef.current
  //     ) {
  //       swipeDetectedRef.current = true;

  //       if (deltaX > 0) {
  //         console.log("👈 Swiping right - going to previous user");
  //         handleSwipeNavigation("right");
  //       } else {
  //         console.log("👉 Swiping left - going to next user");
  //         handleSwipeNavigation("left");
  //       }
  //     }

  //     // Clean up
  //     touchStartRef.current = null;
  //     isSwipingRef.current = false;
  //     swipeDetectedRef.current = false;
  //   };

  //   // Add event listeners to document to bypass all component interference
  //   document.addEventListener("touchstart", handleDocumentTouchStart, {
  //     passive: true,
  //   });
  //   document.addEventListener("touchmove", handleDocumentTouchMove, {
  //     passive: true,
  //   });
  //   document.addEventListener("touchend", handleDocumentTouchEnd, {
  //     passive: true,
  //   });

  //   return () => {
  //     document.removeEventListener("touchstart", handleDocumentTouchStart);
  //     document.removeEventListener("touchmove", handleDocumentTouchMove);
  //     document.removeEventListener("touchend", handleDocumentTouchEnd);
  //   };
  // }, [currentUserId, nextUserId, prevUserId, isTransitioning]); // Re-setup when users change

  // Refetch data when currentUserId changes
  // useEffect(() => {
  //   if (currentUserId) {
  //     refetch();
  //   }
  // }, [currentUserId, refetch]);

  useEffect(() => {
    // Determine which data corresponds to the current tab
    const currentData = data;

    if (currentData) {
      if (currentData?.length > 0) {
        try {
          const decryptAndUpdateVideos = async () => {
            const decryptedVideos = await Promise.all(
              currentData?.map(async (video: any) => ({
                ...video,
                decryptedPreview: await decryptThumbnail(video.preview_image),
              }))
            );
            // Find the first unwatched video or default to 0
            const firstUnwatchedIndex = decryptedVideos.findIndex(
              (video: any) => !video.user?.my_day?.watched
            );
            const newIndex = firstUnwatchedIndex >= 0 ? firstUnwatchedIndex : 0;

            setCurrentIndex(newIndex);
            setVideos(decryptedVideos);
            setIsDecrypting(false);
          };
          decryptAndUpdateVideos();
        } catch (error) {
          setIsDecrypting(false);
        }
      } else {
        setIsDecrypting(false);
      }
    }
  }, [data]);

  const video = videos[currentIndex] || null; // Get the current video based on index

  const [watchedPosts, setWatchedPosts] = useState<Record<string, boolean>>({});

  // Add this import at the top

  // Inside your Detail component:

  const seenUserIds = useSelector((state: any) => state.seenUsers.seenUserIds);

  // Add this effect to check when all videos are watched
  useEffect(() => {
    if (videos.length > 0 && id) {
      const allWatched = videos.every(
        (video) => video.user?.my_day?.watched || watchedPosts[video.post_id]
      );

      if (allWatched && !seenUserIds.includes(id)) {
        dispatch(addSeenUser(id));
      }
    }
  }, [videos, watchedPosts, id, dispatch, seenUserIds]);

  // Modify your watchPost effect like this:
  useEffect(() => {
    try {
      if (
        video &&
        !video?.user?.my_day?.watched &&
        !watchedPosts[video.post_id]
      ) {
        // Watch the post when the video changes
        watchPost({ post_id: video.post_id })
          .unwrap()
          .then(() => {
            // Mark as watched on success
            setWatchedPosts((prev) => ({ ...prev, [video.post_id]: true }));
          })
          .catch((error) => {
            setWatchedPosts((prev) => ({ ...prev, [video.post_id]: true }));
            console.error("Error watching post:", error);
          });
      }
    } catch (error) {
      console.error("Error watching post:", error);
    }
  }, [video, watchedPosts]);
  const swiperRef = useRef<any>(null);
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`storyGuide_${user?.id}`);
      return saved !== "false"; // Default to true if not found
    }
    return true;
  });

  const handleKnow = () => {
    // Store that this user has seen the guide
    setShowGuide(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(`storyGuide_${user?.id}`, "false");
    }
  };

  return (
    <div
      ref={videoContainerRef}
      className="myday_container"
      // className={`myday_container ${isTransitioning ? "transitioning" : ""}`}
    >
      {isDecrypting && (
        <div className="app bg-[#16131C] ">
          <div
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div className="z-[9999999]">
              <LoadingBar />
            </div>
            <div className="heart">
              <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
            </div>
          </div>
        </div>
      )}
      {video && (
        <>
          {showGuide && (
            <div className="absolute px-3 top-0 h-screen left-0 w-full flex flex-col justify-center z-[9999999] bg-black opacity-70">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="w-[66px] h-[66px]">
                    <StoryAnimation animate={story} flip={false} />
                  </div>

                  <p className="guide_text">点击左侧上一个</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[66px] h-[66px] ">
                    <StoryAnimation animate={story} flip={true} />
                  </div>
                  <p className="guide_text">点击右侧下一个</p>
                </div>
              </div>
              <div className="absolute bottom-[100px] left-0 right-0 flex justify-center items-center">
                <button onClick={handleKnow} className="guide_btn text-white">
                  我知道了
                </button>
              </div>
            </div>
          )}
          <div
            className={`video justify-center items-center overflow-hidden`}
            data-post-id={video?.post_id} // Add post ID to the container
          >
            {video?.file_type !== "video" ? (
              <a
                href={video?.ads_info?.jump_url}
                target="_blank"
                className="flex items-center justify-center h-full overflow-hidden"
              >
                <img
                  src={video?.files[0]?.resourceURL}
                  alt=""
                  className="w-full mx-auto"
                />
              </a>
            ) : (
              <DetailOneContainer
                setisInteractingWithProgressBar={
                  setisInteractingWithProgressBar
                }
                swiperRef={swiperRef}
                setIsDecrypting={setIsDecrypting}
                // refetch={refetch}
                length={videos.length}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setVideos={setVideos}
                videoData={videos}
                indexRef={indexRef}
                abortControllerRef={abortControllerRef}
                container={videoContainerRef.current}
                status={true}
                countNumber={countNumber}
                video={video}
                setCountNumber={setCountNumber}
                config={config}
                countdown={countdown}
                setWidth={setWidth}
                setHeight={setHeight}
                setHearts={setHearts}
                setCountdown={setCountdown}
                width={width}
                height={height}
              />
            )}

            {video?.type !== "ads" && video?.type !== "ads_virtual" && (
              <VideoFooter
                badge={video?.user?.badge}
                id={video?.user?.id}
                tags={video?.tag}
                title={video?.title}
                username={video?.user?.name}
                city={video?.city}
              />
            )}

            {(video?.type === "ads" || video?.type === "ads_virtual") && (
              <Ads ads={video?.ads_info} type={video?.type} />
            )}

            {hearts.map((id: any) => (
              <HeartCount id={id} key={id} remove={removeHeart} />
            ))}
          </div>
        </>
      )}

      {/* Visual indicators for available swipe directions with better visibility */}
      {/* {!isDecrypting && (
        <>
          {prevUserId && (
            <div className="swipe-indicator left">
   
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  left: "0",
                  color: "white",
                  fontSize: "12px",
                  background: "rgba(0,0,0,0.7)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >
            
              </div>
            </div>
          )}
          {nextUserId && (
            <div className="swipe-indicator right">

              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  color: "white",
                  fontSize: "12px",
                  background: "rgba(0,0,0,0.7)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >

              </div>
            </div>
          )}

         
        </>
      )} */}
    </div>
  );
};

export default Detail;
