import { useEffect, useRef, useState } from "react";
import { useGetConfigQuery, usePostCommentMutation } from "../services/homeApi";
import Player from "./Player";

import VideoSidebar from "./VideoSidebar";

import Top20Movies from "./Top20Movies";
import { useSelector } from "react-redux";
import FeedFooter from "./FeedFooter";
import { useNavigate } from "react-router-dom";
import SearchPlayer from "./SearchPlayer";
import HeartCount from "./Heart";

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

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

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
            // Get the post ID of the currently visible video
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              setCurrentActivePost(postId);
            }
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 } // Trigger when 50% of the video is visible
    );

    // Observe all video elements
    Array.from(container.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
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
        await postComment({
          post_id: post_id, // Assuming all comments belong to the same post
          content: content,
        }).unwrap();
        setContent("");
      } catch (error) {
        console.error("Failed to post reply:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleSearch = () => {
    navigate("/search_overlay");
  };

  const sendEventToNative = (name: string, text: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };

  // console.log(config?.data);

  const handleFullscreen = (video: any) => {
    sendEventToNative("beabox_fullscreen", {
      post_id: video?.post_id,
      like_api_url: `${import.meta.env.VITE_API_URL}/post/like`,
      token: `Bearer ${user?.token}`,
      video_url: video?.files[0].resourceURL,
      share_link: config?.data?.share_link,
      title: video.title,
      like_count: video?.like_count,
      is_like: video?.is_liked,
    });
  };

  return (
    <div className="app bg-black">
      <div ref={videoContainerRef} className={`app__videos`}>
        {videos.map((video: any, index: any) => (
          <div
            key={index}
            className="video mt-[20px] pb-[68px]"
            data-post-id={video.post_id} // Add post ID to the container
          >
            <SearchPlayer
              src={video.files[0].resourceURL}
              thumbnail={
                video?.preview_image ||
                "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
              }
              setWidth={setWidth}
              setHeight={setHeight}
            />
            <VideoSidebar
              likes={video?.like_count}
              is_liked={video?.is_liked}
              messages={video?.comment_count}
              post_id={video?.post_id}
              setCountNumber={setCountNumber}
              setCountdown={setCountdown}
              countNumber={countNumber}
              countdown={countdown}
              config={config?.data}
              image={video?.preview_image}
              post={video}
              setHearts={setHearts}
            />
            {width > height && (
              <>
                <button
                  onClick={() => handleFullscreen(video)}
                  className={`absolute 
                                left-[37%] top-[70%] bottom-0 right-0 w-[100px] bg-[#101010]
                            h-[35px] rounded-md flex justify-center items-center z-[99] text-center  text-white `}
                >
                  <div className=" flex items-center p-1 gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                    >
                      <path
                        d="M11.9279 4.03607L10.664 2.68779C10.6123 2.63272 10.5969 2.55002 10.6249 2.47798C10.6528 2.40611 10.7186 2.35917 10.7916 2.35917L11.3304 2.35917C11.2894 1.07625 10.8481 0.573193 10.8434 0.568154L10.8434 0.567974C10.7879 0.507124 10.7764 0.414495 10.815 0.340101C10.8537 0.265707 10.9335 0.227068 11.0113 0.245124C11.0284 0.249096 12.6563 0.655005 12.7714 2.35915L13.3195 2.35915C13.3925 2.35915 13.4583 2.4061 13.4863 2.47796C13.5142 2.55001 13.4988 2.63271 13.4471 2.68778L12.1832 4.03606C12.1493 4.07217 12.1035 4.09257 12.0556 4.09257C12.0077 4.09257 11.9618 4.07218 11.9279 4.03607Z"
                        fill="white"
                      />
                      <rect
                        x="0.9"
                        y="0.640723"
                        width="7.38519"
                        height="11.7185"
                        rx="1.6"
                        stroke="white"
                        stroke-width="0.8"
                      />
                      <path
                        d="M9.16667 6.01855L11.5 6.01855C12.6046 6.01855 13.5 6.91399 13.5 8.01855L13.5 10.2778C13.5 11.3824 12.6046 12.2778 11.5 12.2778L9.16667 12.2778"
                        stroke="white"
                        stroke-width="0.8"
                      />
                    </svg>
                    <span>全屏</span>
                  </div>
                </button>
              </>
            )}
            <FeedFooter
              tags={video?.tag}
              title={video?.title}
              username={video?.user?.name}
              city={video?.city}
            />
            <div className="absolute top-3 left-0 z-50 flex gap-2 items-center w-full">
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
                  <svg
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
                  </svg>
                </div>
                <input
                  className="feed-input w-full pl-[45px] py-[8px]"
                  placeholder={query}
                  onClick={handleSearch}
                />
              </div>
            </div>

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
