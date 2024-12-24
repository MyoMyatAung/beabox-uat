import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useLikePostMutation,
  useCommentListMutation,
} from "../services/homeApi";
import qr from "../qr.png";
import spider from "../spider.png";
import CommentOverlay from "./CommentOverlay";

function VideoSidebar({
  likes,
  messages,
  is_liked,
  post_id,
  setCountdown,
  setCountNumber,
  setShowHeart,
  showHeart,
  countdown,
  config,
  image,
}: {
  likes: any;
  messages: any;
  is_liked: any;
  post_id: any;
  setCountdown: any;
  setCountNumber: any;
  setShowHeart: any;
  showHeart: any;
  countdown: any;
  config: any;
  image: any;
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(is_liked);

  const [likePost] = useLikePostMutation();
  const [getComments, { data: commentData }] = useCommentListMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isClosingAlert, setIsClosingAlert] = useState(false); // Tracks the closing animation state

  const alertRef = useRef<HTMLDivElement>(null); // Reference to the alert box

  // Handle comment list fetching and visibility
  const handleCommentList = async () => {
    setCommentsVisible(true);
    setIsLoading(true);
    try {
      const response = await getComments({ post_id });
      if (response && response.data) {
        setComments(response && ((response as any).data.data as any[]));
      }
    } catch (error) {
      console.error("Error fetching comment list:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const refetchComments = async () => {
    setCommentsVisible(true);
    setIsLoading(false);
    try {
      const response = await getComments({ post_id });
      if (response && response.data) {
        setComments((response as any).data.data);
      }
    } catch (error) {
      console.error("Error refetching comment list:", error);
    }
  };

  // Handle like click
  const handleLike = async () => {
    try {
      setLikeCount((prev: any) => +prev + 1);
      setIsLiked(true);
      setCountNumber((prev: any) => prev + 1);

      // Show the heart animation
      setShowHeart(true);
      setCountdown(3); // Reset countdown
      await likePost({ post_id });
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleShareClick = () => {
    setAlertVisible(true);
  };

  // Close alert box if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        alertRef.current &&
        !alertRef.current?.contains(event.target as Node)
      ) {
        setAlertVisible(false); // Close alert if clicked outside
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAlertClose = () => {
    setIsClosingAlert(true); // Trigger closing animation
    setTimeout(() => {
      setAlertVisible(false);
      setIsClosingAlert(false); // Reset closing animation state
    }, 300); // Match animation duration
  };

  // Close alert box if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        alertRef.current &&
        !alertRef.current.contains(event.target as Node)
      ) {
        handleAlertClose();
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle heart animation with countdown
  useEffect(() => {
    if (showHeart) {
      let currentCountdown = countdown; // Use a local variable to avoid state delays
      const interval = setInterval(() => {
        if (currentCountdown <= 1) {
          clearInterval(interval); // Stop the interval when countdown reaches 0
          setShowHeart(false); // Hide the heart animation
        } else {
          currentCountdown -= 1; // Decrement the local countdown
          setCountdown(currentCountdown); // Update state
        }
      }, 1000);

      return () => {
        clearInterval(interval); // Clear the interval on unmount or cleanup
      };
    }
  }, [showHeart, countdown]);

  // Close the comment list

  const closeCommentList = () => {
    setCommentsVisible(false);
  };

  return (
    <div className="videoSidebar z-[999]">
      <div className="videoSidebar__button">
        <div className="flex flex-col items-center relative">
          <Avatar className="w-[35.25px] h-[35.25px] border-2 border-white ">
            <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <button className="flex justify-center items-center absolute -bottom-2">
            <span className="bg-red-500 py-[0.3px] px-1.5 rounded-full text-xs">
              +
            </span>
          </button>
        </div>
      </div>

      <div className="videoSidebar__button">
        {isLiked ? (
          <button onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="25"
              viewBox="0 0 27 25"
              fill="none"
            >
              <path
                d="M19.6249 2.1001C17.3018 2.1001 15.2678 3.0991 13.9999 4.78772C12.732 3.0991 10.698 2.1001 8.3749 2.1001C6.52566 2.10218 4.75275 2.83772 3.44513 4.14533C2.13752 5.45294 1.40199 7.22585 1.3999 9.0751C1.3999 16.9501 13.0763 23.3243 13.5735 23.5876C13.7046 23.6581 13.8511 23.695 13.9999 23.695C14.1487 23.695 14.2952 23.6581 14.4263 23.5876C14.9235 23.3243 26.5999 16.9501 26.5999 9.0751C26.5978 7.22585 25.8623 5.45294 24.5547 4.14533C23.2471 2.83772 21.4741 2.10218 19.6249 2.1001Z"
                fill="#F70F2D"
              />
            </svg>
          </button>
        ) : (
          <button onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="25"
              viewBox="0 0 27 25"
              fill="none"
            >
              <path
                d="M19.625 2.1001C17.3019 2.1001 15.2679 3.0991 14 4.78772C12.7321 3.0991 10.6981 2.1001 8.37502 2.1001C6.52578 2.10218 4.75287 2.83772 3.44526 4.14533C2.13764 5.45294 1.40211 7.22585 1.40002 9.0751C1.40002 16.9501 13.0764 23.3243 13.5736 23.5876C13.7047 23.6581 13.8512 23.695 14 23.695C14.1488 23.695 14.2953 23.6581 14.4264 23.5876C14.9236 23.3243 26.6 16.9501 26.6 9.0751C26.5979 7.22585 25.8624 5.45294 24.5548 4.14533C23.2472 2.83772 21.4743 2.10218 19.625 2.1001Z"
                fill="white"
              />
            </svg>
          </button>
        )}
        <p className="side_text mt-2">{likeCount}</p>
      </div>

      <div className="videoSidebar__button">
        <button onClick={handleCommentList}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="26"
            viewBox="0 0 27 26"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M26.625 12.1714C26.625 13.8414 26.2005 15.4264 25.4389 16.8515C25.4327 16.8676 25.426 16.8836 25.4185 16.8996C24.0105 19.9167 21.6666 22.399 18.735 23.9775L15.4702 25.7355C14.6329 26.1864 13.6324 25.5166 13.7303 24.5706L13.8495 23.4175C13.7334 23.4201 13.6169 23.4214 13.5 23.4214C6.25126 23.4214 0.375 18.3846 0.375 12.1714C0.375 5.95818 6.25126 0.921387 13.5 0.921387C20.7487 0.921387 26.625 5.95818 26.625 12.1714ZM6.75 14.4214C7.78553 14.4214 8.625 13.5819 8.625 12.5464C8.625 11.5109 7.78553 10.6714 6.75 10.6714C5.71447 10.6714 4.875 11.5109 4.875 12.5464C4.875 13.5819 5.71447 14.4214 6.75 14.4214ZM15.375 12.5464C15.375 13.5819 14.5355 14.4214 13.5 14.4214C12.4645 14.4214 11.625 13.5819 11.625 12.5464C11.625 11.5109 12.4645 10.6714 13.5 10.6714C14.5355 10.6714 15.375 11.5109 15.375 12.5464ZM20.25 14.4214C21.2855 14.4214 22.125 13.5819 22.125 12.5464C22.125 11.5109 21.2855 10.6714 20.25 10.6714C19.2145 10.6714 18.375 11.5109 18.375 12.5464C18.375 13.5819 19.2145 14.4214 20.25 14.4214Z"
              fill="white"
            />
          </svg>
        </button>
        <p className="side_text mt-2">{messages}</p>
      </div>
      <div className="videoSidebar__button">
        <button onClick={handleShareClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="22"
            viewBox="0 0 27 22"
            fill="none"
          >
            <path
              d="M25.9958 12.0886L16.9835 21.1009C16.6153 21.469 16.0626 21.5789 15.581 21.3797C15.1006 21.1806 14.7868 20.7111 14.7868 20.1909V16.349C6.21141 16.6411 2.8488 19.7876 2.81512 19.8213H2.81391C2.40717 20.2172 1.78801 20.2993 1.29074 20.0241C0.793471 19.7477 0.535196 19.1792 0.655883 18.624C0.682435 18.5021 3.39566 6.8949 14.7867 6.07425V2.16629C14.7867 1.64609 15.1005 1.1766 15.5809 0.977429C16.0625 0.778283 16.6153 0.888116 16.9834 1.25623L25.9957 10.2685C26.2371 10.5099 26.3735 10.837 26.3735 11.1786C26.3735 11.5201 26.2371 11.8472 25.9957 12.0886L25.9958 12.0886Z"
              fill="white"
            />
          </svg>

          <p className="side_text mt-2">Share</p>
        </button>
      </div>
      {/* Alert Box */}
      {alertVisible && (
        <div
          ref={alertRef} // Attach the ref to the alert box
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 w-[320px] z-50 share ${
            isClosingAlert ? "animate-fade-out" : "animate-fade-in"
          }`}
        >
          <h1 className="share_text mb-4">
            Share your thoughts & favorite moments with others
          </h1>
          <div className="mb-4">
            <img src={image} alt="" className="h-[150px] w-full object-fill" />
          </div>
          <div className="grid grid-cols-2 mb-4 justify-items-center items-center">
            <div className="text-right">
              <img src={qr} alt="" width={100} height={100} />
            </div>
            <div>
              <h1 className="qr_text1 mb-2">Scan Qr Code</h1>
              <p className="qr_text2 mb-2">
                If the qr code cannot be open, please enter the link
              </p>
              <p className="qr_text3">{config?.app_download_link}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="share_btn">Save img to share</button>
            <button
              className="share_btn"
              onClick={() => {
                const shareUrl = config?.app_download_link;
                navigator.clipboard.writeText(shareUrl).catch((err) => {
                  console.error("Failed to copy the share link: ", err);
                });
              }}
            >
              Copy share link
            </button>
          </div>
        </div>
      )}

      <CommentOverlay
        post_id={post_id}
        commentsVisible={commentsVisible}
        comments={comments}
        closeCommentList={closeCommentList}
        isLoading={isLoading}
        refetchComments={refetchComments}
        setComments={setComments}
      />
    </div>
  );
}

export default VideoSidebar;
