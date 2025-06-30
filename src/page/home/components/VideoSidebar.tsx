import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useLikePostMutation,
  useCommentListMutation,
  useFollowStatusMutation,
} from "../services/homeApi";

import CommentOverlay from "./CommentOverlay";
import ShareOverlay from "./ShareOverlay";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setVideos } from "../services/videosSlice";
import { setMute } from "../services/muteSlice";

import { setAuthToggle } from "@/store/slices/profileSlice";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import { decryptImage } from "@/utils/imageDecrypt";
import { setVideosToRender } from "../services/videoRenderSlice";
import { setDetails } from "@/store/slices/exploreSlice";
import { sethideBar } from "../services/hideBarSlice";
import { motion } from "framer-motion";
import { sethideNew } from "../services/hideNewSlice";
import { addOnlySeenUser } from "../services/onlyseenUserSlice";

function VideoSidebar({
  messages,
  setCommentCount,
  post_id,
  setCountdown,
  setCountNumber,
  countNumber,
  countdown,
  config,
  image,
  post,
  setLikeCount,
  likeCount,
  isLiked,
  setIsLiked,
  setHearts,
  handleLike,
  unLike,
  status,
}: {
  setCommentCount: any;
  unLike: any;
  setLikeCount: any;
  likeCount: any;
  isLiked: any;
  setIsLiked: any;
  messages: any;
  post_id: any;
  setCountdown: any;
  setCountNumber: any;
  countdown: any;
  countNumber: any;
  config: any;
  image: any;
  post: any;

  handleLike: any;
  setHearts: any;
  status: any;
}) {
  const [alertVisible, setAlertVisible] = useState(false);

  const currentTab = useSelector((state: any) => state.home.currentTab);

  const [likePost] = useLikePostMutation();
  const [getComments, { data: commentData }] = useCommentListMutation();
  const [followStatus] = useFollowStatusMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isClosingAlert, setIsClosingAlert] = useState(false); // Tracks the closing animation state
  const user = useSelector((state: any) => state.persist.user);
  const { mute } = useSelector((state: any) => state.muteSlice);
  const navigate = useNavigate();
  const alertRef = useRef<HTMLDivElement>(null); // Reference to the alert box
  // const [follow, setFollow] = useState(post?.is_followed);
  const dispatch = useDispatch();
  const { videos } = useSelector((state: any) => state.videoSlice);
  const [page, setPage] = useState(1);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);
  const onlyseenUserIds = useSelector(
    (state: any) => state.onlyseenUser.onlyseenUserIds
  );

  const { videosToRender } = useSelector(
    (state: any) => state.videoRenderSlice
  );

  const [isOpen, setIsOpen] = useState(false);

  const { pathname } = useLocation();
  const isHome = currentTab !== 1 && pathname === "/";

  // Handle comment list fetching and visibility
  const handleCommentList = async () => {
    setCommentsVisible(true);
    setIsLoading(true);
    try {
      const response = await getComments({ post_id, page });
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
      const response = await getComments({ post_id, page });
      if (response && response.data) {
        setComments((response as any).data.data);
      }
    } catch (error) {
      console.error("Error refetching comment list:", error);
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

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!post?.user?.avatar) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = post?.user?.avatar;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }
        const decryptedUrl = await decryptImage(photoUrl);
        setDecryptedPhoto(decryptedUrl);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [post?.user?.avatar]);

  // Close the comment list

  const closeCommentList = () => {
    setCommentsVisible(false);
  };

  const handleFollow = async () => {
    if (user?.token) {
      try {
        const res = await followStatus({
          follow_user_id: post?.user?.id,
          status: post?.is_followed ? "unfollow" : "follow",
        });
        // setFollow(!follow);
        // Update the follow status in the videos state
        dispatch(
          setVideos({
            ...videos,
            [currentTab === 2 ? "foryou" : "follow"]: videos[
              currentTab === 2 ? "foryou" : "follow"
            ]?.map((video: any) =>
              video.user.id === post?.user?.id
                ? { ...video, is_followed: !post?.is_followed }
                : video
            ),
          })
        );
        dispatch(
          setVideosToRender(
            videosToRender.map((video: any) =>
              video.user.id === post?.user?.id
                ? { ...video, is_followed: !post?.is_followed }
                : video
            )
          )
        );
        const new_post = { ...post, is_followed: !post?.is_followed };

        if (new_post) {
          dispatch(setDetails(new_post));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleVoice = () => {
    dispatch(setMute(!mute));
  };

  if (isOpen) {
    return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  const handleProfile = (id: any) => {
    const seenUser = onlyseenUserIds.includes(id);

    if (
      post?.user?.my_day?.uploaded &&
      !seenUser &&
      !post?.user?.my_day?.watched
    ) {
      if (!seenUser) {
        dispatch(addOnlySeenUser(id));
      }
      navigate(`/story_detail/${id}`);
    } else {
      navigate(`/user/${id}`);
    }
  };

  return (
    <div
      className={`${
        isHome ? "videoSidebar" : "videoSidebar_exp"
      } z-[999] w-[50px]
`}
    >
      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideNew || hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideNew || hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideNew || hideBar ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-center relative mb-2">
          <button onClick={() => handleProfile(post?.user?.id)}>
            {post?.type === "ads" ? (
              <>
                {post?.ads_info?.icon ? (
                  <Avatar className="w-[40.25px] h-[40.25px] ">
                    <AvatarImage src={post?.ads_info?.icon} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-[40.25px] p-3 bg-[#3a374d] flex justify-center items-center h-[40.25px] ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="30"
                      viewBox="0 0 21 30"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.3206 17.5712C4.82551 17.5712 0.00585938 20.804 0.00585938 24.4875C0.00585938 29.2271 7.77035 29.2271 10.3206 29.2271C12.8709 29.2271 20.634 29.2271 20.634 24.4566C20.634 20.7885 15.8143 17.5712 10.3206 17.5712Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.2666 14.4974H10.3102C14.0948 14.4974 17.1731 11.4191 17.1731 7.63443C17.1731 3.85117 14.0948 0.772888 10.3102 0.772888C6.52559 0.772888 3.4473 3.85117 3.4473 7.63162C3.43467 11.4036 6.49188 14.4834 10.2666 14.4974Z"
                        fill="white"
                      />
                    </svg>
                  </Avatar>
                )}
              </>
            ) : (
              <>
                {decryptedPhoto ? (
                  post.user?.my_day?.uploaded ? (
                    <div
                      className="w-[47px] h-[47px] rounded-full p-[2px]"
                      style={{
                        background:
                          !post.user?.my_day?.watched &&
                          !onlyseenUserIds.includes(post?.user?.id)
                            ? "linear-gradient(#16131C 0 0) padding-box, " +
                              "linear-gradient(90deg, #e8b9ff 0%, #ff94b4 82.89%) border-box"
                            : "linear-gradient(#16131C 0 0) padding-box, " +
                              "rgba(255, 255, 255, 0.40) border-box",
                        border: "3px solid transparent",
                        padding: "3px",
                      }}
                    >
                      <img
                        src={decryptedPhoto}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <Avatar className="w-[40.25px] h-[40.25px]">
                      <AvatarImage src={decryptedPhoto} />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                  )
                ) : (
                  <Avatar className="w-[40.25px] p-3 bg-[#3a374d] flex justify-center items-center h-[40.25px] ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="30"
                      viewBox="0 0 21 30"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.3206 17.5712C4.82551 17.5712 0.00585938 20.804 0.00585938 24.4875C0.00585938 29.2271 7.77035 29.2271 10.3206 29.2271C12.8709 29.2271 20.634 29.2271 20.634 24.4566C20.634 20.7885 15.8143 17.5712 10.3206 17.5712Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.2666 14.4974H10.3102C14.0948 14.4974 17.1731 11.4191 17.1731 7.63443C17.1731 3.85117 14.0948 0.772888 10.3102 0.772888C6.52559 0.772888 3.4473 3.85117 3.4473 7.63162C3.43467 11.4036 6.49188 14.4834 10.2666 14.4974Z"
                        fill="white"
                      />
                    </svg>
                    {/* <AvatarFallback>SM</AvatarFallback> */}
                  </Avatar>
                )}
              </>
              // <>
              //   {decryptedPhoto ? (
              //     <Avatar className="w-[40.25px] h-[40.25px]">
              //       <AvatarImage src={decryptedPhoto} />
              //       <AvatarFallback>SM</AvatarFallback>
              //     </Avatar>
              //   ) : (
              //     <Avatar className="w-[40.25px] p-3 bg-[#3a374d] flex justify-center items-center h-[40.25px] ">
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         width="21"
              //         height="30"
              //         viewBox="0 0 21 30"
              //         fill="none"
              //       >
              //         <path
              //           fill-rule="evenodd"
              //           clip-rule="evenodd"
              //           d="M10.3206 17.5712C4.82551 17.5712 0.00585938 20.804 0.00585938 24.4875C0.00585938 29.2271 7.77035 29.2271 10.3206 29.2271C12.8709 29.2271 20.634 29.2271 20.634 24.4566C20.634 20.7885 15.8143 17.5712 10.3206 17.5712Z"
              //           fill="white"
              //         />
              //         <path
              //           fill-rule="evenodd"
              //           clip-rule="evenodd"
              //           d="M10.2666 14.4974H10.3102C14.0948 14.4974 17.1731 11.4191 17.1731 7.63443C17.1731 3.85117 14.0948 0.772888 10.3102 0.772888C6.52559 0.772888 3.4473 3.85117 3.4473 7.63162C3.43467 11.4036 6.49188 14.4834 10.2666 14.4974Z"
              //           fill="white"
              //         />
              //       </svg>
              //       {/* <AvatarFallback>SM</AvatarFallback> */}
              //     </Avatar>
              //   )}
              // </>
            )}
          </button>

          <button
            className="flex justify-center items-center absolute -bottom-2"
            onClick={handleFollow}
          >
            {post?.is_followed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <circle cx="8.5" cy="8.29657" r="7.875" fill="#F70F2D" />
                <path
                  d="M11.6667 6L7.08333 10.5833L5 8.5"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <span className="bg-red-500 py-[1.5px] px-1.5 rounded-full text-xs">
                +
              </span>
            )}
          </button>
        </div>
      </motion.div>
      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideNew || hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideNew || hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideNew || hideBar ? "none" : "auto",
        }}
      >
        {isLiked ? (
          <button onClick={unLike}>
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
        <p className="side_text font-cnFont mt-2">{likeCount}</p>
      </motion.div>
      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideNew || hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideNew || hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideNew || hideBar ? "none" : "auto",
        }}
      >
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
        <p className="side_text font-cnFont mt-2">{messages}</p>
      </motion.div>

      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideNew || hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideNew || hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideNew || hideBar ? "none" : "auto",
        }}
      >
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

          <p className="side_text font-cnFont mt-2">分享</p>
        </button>
      </motion.div>

      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideNew || hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideNew || hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideNew || hideBar ? "none" : "auto",
        }}
      >
        <button onClick={handleVoice}>
          {mute ? (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
              >
                <path
                  d="M11.3751 2.76996C11.3749 2.61332 11.3283 2.46025 11.2412 2.33008C11.154 2.19991 11.0303 2.09847 10.8856 2.03856C10.7408 1.97865 10.5816 1.96295 10.4279 1.99344C10.2743 2.02394 10.1331 2.09927 10.0223 2.20991L6.21668 6.01437C6.06982 6.16212 5.89509 6.27924 5.70263 6.35897C5.51017 6.4387 5.3038 6.47943 5.09547 6.47882H2.37849C2.08023 6.47882 1.79419 6.59731 1.58329 6.80821C1.37239 7.01911 1.25391 7.30515 1.25391 7.6034V14.3509C1.25391 14.6491 1.37239 14.9352 1.58329 15.1461C1.79419 15.357 2.08023 15.4755 2.37849 15.4755H5.09547C5.3038 15.4749 5.51017 15.5156 5.70263 15.5953C5.89509 15.6751 6.06982 15.7922 6.21668 15.9399L10.0211 19.7455C10.132 19.8566 10.2734 19.9323 10.4273 19.963C10.5813 19.9937 10.7409 19.978 10.8859 19.9179C11.0309 19.8578 11.1548 19.756 11.2419 19.6254C11.329 19.4948 11.3754 19.3413 11.3751 19.1843V2.76996Z"
                  fill="white"
                />
                <path
                  d="M23.7455 7.6034L16.998 14.3509M16.998 7.6034L23.7455 14.3509M11.3751 2.76996C11.3749 2.61332 11.3283 2.46025 11.2412 2.33008C11.154 2.19991 11.0303 2.09847 10.8856 2.03856C10.7408 1.97865 10.5816 1.96295 10.4279 1.99344C10.2743 2.02394 10.1331 2.09927 10.0223 2.20991L6.21668 6.01437C6.06982 6.16211 5.89509 6.27924 5.70263 6.35897C5.51017 6.4387 5.3038 6.47943 5.09547 6.47882H2.37849C2.08023 6.47882 1.79419 6.59731 1.58329 6.80821C1.37239 7.01911 1.25391 7.30515 1.25391 7.6034V14.3509C1.25391 14.6491 1.37239 14.9352 1.58329 15.1461C1.79419 15.357 2.08023 15.4755 2.37849 15.4755H5.09547C5.3038 15.4749 5.51017 15.5156 5.70263 15.5953C5.89509 15.6751 6.06982 15.7922 6.21668 15.9399L10.0211 19.7455C10.132 19.8566 10.2734 19.9323 10.4273 19.963C10.5813 19.9937 10.7409 19.978 10.8859 19.9179C11.0309 19.8578 11.1548 19.756 11.2419 19.6254C11.329 19.4948 11.3754 19.3413 11.3751 19.1843V2.76996Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">取消静音</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
              >
                <path
                  d="M11.3751 2.76996C11.3749 2.61332 11.3283 2.46025 11.2412 2.33008C11.154 2.19991 11.0303 2.09847 10.8856 2.03856C10.7408 1.97865 10.5816 1.96295 10.4279 1.99344C10.2743 2.02394 10.1331 2.09927 10.0223 2.20991L6.21668 6.01437C6.06982 6.16212 5.89509 6.27924 5.70263 6.35897C5.51017 6.4387 5.3038 6.47943 5.09547 6.47882H2.37849C2.08023 6.47882 1.79419 6.59731 1.58329 6.80821C1.37239 7.01911 1.25391 7.30515 1.25391 7.6034V14.3509C1.25391 14.6491 1.37239 14.9352 1.58329 15.1461C1.79419 15.357 2.08023 15.4755 2.37849 15.4755H5.09547C5.3038 15.4749 5.51017 15.5156 5.70263 15.5953C5.89509 15.6751 6.06982 15.7922 6.21668 15.9399L10.0211 19.7455C10.132 19.8566 10.2734 19.9323 10.4273 19.963C10.5813 19.9937 10.7409 19.978 10.8859 19.9179C11.0309 19.8578 11.1548 19.756 11.2419 19.6254C11.329 19.4948 11.3754 19.3413 11.3751 19.1843V2.76996Z"
                  fill="white"
                />
                <path
                  d="M16.998 7.60337C17.728 8.57668 18.1226 9.76049 18.1226 10.9771C18.1226 12.1937 17.728 13.3776 16.998 14.3509M20.7814 18.1339C21.7213 17.1941 22.4668 16.0783 22.9755 14.8504C23.4841 13.6224 23.7459 12.3062 23.7459 10.9771C23.7459 9.64795 23.4841 8.33182 22.9755 7.10384C22.4668 5.87587 21.7213 4.76011 20.7814 3.82027M11.3751 2.76996C11.3749 2.61332 11.3283 2.46025 11.2412 2.33008C11.154 2.19991 11.0303 2.09847 10.8856 2.03856C10.7408 1.97865 10.5816 1.96295 10.4279 1.99344C10.2743 2.02394 10.1331 2.09927 10.0223 2.20991L6.21668 6.01437C6.06982 6.16211 5.89509 6.27924 5.70263 6.35897C5.51017 6.4387 5.3038 6.47943 5.09547 6.47882H2.37849C2.08023 6.47882 1.79419 6.59731 1.58329 6.80821C1.37239 7.01911 1.25391 7.30515 1.25391 7.6034V14.3509C1.25391 14.6491 1.37239 14.9352 1.58329 15.1461C1.79419 15.357 2.08023 15.4755 2.37849 15.4755H5.09547C5.3038 15.4749 5.51017 15.5156 5.70263 15.5953C5.89509 15.6751 6.06982 15.7922 6.21668 15.9399L10.0211 19.7455C10.132 19.8566 10.2734 19.9323 10.4273 19.963C10.5813 19.9937 10.7409 19.978 10.8859 19.9179C11.0309 19.8578 11.1548 19.756 11.2419 19.6254C11.329 19.4948 11.3754 19.3413 11.3751 19.1843V2.76996Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">静音</p>
            </div>
          )}
        </button>
      </motion.div>
      <motion.div
        className="videoSidebar__button"
        initial={false} // Disable initial animation
        animate={{
          x: hideBar ? 50 : 0, // Slide right when hidden
          opacity: hideBar ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        style={{
          pointerEvents: hideBar ? "none" : "auto",
        }}
      >
        <button onClick={() => dispatch(sethideNew(!hideNew))}>
          {hideNew ? (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M24.5 24H15.042V21.3525H21.8525V14.542H24.5V24Z"
                  fill="white"
                />
                <path
                  d="M9.1582 23.2217H6.51074V19.7793L2.40625 23.8838L0.552734 22.0303L4.65723 17.9258H1.21484V15.2783H9.1582V23.2217Z"
                  fill="white"
                />
                <path
                  d="M9.95801 2.64746H3.14746V9.45801H0.5V0H9.95801V2.64746Z"
                  fill="white"
                />
                <path
                  d="M24.3838 1.90625L20.2793 6.01074H23.7217V8.65918H15.7783V0.714844H18.4258V4.15723L22.5303 0.0527344L24.3838 1.90625Z"
                  fill="white"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">退出全屏</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M24.5 24.8066H15.0419V22.159H21.8523V15.3486H24.5V24.8066Z"
                  fill="white"
                />
                <path
                  d="M9.15849 17.9382L5.05415 22.0423H8.49644V24.6902H0.552874V16.7467H3.20081V20.1889L7.30491 16.0846L9.15849 17.9382Z"
                  fill="white"
                />
                <path
                  d="M9.95806 3.45433H3.14769V10.2647H0.5V0.806641H9.95806V3.45433Z"
                  fill="white"
                />
                <path
                  d="M24.3836 8.80308H21.7356V5.36079L17.6315 9.46513L15.778 7.61155L19.8823 3.50745H16.44V0.859515H24.3836V8.80308Z"
                  fill="white"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">全屏</p>
            </div>
          )}
        </button>
      </motion.div>

      <div
        style={{
          opacity: hideBar ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: hideBar ? "none" : "auto",
        }}
      >
        <ShareOverlay
          alertVisible={alertVisible}
          setAlertVisible={setAlertVisible}
          config={config}
          post={post}
          status={status}
        />

        <CommentOverlay
          setCommentCount={setCommentCount}
          post_id={post_id}
          commentsVisible={commentsVisible}
          comments={comments}
          closeCommentList={closeCommentList}
          isLoading={isLoading}
          refetchComments={refetchComments}
          setComments={setComments}
          page={page}
          setPage={setPage}
          getComments={getComments}
          comment_count={post?.comment_count}
        />
      </div>
    </div>
  );
}

export default VideoSidebar;
