import { useEffect, useRef, useState } from "react";
import {
  useGetConfigQuery,
  useGetMydayQuery,
  useWatchtPostMutation,
} from "../services/homeApi";
import HeartCount from "./Heart";
import Ads from "./Ads";
import VideoFooter from "./VideoFooter";
import { decryptImage } from "@/utils/imageDecrypt";

import loader from "../vod_loader.gif";
import LoadingBar from "./detail/LoadingBar";
import DetailContainer from "./detail/DetailContainer";
import story from "@/assets/story.json";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";

import { EffectCube } from "swiper/modules";
// @ts-expect-error: Swiper CSS has no type declarations but is required for styling
import "swiper/css";
// import "swiper/css/effect-cube";
import { useDispatch, useSelector } from "react-redux";
import { setWatchedPost } from "../services/watchSlice";
import { setCurrentVideoIndex } from "../services/indexSlice";
import { useVideoIndices } from "./useVideoIndices";
import StoryAnimation from "./StoryAnimation";

interface User {
  id: string;
  name: string;
  badge?: string;
  posts: Video[];
}

interface Video {
  post_id: string;
  file_type: string;
  preview_image: string;
  files: { resourceURL: string }[];
  ads_info?: any;
  type?: string;
  tag?: string[];
  title?: string;
  user?: any;
  city?: string;
}

