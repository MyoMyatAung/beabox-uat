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

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-expect-error: Swiper CSS has no type declarations but is required for styling
import 'swiper/css';

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

  // Get all users with posts
  const usersWithPosts: User[] =
    ((myday?.data as User[])?.filter((user: User) => Array.isArray(user?.posts) && user?.posts.length > 0) as User[]) || [];

  // Find initial user index
  const initialUserIndex = usersWithPosts.findIndex((user: User) => user?.id === id);

  // For each user, manage their decrypted videos and video index
  const [decryptedVideosMap, setDecryptedVideosMap] = useState<Record<string, Video[]>>({});
  const [isDecryptingMap, setIsDecryptingMap] = useState<Record<string, boolean>>({});
  const [currentVideoIndexMap, setCurrentVideoIndexMap] = useState<Record<string, number>>({});
  const [watchedPostsMap, setWatchedPostsMap] = useState<Record<string, Record<string, boolean>>>({});
  const [heartsMap, setHeartsMap] = useState<Record<string, number[]>>({});
  const [widthMap, setWidthMap] = useState<Record<string, number>>({});
  const [heightMap, setHeightMap] = useState<Record<string, number>>({});
  const [countNumberMap, setCountNumberMap] = useState<Record<string, number>>({});
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
          setCurrentVideoIndexMap((prev) => ({ ...prev, [user.id]: 0 }));
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
            setWatchedPostsMap((prev) => ({
              ...prev,
              [user.id]: { ...prev[user.id], [video.post_id]: true },
            }));
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
  const setUserState = <T,>(setter: React.Dispatch<React.SetStateAction<Record<string, T>>>, userId: string, value: T) => {
    setter((prev) => ({ ...prev, [userId]: value }));
  };

  // Refs for each user
  const indexRefs = useRef<Record<string, React.MutableRefObject<number>>>({});
  const abortControllerRefs = useRef<Record<string, React.MutableRefObject<AbortController[]>>>({});

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

  return (
    <div className="myday_container" ref={videoContainerRef}>
      <Swiper
        initialSlide={initialUserIndex >= 0 ? initialUserIndex : 0}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        style={{ height: '100%' }}
        effect={'creative'} // Change effect to creative
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -500], // Slide left + depth
            rotate: [0, 15, -15] // 3D rotation
          },
          next: {
            shadow: true,
            translate: ['20%', 0, -500], // Slide right + depth
            rotate: [0, 15, 15] // 3D rotation
          },
          limitProgress: 3, // Allows slides to move further
          perspective: true,
        }}
      >
        {usersWithPosts.map((user: User) => {
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
                <div className="">
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div>
                      <LoadingBar />
                    </div>
                    <div className="heart">
                      <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
                    </div>
                  </div>
                </div>
              ) : (
                video && (
                  <div
                    className={`video justify-center items-center overflow-hidden`}
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
                        isInteractingWithProgressBar={undefined}
                        setIsDecrypting={(val: boolean) => setUserState(setIsDecryptingMap, user.id, val)}
                        length={decryptedVideos.length}
                        currentIndex={currentVideoIndex}
                        setCurrentIndex={(idx: number) => setUserState(setCurrentVideoIndexMap, user.id, idx)}
                        videoData={{ current: decryptedVideos }}
                        indexRef={indexRef}
                        abortControllerRef={abortControllerRef}
                        container={videoContainerRef.current}
                        status={true}
                        countNumber={countNumber}
                        video={video}
                        setCountNumber={(val: number) => setUserState(setCountNumberMap, user.id, val)}
                        config={config}
                        countdown={countdown}
                        setWidth={(val: number) => setUserState(setWidthMap, user.id, val)}
                        setHeight={(val: number) => setUserState(setHeightMap, user.id, val)}
                        setHearts={(val: number[]) => setUserState(setHeartsMap, user.id, val)}
                        setCountdown={(val: number) => setUserState(setCountdownMap, user.id, val)}
                        width={width}
                        height={height}
                      />
                    )}

                    {video?.type !== "ads" && video?.type !== "ads_virtual" && (
                      <VideoFooter
                        badge={user?.badge || ''}
                        id={user?.id || ''}
                        tags={video?.tag || []}
                        title={video?.title || ''}
                        username={user?.name || ''}
                        city={video?.city || ''}
                      />
                    )}

                    {(video?.type === "ads" || video?.type === "ads_virtual") && (
                      <Ads ads={video?.ads_info} type={video?.type} />
                    )}

                    {hearts.map((heartId: number) => (
                      <HeartCount id={heartId} key={heartId} remove={(id: number) => removeHeart(user.id, id)} />
                    ))}
                  </div>
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
