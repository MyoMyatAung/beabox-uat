import { useEffect, useRef, useState } from "react";
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
import LoginDrawer from "@/components/profile/auth/login-drawer";
import sc from "../../../assets/explore/sc.svg";

const VideoFeed = ({
  videos,
  currentActiveId,
  setShowVideoFeed,
  query,
}: {
  videos: any;
  currentActiveId: any;
  setShowVideoFeed: any;
  query: any;
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
  const [postComment] = usePostCommentMutation();

  const navigate = useNavigate();
  const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [hideBar, sethideBar] = useState(false);
  const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
  const [videosPerLoad, setVideosPerLoad] = useState(3); // Number of videos to initially render
  const [start, setStart] = useState(false);

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

  useEffect(() => {
    if (!start) {
      const initialVideos = videos.slice(0, videosPerLoad) || [];

      if (initialVideos.length > 1) {
        setVideosToRender(initialVideos);
        setStart(true);
      }
    }
  }, [videos]); // Runs only once on mount

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lastFiveVideos =
              videos?.slice(
                videosToRender?.length,
                videosToRender?.length + 3
              ) || [];

            setVideosToRender((prev) => [...prev, ...lastFiveVideos]);
          }
        });
      },
      {
        rootMargin: "100px", // Trigger the observer when 100px from the bottom
        threshold: 0.5, // 50% visibility of the last video
      }
    );

    // Observe the last video element
    if (videosToRender.length > 1) {
      const secondLastVideo = container.children[container.children.length - 1];
      if (secondLastVideo) {
        observer.observe(secondLastVideo);
      }
    }
    // Cleanup observer on component unmount or when dependencies change
    return () => {
      observer.disconnect();
    };
  }, [videosToRender]);

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

  const handleComment = async (post_id: { post_id: any }) => {
    if (user?.token) {
      if (!content.trim()) return;

      try {
        const response = await postComment({
          post_id: post_id, // Assuming all comments belong to the same post
          content: content,
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

  if (isOpen) {
    return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  return (
    <div className="app bg-black">
      <div ref={videoContainerRef} className={`app__videos`}>
        <div className="fixed top-3 left-0  flex gap-2 items-center w-full z-[9999]">
          <button className="p-3" onClick={() => setShowVideoFeed(false)}>
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
            className="video mt-[20px] pb-[68px]"
            data-post-id={video.post_id} // Add post ID to the container
          >
            <VideoContainer
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
              sethideBar={sethideBar}
              hideBar={hideBar}
            />
            {!hideBar && video?.type !== "ads" && (
              <FeedFooter
                badge={video?.user?.badge}
                id={video?.user?.id}
                tags={video?.tag}
                title={video?.title}
                username={video?.user?.name}
                city={video?.city}
              />
            )}

            {video?.type === "ads" && <Ads ads={video?.ads_info} />}

            {hearts.map((id: any) => (
              <HeartCount id={id} key={id} remove={removeHeart} />
            ))}
            <div className="absolute bottom-0 add_comment w-full  py-3 ">
              <div className="flex items-center feed_add_comment gap-2 px-4">
                <input
                  type="text"
                  className="w-full p-[6px] bg-transparent border-none outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a comment"
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

      {!videos?.length && (
        <p style={{ textAlign: "center" }}>
          <b>You have seen all videos</b>
        </p>
      )}
    </div>
  );
};

export default VideoFeed;
