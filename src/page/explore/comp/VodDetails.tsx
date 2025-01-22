import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Player from "@/page/home/components/Player";
import "../../home/home.css";
import "../../home/home.css";
import {
  useCommentListMutation,
  useGetConfigQuery,
  usePostCommentMutation,
} from "@/page/home/services/homeApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoSidebar from "@/page/home/components/VideoSidebar";
import FeedFooter from "@/page/home/components/FeedFooter";
import ShowHeart from "@/page/home/components/ShowHeart";
import { setCurrentTab } from "@/page/home/services/homeSlice";

interface VodDetailsProps {
  // setshow: (value: boolean) => void;
}

const VodDetails: React.FC<VodDetailsProps> = ({}) => {
  const currentTab = useSelector((state: any) => state.home.currentTab);
  // console.log(currentTab);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const { files } = useSelector((state: any) => state.explore);
  const [currentActivePost, setCurrentActivePost] = useState<any>(
    files?.post_id
  );
  const user = useSelector((state: any) => state.persist.user);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [countdown, setCountdown] = useState(3);
  const { data: config } = useGetConfigQuery({});
  const [content, setContent] = useState<string>("");
  const [postComment] = usePostCommentMutation();
  const [showTip, setShowTip] = useState(false);
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getComments, { data: commentData }] = useCommentListMutation();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [mute, setMute] = useState(false);
  const [rotateVideoId, setRotateVideoId] = useState<string | null>(null); // For controlling fullscreen per video

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container && files.post_id) {
      const activeElement = container.querySelector(
        `[data-post-id="${files.post_id}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" });
      }
    }
  }, [files.post_id]);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || files.files[0].length === 0) return;

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
  }, [files.files[0]]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleComment = async (post_id: { post_id: any }) => {
    if (user?.token) {
      if (!content.trim()) return;

      try {
        await postComment({
          post_id: files.post_id, // Assuming all comments belong to the same post
          content: content,
        }).unwrap();
        setContent("");
        setShowTip(true);

        setTimeout(() => {
          setShowTip(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to post reply:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleBack = () => {
    // setCurrentTab(1);
    navigate(-1);
  };

  const handleSearch = () => {
    navigate("/search_overlay");
  };

  const handleFullscreen = (postId: string) => {
    if (rotateVideoId === postId) {
      // If the clicked video is already in fullscreen, exit fullscreen
      setRotateVideoId(null);
    } else {
      // Otherwise, set the clicked video to fullscreen
      setRotateVideoId(postId);
    }
  };

  return (
    <div className="app bg-black">
      {/* tip */}
      {showTip && (
        <div className="absolute top-[100px] z-[999991] w-screen flex justify-center">
          <div className="py-[8px] px-[12px] text-white text-[14px] font-[500] leading-[20px] tip_comment">
            Comment added
          </div>
        </div>
      )}
      <div ref={videoContainerRef} className={`app__videos`}>
        <div
          // key={index}
          className="video mt-[10px] pb-[68px]"
          data-post-id={files.post_id}
        >
          <Player
            rotate={rotateVideoId === files?.post_id}
            src={files.files[0].resourceURL}
            thumbnail={
              files?.preview_image ||
              "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
            }
            mute={mute}
          />
          <VideoSidebar
            post={files.files[0]}
            likes={files?.like_count}
            is_liked={files?.is_liked}
            messages={files?.comment_count}
            post_id={files?.post_id}
            // likes={files?.files[0].like_count}
            // is_liked={files?.files[0].is_liked}
            // messages={files?.files[0].comment_count}
            // post_id={files?.files[0].post_id}
            setCountNumber={setCountNumber}
            setCountdown={setCountdown}
            setShowHeart={setShowHeart}
            countNumber={countNumber}
            showHeart={showHeart}
            countdown={countdown}
            config={config?.data}
            image={files?.preview_image}
            setMute={setMute}
            mute={mute}
          />
          <FeedFooter
            tags={files?.tag}
            title={files?.title}
            username={files?.user?.name}
            city={files?.city}
          />
          {/* {+files.files[0].width > +files.files[0].height ? (
            <>
              <button
                onClick={() => handleFullscreen(files.post_id)}
                className={`absolute ${
                  rotateVideoId === files.post_id
                    ? " top-[10px] right-[10px] w-[40px] bg-transparent"
                    : "left-[37%] top-[70%] bottom-0 right-0 w-[120px] bg-[#101010]"
                }   h-[35px] rounded-md flex justify-center items-center z-[9999] text-center  text-white `}
              >
                {rotateVideoId === files.post_id ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M13.4595 8.9178C13.5429 8.81955 13.6091 8.70284 13.6543 8.57434C13.6994 8.44584 13.7227 8.30808 13.7227 8.16896C13.7227 8.02983 13.6994 7.89208 13.6543 7.76358C13.6091 7.63508 13.5429 7.51836 13.4595 7.42011L7.50487 0.388566C7.43858 0.310125 7.35984 0.247892 7.27315 0.205431C7.18647 0.16297 7.09354 0.141113 6.99969 0.141113C6.90585 0.141113 6.81292 0.16297 6.72623 0.205431C6.63955 0.247892 6.56081 0.310125 6.49452 0.388566L0.539875 7.42011C0.188759 7.83473 0.188759 8.50319 0.539875 8.9178C0.89099 9.33242 1.45708 9.33242 1.80819 8.9178L7.00328 2.79164L12.1984 8.92626C12.5423 9.33242 13.1156 9.33242 13.4595 8.9178Z"
                        fill="white"
                      />
                    </svg>
                  </>
                ) : (
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
                )}
              </button>
            </>
          ) : (
            <></>
          )} */}
          <div className="absolute top-3 left-0 z-50 flex gap-2 items-center w-full">
            <button onClick={handleBack} className="p-3">
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
                placeholder={files.tag[0]}
                onClick={handleSearch}
              />
            </div>
          </div>

          {showHeart && (
            <ShowHeart countNumber={countNumber} username={user?.nickname} />
          )}
          <div className="absolute mt- bottom-0 add_comment w-full  py-3 z-10 ">
            <div className="flex items-center gap-2 px-4">
              <input
                type="text"
                className="w-full p-[6px] bg-transparent border-none outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment"
              />
              <button
                className="comment_arrow p-3"
                onClick={() => handleComment(files?.post_id)}
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
      </div>
      <p></p>
    </div>
  );
};

export default VodDetails;
