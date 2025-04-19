import React, { useEffect, useRef, useState } from "react";
import { useGetConfigQuery, usePostCommentMutation } from "../services/homeApi";
// import Player from "./Player";
// import VideoSidebar from "./VideoSidebar";
import Top20Movies from "./Top20Movies";
import { useDispatch, useSelector } from "react-redux";
import FeedFooter from "./FeedFooter";
import { useNavigate } from "react-router-dom";
// import SearchPlayer from "./SearchPlayer";
import HeartCount from "./Heart";
import VideoContainer from "./VideoContainer";
// import { setVideos } from "../services/videosSlice";
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

const VideoFeed = ({
  videos,
  currentActiveId,
  setShowVideoFeed,
  query,
  setVideos,
  search = false,
}: {
  videos: any;
  currentActiveId: any;
  setShowVideoFeed: any;
  query: any;
  setVideos: any;
  search: any;
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [currentActivePost, setCurrentActivePost] =
    useState<any>(currentActiveId); // Active post ID

  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const { data: config } = useGetConfigQuery({});
  const user = useSelector((state: any) => state.persist.user);
  // const profile = useSelector((state: any) => state.persist.profileData);
  // const { data: user1, refetch: refetchUser } = useGetMyOwnProfileQuery({});

  // const { data: user1, refetch: refetchUser } = useGetMyOwnProfileQuery("", {
  //   skip: !user,
  // });

  // const profile = user1?.data;

  const [postComment] = usePostCommentMutation();

  const navigate = useNavigate();
  const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
  const [videosPerLoad, setVideosPerLoad] = useState(3); // Number of videos to initially render
  const [start, setStart] = useState(false);
  const abortControllerRef = useRef<AbortController[]>([]); // Array to store AbortControllers
  const videoData = useRef<any[]>([]); // Array to store AbortControllers
  const indexRef = useRef(0); // Track the current active video index
  const [showHeart, setShowHeart] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(true);
  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

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
      // Find the index of the video with currentActiveId
      const activeVideoIndex = videos.findIndex(
        (video: any) => video.post_id === currentActiveId
      );

      // If the video with currentActiveId exists, move it to the beginning
      let initialVideos = [...videos];
      if (activeVideoIndex !== -1) {
        const activeVideo = initialVideos.splice(activeVideoIndex, 1)[0];
        initialVideos.unshift(activeVideo);
      }

      // Slice the first `videosPerLoad` videos for initial render

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

  // Scroll to the first current post when the component is mounted
  useEffect(() => {
    const container = videoContainerRef.current;
    if (container && currentActiveId) {
      const activeElement = container.querySelector(
        `[data-post-id="${currentActiveId}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" });
      }
    }
  }, [currentActiveId]);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              setCurrentActivePost(postId);
            }
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    // Observe only the videos in view
    Array.from(container.children).forEach((child) => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [videos]);

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
            message: response?.message,
            type: "success",
          })
        );
      } catch (error) {
        dispatch(
          showToast({
            message: error?.data?.message,
            type: "success",
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
          <div
            ref={videoContainerRef}
            className={`app__videos ${isOpen ? "opacity-50" : ""}`}
            style={{ pointerEvents: isOpen ? "none" : "auto" }}
          >
            <div className="fixed top-3 left-0  flex gap-2 items-center w-full z-[9999]">
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
                  {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M18.6369 13.2917C18.8889 12.5015 19.0249 11.6596 19.0249 10.7859C19.0249 6.23534 15.3359 2.54639 10.7854 2.54639C6.23486 2.54639 2.5459 6.23534 2.5459 10.7859C2.5459 15.3364 6.23486 19.0254 10.7854 19.0254C12.9514 19.0254 14.9222 18.1896 16.3929 16.8229"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.5166 16.9448L19.7469 20.1668"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg> */}
                  <img src={sc} alt="" />
                </div>
                <input
                  className="feed-input w-full pl-[45px] py-[8px]"
                  placeholder={query}
                  onClick={handleSearch}
                />
              </div>
            </div>
            {videosToRender.map((video: any, index: any) => (
              <div
                key={index}
                className="video1 mt-[20px] pb-[68px]"
                data-post-id={video.post_id} // Add post ID to the container
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
                    container={videoContainerRef.current}
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

                {video?.type !== "ads" && video?.type !== "ads_virtual" && (
                  <FeedFooter
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

                {/*
            {showHeart && (
              <ShowHeartCom
                countNumber={countNumber}
                nickname={profile?.nickname}
                photo={profile?.profile_photo}
              />
            )}

            {showHeart && (
              <div className="absolute bottom-[350px] right-[70px] transform z-[999]">
                <CountdownCircle countNumber={countNumber} />
              </div>
            )} */}
                <div className="absolute bottom-0 add_comment w-full  py-3 ">
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
                      onClick={() => handleComment(video?.post_id)}
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
                </div>
              </div>
            ))}
          </div>
        )}

        {!videos?.length && (
          <p style={{ textAlign: "center" }}>
            <b>You have seen all videos</b>
          </p>
        )}
      </div>
    </>
  );
};

export default React.memo(VideoFeed);

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
