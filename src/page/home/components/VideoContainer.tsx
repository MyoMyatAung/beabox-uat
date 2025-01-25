import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import VideoSidebar from "./VideoSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../services/homeApi";
import { setVideos } from "../services/videosSlice";
import { useNavigate } from "react-router-dom";

const VideoContainer = ({
  video,
  setWidth,
  setHeight,
  setCountNumber,
  setCountdown,
  countNumber,
  config,
  countdown,
  setHearts,
}: {
  video: any;
  setWidth: any;
  setHeight: any;
  setCountNumber: any;
  setCountdown: any;
  countNumber: any;
  config: any;
  countdown: any;
  setHearts: any;
}) => {
  const [likeCount, setLikeCount] = useState(video?.like_count);
  const [isLiked, setIsLiked] = useState(video?.is_liked);
  const { videos } = useSelector((state: any) => state.videoSlice);
  const user = useSelector((state: any) => state.persist.user);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const dispatch = useDispatch();
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const navigate = useNavigate();
  const post_id = video?.post_id;

  console.log("c", isLiked);

  const handleLike = (() => {
    const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout
    const [nextId, setNextId] = useState(0); // Generate unique IDs for hearts

    const handleLikeClick = () => {
      if (user?.token) {
        // if (pendingLike) return; // Prevent further actions if a like is already pending
        const newId = nextId;
        setNextId((prev: any) => prev + 1); // Increment the next ID
        setHearts((prev: any) => [...prev, newId]); // Add the new heart

        // Clear any existing debounce timer
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }

        console.log("aadad");

        // Set up a new debounce timer
        likeTimeout.current = setTimeout(async () => {
          try {
            await likePost({ post_id, count: 1 }); // Pass the accumulated count to the API
            setLikeCount(+likeCount + 1);
            setIsLiked(true);

            dispatch(
              setVideos({
                ...videos,
                [currentTab === 2 ? "foryou" : "follow"]: videos[
                  currentTab === 2 ? "foryou" : "follow"
                ]?.map((video: any) =>
                  video.post_id === post_id
                    ? {
                        ...video,
                        is_liked: true,
                        like_count: +likeCount + 1,
                      }
                    : video
                ),
              })
            );
            setCountNumber(0); // Reset pending likes after a successful API call
          } catch (error) {
            console.error("Error liking the post:", error);
          }
        }, 1000); // Call API 1 second after the last click
      } else {
        navigate("/login");
      }
    };

    useEffect(() => {
      // Cleanup on component unmount
      return () => {
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }
      };
    }, []);

    return handleLikeClick;
  })();

  const unLike = (() => {
    const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout
    // const [nextId, setNextId] = useState(0); // Generate unique IDs for hearts

    const handleUnLikeClick = () => {
      if (user?.token) {
        // if (pendingLike) return; // Prevent further actions if a like is already pending
        // const newId = nextId;
        // setNextId((prev: any) => prev + 1); // Increment the next ID
        // setHearts((prev: any) => [...prev, newId]); // Add the new heart

        // Clear any existing debounce timer
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }

        // Set up a new debounce timer
        likeTimeout.current = setTimeout(async () => {
          try {
            await unlikePost({ post_id }); // Pass the accumulated count to the API
            setLikeCount(+likeCount - 1);
            setIsLiked(false);

            dispatch(
              setVideos({
                ...videos,
                [currentTab === 2 ? "foryou" : "follow"]: videos[
                  currentTab === 2 ? "foryou" : "follow"
                ]?.map((video: any) =>
                  video.post_id === post_id
                    ? {
                        ...video,
                        is_liked: false,
                        like_count: +likeCount - 1,
                      }
                    : video
                ),
              })
            );
            setCountNumber(0); // Reset pending likes after a successful API call
          } catch (error) {
            console.error("Error liking the post:", error);
          }
        }, 1000); // Call API 1 second after the last click
      } else {
        navigate("/login");
      }
    };

    useEffect(() => {
      // Cleanup on component unmount
      return () => {
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }
      };
    }, []);

    return handleUnLikeClick;
  })();

  return (
    <>
      <Player
        src={video.files[0].resourceURL}
        thumbnail={
          video?.preview_image ||
          "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
        }
        handleLike={handleLike}
        setWidth={setWidth}
        setHeight={setHeight}
      />
      <VideoSidebar
        unLike={unLike}
        handleLike={handleLike}
        setLikeCount={setLikeCount}
        likeCount={likeCount}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        // likes={video?.like_count}
        // is_liked={video?.is_liked}
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
    </>
  );
};

export default VideoContainer;
