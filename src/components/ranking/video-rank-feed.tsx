import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGetConfigQuery, usePostCommentMutation } from "../../page/home/services/homeApi";
import Top20Movies from "../../page/home/components/Top20Movies";
import { useDispatch, useSelector } from "react-redux";
import FeedFooter from "../../page/home/components/FeedFooter";
import { useNavigate } from "react-router-dom";
import HeartCount from "../../page/home/components/Heart";
import { showToast } from "../../page/home/services/errorSlice";
import Ads from "../../page/home/components/Ads";
import loader from "../../page/home/vod_loader.gif";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import sc from "../../assets/explore/sc.svg";
import VideoContainerFeed from "../../page/home/components/VideoContainerFeed";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { decryptImage } from "@/utils/imageDecrypt";
import PreventSwipeBack from "@/components/shared/PreventSwipeBack";
import { AnimatePresence, motion } from "framer-motion";

const VideoRankFeed = ({
  videos,
  currentActiveId,
  setShowVideoFeed,
  query,
  setVideos,
  setPage,
  search = false,
}: {
  videos: any;
  currentActiveId: any;
  setShowVideoFeed: any;
  query: any;
  setPage: any;
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
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);

  const [postComment] = usePostCommentMutation();

  const navigate = useNavigate();
  const [hearts, setHearts] = useState<number[]>([]); // Manage heart IDs
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [videosToRender, setVideosToRender] = useState<any[]>([]); // Store videos to render
  const abortControllerRef = useRef<AbortController[]>([]); // Array to store AbortControllers

  // Cleanup function for abort controllers
  const cleanupAbortControllers = useCallback(() => {
    abortControllerRef.current.forEach((controller) => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    abortControllerRef.current = [];
  }, []);
  const videoData = useRef<any[]>([]); // Array to store AbortControllers
  const indexRef = useRef(0); // Track the current active video index
  const isScrollingRef = useRef(false); // Synchronous scroll state tracking
  const scrollLockTimer = useRef<NodeJS.Timeout>(); // Timer for scroll locking
  const [isScrollLocked, setIsScrollLocked] = useState(false); // Prevent updates during rapid scroll
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 4 });
  const [isPaginating, setIsPaginating] = useState(false);
  const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);
  const prevVideosLengthRef = useRef(0);

  // Configuration constants
  const BUFFER_SIZE = 6; // Larger buffer for ultra-smooth scrolling (renders ~13 videos)
  const [itemHeight, setItemHeight] = useState(window.innerHeight);
  const ITEM_HEIGHT = itemHeight;

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((heartId) => heartId !== id)); // Remove the heart by ID
  };

  // Add at the top of your Home component
  const decryptionCache = useRef(new Map<string, string>());
  const MAX_CACHE_SIZE = 100; // Limit cache to prevent memory bloat

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

      // Manage cache size to prevent memory bloat
      if (decryptionCache.current.size >= MAX_CACHE_SIZE) {
        const firstKey = decryptionCache.current.keys().next().value;
        if (firstKey) {
          decryptionCache.current.delete(firstKey);
        }
      }

      decryptionCache.current.set(thumbnail, decryptedUrl);
      return decryptedUrl;
    } catch (error) {
      console.error("Error decrypting thumbnail:", error);
      return "";
    }
  };

  useEffect(() => {
    if (videos.length > 0) {
      let initialVideos = [...videos];

      try {
        const run = async () => {
          // Only decrypt previews for first 20 videos to prevent memory issues
          const videosWithDecryptedPreviews = await Promise.all(
            initialVideos.slice(0, 20).map(async (video: any) => ({
              ...video,
              decryptedPreview: await decryptThumbnail(video.preview_image),
            }))
          );

          // Add remaining videos without decryption for now
          const remainingVideos = initialVideos.slice(20).map((video: any) => ({
            ...video,
            decryptedPreview: null,
          }));

          const allVideos = [
            ...videosWithDecryptedPreviews,
            ...remainingVideos,
          ];

          const isInitialLoad = videosToRender.length === 0;
          setVideosToRender(allVideos);

          if (isInitialLoad) {
            handleInitialVideoPositioning(allVideos);
          }

          setIsDecrypting(false);
        };

        const handleInitialVideoPositioning = (videos: any[]) => {
          const activeIndex = videos.findIndex(
            (video) => video.post_id === currentActiveId
          );

          if (activeIndex !== -1) {
            setCurrentVideoIndex(activeIndex);
            setCurrentActivePost(currentActiveId);
            // Set initial visible range around the active video
            const startIndex = Math.max(0, activeIndex - BUFFER_SIZE);
            const endIndex = Math.min(
              videos.length - 1,
              activeIndex + BUFFER_SIZE
            );
            setVisibleRange({ start: startIndex, end: endIndex });
          } else {
            // Fallback to first video if selected video not found
            setCurrentVideoIndex(0);
            setCurrentActivePost(videos[0]?.post_id);
            setVisibleRange({
              start: 0,
              end: Math.min(BUFFER_SIZE, videos.length - 1),
            });
          }
        };

        run();
      } catch (error) {}
    }
  }, [videos, currentActiveId]);

  useEffect(() => {
    const handlePopState = () => {
      cleanupAbortControllers();
      setShowVideoFeed(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      cleanupAbortControllers();
    };
  }, [cleanupAbortControllers]);

  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!currentActiveId) return;

    // Cleanup previous observer
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
    }

    const observer = new MutationObserver((_, obs) => {
      const container = videoContainerRef.current;
      if (container) {
        const activeElement = container.querySelector(
          `[data-post-id="${currentActiveId}"]`
        );

        if (activeElement) {
          activeElement.scrollIntoView({ block: "center" });
          obs.disconnect(); // Stop observing once we've found and scrolled to the element
          mutationObserverRef.current = null;
        }
      }
    });

    mutationObserverRef.current = observer;

    // Start observing the document with the configured parameters
    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
    };
  }, [currentActiveId]);

  // Enhanced virtual scrolling with scroll lock protection
  const updateVisibleRange = useCallback(
    (scrollTop: number) => {
      const newCurrentIndex = Math.max(0, Math.round(scrollTop / ITEM_HEIGHT));

      // During scroll lock, minimize updates but still track for critical changes
      if (isScrollLocked) {
        if (Math.abs(newCurrentIndex - currentVideoIndex) >= 2) {
          setCurrentVideoIndex(newCurrentIndex);
          if (videosToRender[newCurrentIndex]) {
            setCurrentActivePost(videosToRender[newCurrentIndex].post_id);
          }
        }
        return;
      }

      // Calculate virtual range around current position
      const startIndex = Math.max(0, newCurrentIndex - BUFFER_SIZE);
      const endIndex = Math.min(
        videosToRender.length - 1,
        newCurrentIndex + BUFFER_SIZE
      );

      // Responsive updates - less restrictive for smoother experience
      const rangeChanged =
        startIndex !== visibleRange.start || endIndex !== visibleRange.end;
      const indexChanged =
        newCurrentIndex !== currentVideoIndex &&
        newCurrentIndex <= videosToRender.length - 1;

      // Always update for smooth experience
      if (rangeChanged) {
        setVisibleRange({ start: startIndex, end: endIndex });
      }

      if (indexChanged) {
        setCurrentVideoIndex(newCurrentIndex);
        setCurrentActivePost(videosToRender[newCurrentIndex]?.post_id);
      }
    },
    [
      visibleRange,
      videosToRender,
      currentVideoIndex,
      ITEM_HEIGHT,
      isPaginating,
      isScrollLocked,
    ]
  );

  // Primary scroll-based virtual scrolling with improved settling
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    let ticking = false;
    let scrollTimer: NodeJS.Timeout;
    let settlingTimer: NodeJS.Timeout;
    let lastScrollTop = 0;
    let scrollVelocity = 0;
    let lastScrollTime = Date.now();
    let isSettling = false;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastScrollTime;
      const deltaScroll = Math.abs(currentScrollTop - lastScrollTop);

      // Calculate scroll velocity to detect fast scrolling
      scrollVelocity = deltaTime > 0 ? deltaScroll / deltaTime : 0;

      // Track scrolling activity
      if (deltaScroll > 5 || scrollVelocity > 1) {
        isScrollingRef.current = true;
        setIsActivelyScrolling(true);
      }

      // Enable scroll lock only for extremely rapid scrolling to prevent flashing
      if (deltaScroll > 100 || scrollVelocity > 10) {
        setIsScrollLocked(true);
        clearTimeout(scrollLockTimer.current);
      }

      // Clear settling timer since we're scrolling again
      clearTimeout(settlingTimer);
      isSettling = false;

      // Faster, more responsive debounce timing
      const debounceDelay = scrollVelocity > 3 ? 100 : 30;

      // Always track position with throttling
      if (!ticking) {
        requestAnimationFrame(() => {
          updateVisibleRange(currentScrollTop);
          ticking = false;
        });
        ticking = true;
      }

      // Debounce for iOS Safari momentum scrolling with adaptive delay
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!isSettling) {
          // Start stabilization process
          isScrollingRef.current = false;
          setIsActivelyScrolling(false);

          // Fast scroll lock release for better responsiveness
          scrollLockTimer.current = setTimeout(() => {
            setIsScrollLocked(false);

            // Quick position validation
            const finalScrollTop = container.scrollTop;
            const validatedIndex = Math.max(
              0,
              Math.round(finalScrollTop / ITEM_HEIGHT)
            );

            if (
              validatedIndex !== currentVideoIndex &&
              videosToRender[validatedIndex]
            ) {
              setCurrentVideoIndex(validatedIndex);
              setCurrentActivePost(videosToRender[validatedIndex].post_id);
            }

            updateVisibleRange(finalScrollTop);
          }, 50); // Much faster release

          isSettling = true;
          settlingTimer = setTimeout(() => {
            isSettling = false;
          }, 100); // Much faster settling for responsiveness
        }
      }, debounceDelay);

      lastScrollTop = currentScrollTop;
      lastScrollTime = currentTime;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
      clearTimeout(settlingTimer);
      clearTimeout(scrollLockTimer.current);
    };
  }, [updateVisibleRange, ITEM_HEIGHT]);

  // Predictive pagination - start loading much earlier for seamless experience
  useEffect(() => {
    const videosRemaining = videosToRender.length - 1 - currentVideoIndex;
    const shouldTrigger = videosRemaining < 8 && videosRemaining >= 0; // Much earlier trigger

    if (shouldTrigger && !isPaginating && videosToRender.length > 8) {
      setIsPaginating(true);
      setPage((prev: any) => prev + 1);
    }
  }, [currentVideoIndex, videosToRender.length, isPaginating, setPage]);

  // Reset pagination loading state when new videos are loaded
  useEffect(() => {
    // Detect when new videos have been added (pagination completed)
    if (videosToRender.length > prevVideosLengthRef.current && isPaginating) {
      setIsPaginating(false);
    }

    // Also reset if videos decreased (might indicate a reset)
    if (videosToRender.length < prevVideosLengthRef.current && isPaginating) {
      setIsPaginating(false);
    }

    prevVideosLengthRef.current = videosToRender.length;
  }, [videosToRender.length, isPaginating]);

  // Smart pagination timeout - shorter for last video, longer otherwise
  useEffect(() => {
    if (isPaginating) {
      const timeoutDuration =
        currentVideoIndex === videosToRender.length - 1 ? 3000 : 5000;
      const timer = setTimeout(() => {
        setIsPaginating(false);
      }, timeoutDuration);

      return () => clearTimeout(timer);
    }
  }, [isPaginating, currentVideoIndex, videosToRender.length]);

  // Backup scroll-based pagination trigger
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const handleScrollPagination = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Trigger pagination when 75% scrolled (earlier backup method)
      if (
        scrollPercentage > 0.75 &&
        !isPaginating &&
        videosToRender.length > 8
      ) {
        setIsPaginating(true);
        setPage((prev: any) => prev + 1);
      }
    };

    let scrollTimer: NodeJS.Timeout;
    const throttledHandler = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScrollPagination, 100);
    };

    container.addEventListener("scroll", throttledHandler);
    return () => {
      container.removeEventListener("scroll", throttledHandler);
      clearTimeout(scrollTimer);
    };
  }, [isPaginating, setPage, videosToRender.length]);

  // Intersection Observer as fallback for edge cases - with debouncing and memory optimization
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef(new Set<Element>());

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || videosToRender.length === 0) return;

    let observerTimer: NodeJS.Timeout;

    // Cleanup previous observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      observedElementsRef.current.clear();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip updates during any scroll activity
        if (isScrollingRef.current || isActivelyScrolling || isScrollLocked) {
          return;
        }

        // Debounce intersection updates
        clearTimeout(observerTimer);
        observerTimer = setTimeout(() => {
          if (
            !isScrollingRef.current &&
            !isActivelyScrolling &&
            !isScrollLocked
          ) {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const postId = entry.target.getAttribute("data-post-id");
                if (postId) {
                  const videoIndex = videosToRender.findIndex(
                    (video) => video.post_id === postId
                  );
                  if (videoIndex !== -1 && videoIndex !== currentVideoIndex) {
                    setCurrentVideoIndex(videoIndex);
                    setCurrentActivePost(postId);
                  }
                }
              }
            });
          }
        }, 100); // Faster intersection observer response
      },
      {
        threshold: 0.6,
        rootMargin: "0px",
      }
    );

    intersectionObserverRef.current = observer;

    // Only observe visible range elements to reduce memory usage
    const visibleElements = Array.from(container.children).slice(
      Math.max(0, visibleRange.start),
      Math.min(container.children.length, visibleRange.end + 1)
    );

    visibleElements.forEach((child) => {
      if (child.getAttribute("data-post-id")) {
        observer.observe(child);
        observedElementsRef.current.add(child);
      }
    });

    return () => {
      clearTimeout(observerTimer);
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      observedElementsRef.current.clear();
    };
  }, [
    visibleRange,
    videosToRender.length, // Only depend on length, not full array
    currentVideoIndex,
    isActivelyScrolling,
    isScrollLocked,
  ]);

  useEffect(() => {
    if (currentActivePost) {
      // Reset state when the active post changes
      setCountdown(3);
      setCountNumber(0);
    }
  }, [currentActivePost]);

  // Recalculate height when first video is activated or on mount
  useEffect(() => {
    const recalculateHeight = () => {
      // Get actual viewport height and available space
      const viewportHeight = window.innerHeight;
      const visualViewportHeight =
        window.visualViewport?.height || viewportHeight;

      // Use the smaller value to account for mobile browser UI
      const actualHeight = Math.min(viewportHeight, visualViewportHeight);

      // Account for fixed elements (search bar + comment section)
      const adjustedHeight = actualHeight;

      setItemHeight(adjustedHeight);
    };

    // Recalculate on mount
    recalculateHeight();

    // Recalculate when first video becomes active (aggressive recalculation)
    if (currentVideoIndex === 0 && currentActivePost) {
      // Multiple recalculations to catch timing issues
      setTimeout(recalculateHeight, 50);
      setTimeout(recalculateHeight, 200);
      setTimeout(recalculateHeight, 500);
    }

    // Recalculate on window resize and visual viewport changes
    window.addEventListener("resize", recalculateHeight);
    window.visualViewport?.addEventListener("resize", recalculateHeight);

    return () => {
      window.removeEventListener("resize", recalculateHeight);
      window.visualViewport?.removeEventListener("resize", recalculateHeight);
    };
  }, [currentVideoIndex, currentActivePost]);

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

        const response: any = await postComment({
          post_id: post_id, // Assuming all comments belong to the same post
          content: content,
          device: deviceInfo.deviceName,
          app_version: deviceInfo.appVersion,
        }).unwrap();
        setContent("");
        dispatch(
          showToast({
            message: response?.message || "Comment posted successfully",
            type: "success",
          })
        );
      } catch (error: any) {
        dispatch(
          showToast({
            message: error?.data?.message || "Failed to post comment",
            type: "error",
          })
        );
        console.error("Failed to post reply:", error);
      }
    } else {
      setIsOpen(true);
    }
  };

  // Derived state - no need for separate state and effect
  const isLastVideoVisible = currentVideoIndex === videosToRender.length - 1;

  const handleSearch = () => {
    navigate("/search_overlay");
  };

  // Add lazy decryption for videos coming into view
  useEffect(() => {
    const decryptVisibleVideos = async () => {
      const startIdx = Math.max(0, visibleRange.start - 2);
      const endIdx = Math.min(videosToRender.length, visibleRange.end + 3);

      for (let i = startIdx; i <= endIdx; i++) {
        const video = videosToRender[i];
        if (video && !video.decryptedPreview && video.preview_image) {
          try {
            const decryptedUrl = await decryptThumbnail(video.preview_image);
            setVideosToRender((prev) => {
              const updated = [...prev];
              if (updated[i]) {
                updated[i] = { ...updated[i], decryptedPreview: decryptedUrl };
              }
              return updated;
            });
          } catch (error) {
            console.error("Error decrypting preview:", error);
          }
        }
      }
    };

    const timeoutId = setTimeout(decryptVisibleVideos, 200);
    return () => clearTimeout(timeoutId);
  }, [visibleRange, videosToRender.length]); // Only depend on length to prevent excessive re-runs

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
          <>
            {/* Fixed Topbar - moved outside scrolling container */}
            <AnimatePresence>
              {!hideBar && !hideNew && (
                <motion.div
                  className="fixed top-3 left-0 flex gap-2 items-center w-full z-[9999]"
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: "0", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
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
                      <img src={sc} alt="" />
                    </div>
                    <input
                      className="feed-input w-full pl-[45px] py-[8px]"
                      placeholder={query}
                      onClick={handleSearch}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              ref={videoContainerRef}
              className={`app__videos ${isOpen ? "opacity-50" : ""}`}
              style={
                {
                  pointerEvents: isOpen ? "none" : "auto",
                  // iOS Safari scroll optimizations with momentum
                  WebkitOverflowScrolling: "touch", // Enable smooth momentum scrolling
                  transform: "translateZ(0)", // Force hardware acceleration
                  willChange: "scroll-position",
                  overscrollBehavior: "contain", // Prevent overscroll bounce
                } as React.CSSProperties
              }
            >
              {/* Virtual scrolling container with total height */}
              <div
                style={{
                  height: videosToRender.length * ITEM_HEIGHT,
                  position: "relative",
                  // iOS Safari optimizations for fast scroll
                  contain: "layout style paint",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  // Additional iOS fast scroll optimizations
                  isolation: "isolate",
                  transformStyle: "preserve-3d",
                }}
              >
                {videosToRender
                  .slice(visibleRange.start, visibleRange.end + 1)
                  .map((video: any, sliceIndex: number) => {
                    const actualIndex = visibleRange.start + sliceIndex;
                    const isCurrentVideo = actualIndex === currentVideoIndex;

                    // Find the true index of this video to ensure correct positioning
                    const trueIndex = videosToRender.findIndex(
                      (v) => v.post_id === video.post_id
                    );

                    return (
                      <div
                        key={`${video.post_id}-${trueIndex}`}
                        className="video1 pb-[70px]"
                        data-post-id={video.post_id}
                        style={{
                          position: "absolute",
                          top: trueIndex * ITEM_HEIGHT, // Use true index for consistent positioning
                          height: ITEM_HEIGHT,
                          width: "100%",
                          boxSizing: "border-box",
                          // iOS Safari performance optimizations for fast scroll
                          transform: "translateZ(0)",
                          backfaceVisibility: "hidden",
                          willChange: isCurrentVideo ? "transform" : "auto",
                          // Additional fast scroll optimizations
                          containIntrinsicSize: `100vw ${ITEM_HEIGHT}px`,
                          contentVisibility: isCurrentVideo
                            ? "visible"
                            : "auto",
                        }}
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
                            setVideosData={setVideos}
                            setrenderVideos={setVideosToRender}
                            videoData={videoData}
                            indexRef={indexRef}
                            abortControllerRef={abortControllerRef}
                            container={videoContainerRef.current}
                            width={width}
                            height={height}
                            status={isCurrentVideo}
                            countNumber={isCurrentVideo ? countNumber : 0}
                            video={video}
                            setCountNumber={setCountNumber}
                            config={config}
                            countdown={isCurrentVideo ? countdown : 3}
                            setWidth={setWidth}
                            setHeight={setHeight}
                            setHearts={setHearts}
                            setCountdown={setCountdown}
                          />
                        )}

                        {video?.type !== "ads" &&
                          video?.type !== "ads_virtual" && (
                            <FeedFooter
                              badge={video?.user?.badge}
                              id={video?.user?.id}
                              tags={video?.tag}
                              title={video?.title}
                              username={video?.user?.name}
                              city={video?.city}
                            />
                          )}

                        {(video?.type === "ads" ||
                          video?.type === "ads_virtual") && (
                          <Ads ads={video?.ads_info} type={video?.type} />
                        )}

                        {/* Heart animations for current video only */}
                        {isCurrentVideo &&
                          hearts.map((id: any) => (
                            <HeartCount id={id} key={id} remove={removeHeart} />
                          ))}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Fixed Bottom Comment Bar - moved outside scrolling container */}
            <AnimatePresence>
              {!hideBar && !hideNew && (
                <motion.div
                  className="add_comment w-full py-3 z-[9999999] fixed bottom-0 left-0"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
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
                      onClick={() =>
                        handleComment(
                          videosToRender[currentVideoIndex]?.post_id
                        )
                      }
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLastVideoVisible && (
              <div className="flex justify-center items-center p-3 w-full fixed bottom-20 left-0 z-[9998]">
                <img src={loader} className="w-[80px] h-[80px]" alt="Loading" />
              </div>
            )}
          </>
        )}

        {!videos?.length && <></>}
      </div>
    </>
  );
};

export default React.memo(VideoRankFeed);