const DetailStory = ({ id }: { id: string }) => {
  const { data: myday } = useGetMydayQuery({ page: 1 });
  const [watchPost] = useWatchtPostMutation();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isInteractingWithProgressBar, setisInteractingWithProgressBar] =
    useState(false);
  const swiperRef = useRef<any>(null);
  const user = useSelector((state: any) => state?.persist?.user);

  // Get all users with posts
  const usersWithPosts: User[] =
    ((myday?.data as User[])?.filter(
      (user: User) => Array.isArray(user?.posts) && user?.posts.length > 0
    ) as User[]) || [];

  // Find initial user index
  const initialUserIndex = usersWithPosts.findIndex(
    (user: User) => user?.id === id
  );

  // For each user, manage their decrypted videos and video index
  const [decryptedVideosMap, setDecryptedVideosMap] = useState<
    Record<string, Video[]>
  >({});
  const [isDecryptingMap, setIsDecryptingMap] = useState<
    Record<string, boolean>
  >({});
  // Get from Redux instead of local state

  const { currentVideoIndexMap, setCurrentIndex } = useVideoIndices();
  // const [currentVideoIndexMap, setCurrentVideoIndexMap] = useState<
  //   Record<string, number>
  // >({});
  // const [watchedPostsMap, setWatchedPostsMap] = useState<
  //   Record<string, Record<string, boolean>>
  // >({});
  const watchedPostsMap = useSelector(
    (state: any) => state.watchSlice.watchedPostsMap
  );
  const dispatch = useDispatch();

  const [heartsMap, setHeartsMap] = useState<Record<string, number[]>>({});
  const [widthMap, setWidthMap] = useState<Record<string, number>>({});
  const [heightMap, setHeightMap] = useState<Record<string, number>>({});
  const [countNumberMap, setCountNumberMap] = useState<Record<string, number>>(
    {}
  );
  const [countdownMap, setCountdownMap] = useState<Record<string, number>>({});

  const { data: config } = useGetConfigQuery({});

  // Image decryption cache
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

  // Decrypt videos for a user if not already done
  useEffect(() => {
    usersWithPosts.forEach((user) => {
      if (!decryptedVideosMap[user.id] && !isDecryptingMap[user.id]) {
        setIsDecryptingMap((prev) => ({ ...prev, [user.id]: true }));
        Promise.all(
          user.posts.map(async (video: Video) => ({
            ...video,
            decryptedPreview: await decryptThumbnail(video.preview_image),
          }))
        ).then((decrypted) => {
          setDecryptedVideosMap((prev) => ({ ...prev, [user.id]: decrypted }));
          setIsDecryptingMap((prev) => ({ ...prev, [user.id]: false }));

          // // Find the first unwatched video or default to 0
          const firstUnwatchedIndex = decrypted.findIndex(
            (video: any) => !video.is_watched
          );
          const newIndex = firstUnwatchedIndex >= 0 ? firstUnwatchedIndex : 0;

          if (currentVideoIndexMap[user.id]) {
            if (newIndex > currentVideoIndexMap[user.id]) {
              dispatch(
                setCurrentVideoIndex({ userId: user.id, index: newIndex })
              );
            } else {
              dispatch(
                setCurrentVideoIndex({
                  userId: user.id,
                  index: currentVideoIndexMap[user.id],
                })
              );
            }
          } else {
            dispatch(
              setCurrentVideoIndex({ userId: user.id, index: newIndex })
            );
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersWithPosts]);

  // Mark post as watched for a user
  useEffect(() => {
    usersWithPosts.forEach((user) => {
      const decryptedVideos = decryptedVideosMap[user.id] || [];
      const currentVideoIndex = currentVideoIndexMap[user.id] || 0;
      const watchedPosts = watchedPostsMap[user.id] || {};

      if (
        decryptedVideos[currentVideoIndex] &&
        !watchedPosts[decryptedVideos[currentVideoIndex].post_id]
      ) {
        const video = decryptedVideos[currentVideoIndex];
        watchPost({ post_id: video.post_id })
          .unwrap()
          .then(() => {
            dispatch(
              setWatchedPost({
                userId: user.id,
                postId: video.post_id,
                watched: true,
              })
            );
          })
          .catch(console.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedVideosMap, currentVideoIndexMap]);

  // Remove heart for a user
  const removeHeart = (userId: string, id: number) => {
    setHeartsMap((prev) => ({
      ...prev,
      [userId]: (prev[userId] || []).filter((heartId) => heartId !== id),
    }));
  };

  // Helper to update per-user state
  const setUserState = <T,>(
    setter: React.Dispatch<React.SetStateAction<Record<string, T>>>,
    userId: string,
    value: T
  ) => {
    setter((prev) => ({ ...prev, [userId]: value }));
  };

  // Refs for each user
  const indexRefs = useRef<Record<string, React.MutableRefObject<number>>>({});
  const abortControllerRefs = useRef<
    Record<string, React.MutableRefObject<AbortController[]>>
  >({});

  // Ensure refs exist for each user
  usersWithPosts.forEach((user) => {
    if (!indexRefs.current[user.id]) {
      indexRefs.current[user.id] = { current: 0 };
    }
    if (!abortControllerRefs.current[user.id]) {
      abortControllerRefs.current[user.id] = { current: [] };
    }
  });

  // Swiper slide change handler
  const handleSlideChange = () => {
    // No-op
  };

  useEffect(() => {
    if (swiperRef.current) {
      if (isInteractingWithProgressBar) {
        swiperRef.current.disable();
      } else {
        swiperRef.current.enable();
      }
    }
  }, [isInteractingWithProgressBar]); // This will run when the ref's current value changes

  // Modify your decrypted videos update function
  const updateDecryptedVideo = (
    userId: string,
    postId: string,
    updates: Partial<Video>
  ) => {
    console.log(
      "Updating video for user:",
      userId,
      "postId:",
      postId,
      "updates:",
      updates
    );
    setDecryptedVideosMap((prev) => {
      const userVideos = prev[userId] || [];
      return {
        ...prev,
        [userId]: userVideos.map((video) =>
          video.post_id === postId ? { ...video, ...updates } : video
        ),
      };
    });
  };
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
    <div className="myday_container" ref={videoContainerRef}>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        initialSlide={initialUserIndex >= 0 ? initialUserIndex : 0}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        touchStartPreventDefault={false}
        preventInteractionOnTransition={true}
        style={{ height: "100%" }}
        effect={"creative"} // Change effect to creative
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-20%", 0, -500], // Slide left + depth
            rotate: [0, 15, -15], // 3D rotation
          },
          next: {
            shadow: true,
            translate: ["20%", 0, -500], // Slide right + depth
            rotate: [0, 15, 15], // 3D rotation
          },
          limitProgress: 3, // Allows slides to move further
          perspective: true,
        }}
        allowTouchMove={!isInteractingWithProgressBar} // Disable touch when interacting
      >
        {usersWithPosts?.map((user: User) => {
          const decryptedVideos = decryptedVideosMap[user.id] || [];
          const isDecrypting = isDecryptingMap[user.id] || false;
          const currentVideoIndex = currentVideoIndexMap[user.id] || 0;
          const video = decryptedVideos[currentVideoIndex] || null;
          const hearts = heartsMap[user.id] || [];
          const width = widthMap[user.id] || 0;
          const height = heightMap[user.id] || 0;
          const countNumber = countNumberMap[user.id] || 0;
          const countdown = countdownMap[user.id] || 3;
          const indexRef = indexRefs.current[user.id];
          const abortControllerRef = abortControllerRefs.current[user.id];

          return (
            <SwiperSlide key={user.id}>
              {isDecrypting ? (
                <div className="flex justify-center items-center h-[100dvh] ">
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div className="z-[9999999]">
                      <LoadingBar />
                    </div>
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
                video && (
                  <>
                    {showGuide && (
                      <div className="absolute px-3 top-0 h-screen left-0 w-full flex flex-col justify-center  z-[9999999] bg-[rgba(0,0,0,0.7)]">
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
                          <button onClick={handleKnow} className="guide_btn">
                            我知道了
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      className={`video  overflow-hidden`}
                      data-post-id={video?.post_id}
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
                        <DetailContainer
                          swiperRef={swiperRef}
                          setisInteractingWithProgressBar={
                            setisInteractingWithProgressBar
                          }
                          setIsDecrypting={(val: boolean) =>
                            setUserState(setIsDecryptingMap, user.id, val)
                          }
                          length={decryptedVideos.length}
                          currentIndex={currentVideoIndex}
                          setCurrentIndex={(idx: any) =>
                            setCurrentIndex(user.id, idx)
                          }
                          videoData={{ current: decryptedVideos }}
                          indexRef={indexRef}
                          abortControllerRef={abortControllerRef}
                          container={videoContainerRef.current}
                          status={true}
                          countNumber={countNumber}
                          updateDecryptedVideo={(updates: any) =>
                            updateDecryptedVideo(
                              user.id,
                              video.post_id,
                              updates
                            )
                          }
                          video={video}
                          setCountNumber={(val: number) =>
                            setUserState(setCountNumberMap, user.id, val)
                          }
                          config={config}
                          countdown={countdown}
                          setWidth={(val: number) =>
                            setUserState(setWidthMap, user.id, val)
                          }
                          setHeight={(val: number) =>
                            setUserState(setHeightMap, user.id, val)
                          }
                          setHearts={(val: any[]) =>
                            setUserState(setHeartsMap, user.id, val)
                          }
                          setCountdown={(val: number) =>
                            setUserState(setCountdownMap, user.id, val)
                          }
                          width={width}
                          height={height}
                        />
                      )}

                      {video?.type !== "ads" &&
                        video?.type !== "ads_virtual" && (
                          <VideoFooter
                            badge={user?.badge || ""}
                            id={user?.id || ""}
                            tags={video?.tag || []}
                            title={video?.title || ""}
                            username={user?.name || ""}
                            city={video?.city || ""}
                          />
                        )}

                      {(video?.type === "ads" ||
                        video?.type === "ads_virtual") && (
                        <Ads ads={video?.ads_info} type={video?.type} />
                      )}

                      {Array.isArray(hearts) &&
                        hearts?.map((heartId: any) => (
                          <HeartCount
                            id={heartId}
                            key={heartId}
                            remove={(id: any) => removeHeart(user.id, id)}
                          />
                        ))}
                    </div>
                  </>
                )
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default DetailStory;
