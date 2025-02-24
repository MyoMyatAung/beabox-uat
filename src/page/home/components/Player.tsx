import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../indicator.svg";
import vod_loader from "../vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { useWatchtPostMutation } from "../services/homeApi";
import { showToast } from "../services/errorSlice";
import { decryptImage } from "@/utils/imageDecrypt";
import { c } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { setMute } from "../services/muteSlice";

// Constants for video preloading
const BUFFER_THRESHOLD = 10; // seconds before current position to start buffering
const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB maximum buffer size

interface RootState {
  muteSlice: {
    mute: boolean;
  };
  persist: {
    user: {
      token: string;
    };
  };
}

const Player = ({
  src,
  width,
  height,
  thumbnail,
  setWidth,
  setHeight,
  handleLike,
  sethideBar,
  rotate,
  type,
  post_id,
  isActive,
}: {
  src: string;
  thumbnail: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  handleLike: () => void;
  sethideBar: (hide: boolean) => void;
  post_id: string;
  rotate: boolean;
  type: string;
  width: number;
  height: number;
  isActive: boolean;
}) => {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { mute } = useSelector((state: RootState) => state.muteSlice);
  const user = useSelector((state: RootState) => state.persist.user);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlay, setIsplay] = useState(false);
  const playIconRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null); // Reference to the range input
  const isDraggingRef = useRef(false); // Track if the user is dragging the progress bar
  const seekTimeRef = useRef(0); // Store the seek time while dragging
  const timeDisplayRef = useRef<HTMLDivElement | null>(null); // Reference to the time display
  const muteRef = useRef(mute); // Store latest mute state
  const watchedTimeRef = useRef(0); // Track total watched time
  const apiCalledRef = useRef(false); // Ensure API is called only once
  const [watchtPost] = useWatchtPostMutation(); // Hook for watch history API
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const [p_img, setPImg] = useState(false);
  const preloadRef = useRef<boolean>(false);
  const bufferTimer = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();

  // Format time (e.g., 65 => "01:05")
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleWatchHistory = () => {
    if (!apiCalledRef.current && user?.token) {
      apiCalledRef.current = true;
      watchtPost({ post_id: post_id })
        .unwrap()
        .then(() => console.log("Watch history updated"))
        .catch((error) => console.error("Failed to update watch history", error));
    }
  };

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!thumbnail) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = thumbnail;

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
  }, [thumbnail]);

  // Initialize player function
  const initializePlayer = () => {
    if (!playerContainerRef.current || artPlayerInstanceRef.current) return;

    Artplayer.DBCLICK_FULLSCREEN = false;
    Artplayer.MOBILE_DBCLICK_PLAY = false;
    Artplayer.MOBILE_CLICK_PLAY = true;

    // Configure Artplayer options
    const options: Artplayer["Option"] = {
      autoOrientation: true,
      container: playerContainerRef.current,
      url: src,
      volume: 0.5,
      muted: muteRef.current,
      autoplay: false,
      fullscreenWeb: true,
      poster: decryptedPhoto,
      moreVideoAttr: {
        playsInline: true,
        preload: "metadata" as const,
      },
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      icons: {
        loading: `<div class="video-loading-indicator" style="display: none;"><img width="100" height="100" src=${vod_loader}></div>`,
        state: `<div class="video-play-indicator" style="display: none;"><img src="${indicator}" width="50" height="50" alt="Play"></div>`,
      },
      type: 'mp4',
      customType: {
        mp4: function(video: HTMLVideoElement, url: string) {
          // Configure video element
          video.preload = "metadata";
          
          const loadVideo = async () => {
            try {
              // Try to load just metadata first
              const headers = new Headers();
              headers.append('Range', 'bytes=0-10240'); // Just get first 1KB to check range support
              
              const response = await fetch(url, { 
                headers,
                method: 'GET',
              });
              
              if (response.status === 206) {
                // Server supports range requests, set video source
                video.src = url;
                
                // If this is active video, start loading more
                if (isActive) {
                  video.preload = "auto";
                }
              } else {
                // Server doesn't support range requests, fallback to normal loading
                video.src = url;
                video.preload = "metadata";
              }
            } catch (error) {
              console.error('Error loading video:', error);
              // Fallback to basic loading
              video.src = url;
              video.preload = "metadata";
            }
          };

          // Start loading process
          loadVideo().catch(console.error);
          
          // Add event listeners for dynamic loading
          video.addEventListener('canplaythrough', () => {
            // Once we can play through current buffer, load more if active
            if (isActive) {
              video.preload = "auto";
            }
          });

          video.addEventListener('waiting', () => {
            // If video is waiting for data and is active, ensure we're loading
            if (isActive) {
              video.preload = "auto";
            }
          });
          
          // Clean up function
          return () => {
            video.removeAttribute('src');
            video.load();
          };
        },
      },
      layers: [
        {
          html: `
            <div class="custom-progress-container">
              <input type="range" min="0" max="100" step="0.1" class="custom-progress-bar" />
                <div class="custom-time-display"></div>
            </div>
          `,
          style: {
            position: "absolute",
            bottom: "0px",
            left: "5%",
            width: "90%",
            height: "25px",
            zIndex: "9999",
          },
          mounted: (element: HTMLElement) => {
            progressBarRef.current = element.querySelector(
              ".custom-progress-bar"
            ) as HTMLInputElement;
            timeDisplayRef.current = element.querySelector(
              ".custom-time-display"
            ) as HTMLDivElement;

            if (!progressBarRef.current) {
              console.error("Custom progress bar or tooltip element not found");
              return;
            }

            // Initial setup for the progress bar
            progressBarRef.current.value = "0";
            progressBarRef.current.style.opacity = "0";

            // Desktop events
            progressBarRef.current.addEventListener("input", (e) => {
              if (!artPlayerInstanceRef.current) return;
              if (!isDraggingRef.current) {
                sethideBar(true);
                if (progressBarRef?.current?.style) {
                  progressBarRef.current.style.height = "10px";
                  progressBarRef.current.style.setProperty("--thumb-width", "16px");
                  progressBarRef.current.style.setProperty("--thumb-height", "20px");
                  progressBarRef.current.style.setProperty("--thumb-radius", "5px");
                }
                isDraggingRef.current = true;
                timeDisplayRef.current!.style.display = "block";
              }

              const value = parseFloat((e.target as HTMLInputElement).value);
              seekTimeRef.current = (value / 100) * artPlayerInstanceRef.current.duration;
              progressBarRef.current?.style.setProperty("--progress", `${value}%`);

              if (timeDisplayRef.current) {
                const currentTime = formatTime(seekTimeRef.current);
                const duration = formatTime(artPlayerInstanceRef.current.duration);
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            progressBarRef.current.addEventListener("change", () => {
              if (!artPlayerInstanceRef.current || !isDraggingRef.current) return;
              isDraggingRef.current = false;
              sethideBar(false);
              if (progressBarRef.current) {
                progressBarRef.current.style.height = "4px";
                progressBarRef.current.style.setProperty("--thumb-width", "12px");
                progressBarRef.current.style.setProperty("--thumb-height", "12px");
                progressBarRef.current.style.setProperty("--thumb-radius", "50%");
              }
              timeDisplayRef.current!.style.display = "none";
              artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
            });

            // Mobile touch events
            element.addEventListener("touchstart", (e) => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current) return;
              const touch = e.touches[0];
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(Math.max((touchX / rect.width) * 100, 0), 100);

              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty("--progress", `${percent}%`);
              isDraggingRef.current = true;
              sethideBar(true);
              progressBarRef.current.style.height = "10px";
              progressBarRef.current.style.setProperty("--thumb-width", "16px");
              progressBarRef.current.style.setProperty("--thumb-height", "20px");
              progressBarRef.current.style.setProperty("--thumb-radius", "5px");
              timeDisplayRef.current!.style.display = "block";

              const newTime = (percent / 100) * artPlayerInstanceRef.current.duration;
              seekTimeRef.current = newTime;
              if (timeDisplayRef.current) {
                const currentTime = formatTime(newTime);
                const duration = formatTime(artPlayerInstanceRef.current.duration);
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            element.addEventListener("touchmove", (e) => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current || !isDraggingRef.current) return;
              e.preventDefault();
              const touch = e.touches[0];
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(Math.max((touchX / rect.width) * 100, 0), 100);

              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty("--progress", `${percent}%`);
              seekTimeRef.current = (percent / 100) * artPlayerInstanceRef.current.duration;

              if (timeDisplayRef.current) {
                const currentTime = formatTime(seekTimeRef.current);
                const duration = formatTime(artPlayerInstanceRef.current.duration);
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            element.addEventListener("touchend", () => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current || !isDraggingRef.current) return;
              isDraggingRef.current = false;
              sethideBar(false);
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.setProperty("--thumb-width", "12px");
              progressBarRef.current.style.setProperty("--thumb-height", "12px");
              progressBarRef.current.style.setProperty("--thumb-radius", "50%");
              timeDisplayRef.current!.style.display = "none";
              artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
            });
          },
        },
        {
          html: `<div class="custom-play-icon">
                    <img src="${indicator}" width="50" height="50" alt="Play">
                 </div>`,
          style: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "999",
            display: "none",
          },
          mounted: (element: HTMLElement) => {
            playIconRef.current = element as HTMLDivElement;

            playIconRef?.current?.addEventListener("click", () => {
              if (artPlayerInstanceRef.current) {
                artPlayerInstanceRef.current.play().catch((error) => {
                  console.error('Manual play failed:', error);
                  if (playIconRef.current) {
                    playIconRef.current.style.display = "block";
                  }
                });
              }
            });
          },
        },
        {
          html: '<div class="click-layer"></div>',
          style: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "90%",
            height: "85%",
            zIndex: "10",
            background: "transparent",
          },
          mounted: (element: HTMLElement) => {
            let lastClick = 0;
            let singleClickTimeout: NodeJS.Timeout | null = null;

            element.addEventListener("click", () => {
              const now = Date.now();
              if (now - lastClick <= 300) {
                if (singleClickTimeout) clearTimeout(singleClickTimeout);
                if (user?.token) {
                  handleLike();
                } else {
                  dispatch(
                    showToast({
                      message: "登陆后可点赞",
                      type: "success",
                    })
                  );
                }
              } else {
                singleClickTimeout = setTimeout(() => {
                  artPlayerInstanceRef.current?.toggle();
                }, 300);
              }
              lastClick = now;
            });
          },
        },
      ],
    };

    // If player already exists, destroy it first
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.destroy();
      artPlayerInstanceRef.current = null;
    }

    // Create new player instance
    artPlayerInstanceRef.current = new Artplayer(options);

    // Update progress bar while playing
    artPlayerInstanceRef.current.on("video:timeupdate", () => {
      if (progressBarRef.current && artPlayerInstanceRef.current && !isDraggingRef.current) {
        const currentTime = artPlayerInstanceRef.current.currentTime || 0;
        const duration = artPlayerInstanceRef.current.duration || 1;
        const newProgress = (currentTime / duration) * 100;
        progressBarRef.current.value = newProgress.toString();
        progressBarRef.current.style.setProperty("--progress", `${newProgress}%`);
      }
    });

    // Add event listeners for video state
    artPlayerInstanceRef.current.on("ready", () => {
      if (width > height) {
        setPImg(true);
      } else {
        setPImg(false);
      }
      
      if (progressBarRef?.current) {
        progressBarRef.current.style.opacity = "1";
      }

      // Initially show play button when video is ready
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      if (playIndicator) playIndicator.style.display = "block";
    });

    // Enhanced error handling
    artPlayerInstanceRef.current.on("error", (error) => {
      console.error("Video loading error:", error);
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      if (playIndicator) playIndicator.style.display = "block";
    });

    // Show/hide play button based on state
    artPlayerInstanceRef.current.on("pause", () => {
      setIsPaused(true);
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      if (playIndicator) playIndicator.style.display = "block";
    });

    artPlayerInstanceRef.current.on("play", () => {
      setIsPaused(false);
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      if (playIndicator) playIndicator.style.display = "none";
    });

    // Add loading state handler
    artPlayerInstanceRef.current.on("video:waiting", () => {
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "block";
      if (playIndicator) playIndicator.style.display = "none";
    });

    artPlayerInstanceRef.current.on("video:playing", () => {
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      if (playIndicator) playIndicator.style.display = "none";
    });

    // Add initial loading state
    artPlayerInstanceRef.current.on("video:loadstart", () => {
      const loadingIndicator = artPlayerInstanceRef.current?.template?.$loading?.querySelector('.video-loading-indicator') as HTMLDivElement;
      const playIndicator = artPlayerInstanceRef.current?.template?.$state?.querySelector('.video-play-indicator') as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "block";
      if (playIndicator) playIndicator.style.display = "none";
    });
  };

  // Track watched time for 5 seconds
  let watchTimer: NodeJS.Timeout | null = null;

  artPlayerInstanceRef.current?.on("play", () => {
    watchTimer = setInterval(() => {
      watchedTimeRef.current += 1; // Increment watched time every second

      // Trigger API call after 5 seconds of playback
      if (watchedTimeRef.current >= 5 && !apiCalledRef.current && !type) {
        handleWatchHistory();
      }
    }, 1000); // Update every second
  });

  artPlayerInstanceRef.current?.on("pause", () => {
    if (watchTimer) {
      clearInterval(watchTimer);
      watchTimer = null;
    }
  });

  artPlayerInstanceRef.current?.on("video:ended", () => {
    if (watchTimer) {
      clearInterval(watchTimer);
      watchTimer = null;
    }
    watchedTimeRef.current = 0; // Reset watched time
  });

  // Handle active state changes
  useEffect(() => {
    if (!playerContainerRef.current) return;

    if (isActive) {
      // Initialize or reinitialize player when becoming active
      initializePlayer();
      
      // Function to attempt playback
      const attemptPlay = () => {
        if (!artPlayerInstanceRef.current) return;
        artPlayerInstanceRef.current.play().catch((error) => {
          console.error('Video play failed:', error);
          if (error.name === 'NotAllowedError') {
            // Reset to poster image
            if (artPlayerInstanceRef.current) {
              artPlayerInstanceRef.current.currentTime = 0;
              artPlayerInstanceRef.current.controls.show = true;
              artPlayerInstanceRef.current.video.load(); // Load the video // Small delay to ensure video has loaded
            }
          }
        });
      };

      attemptPlay();

      // Set quality to auto for active video
      if (hlsRef.current) {
        hlsRef.current.currentLevel = -1;
      }
    } else {
      // Cleanup when inactive
      if (artPlayerInstanceRef.current) {
        artPlayerInstanceRef.current.destroy();
        artPlayerInstanceRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      // Video becomes inactive
      // artPlayerInstanceRef.current.pause();
      // artPlayerInstanceRef.current.muted = true;
      
      // Set to lowest quality when inactive
      // if (hlsRef.current) {
      //   hlsRef.current.currentLevel = 0;
      // }
    }
  }, [isActive]);

  // Initialize player when component mounts
  useEffect(() => {
    initializePlayer();
    return () => {
      if (artPlayerInstanceRef.current) {
        artPlayerInstanceRef.current.destroy();
        artPlayerInstanceRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]); // Reinitialize when src changes

  useEffect(() => {
    if (
      isPlay &&
      artPlayerInstanceRef.current &&
      !artPlayerInstanceRef.current.playing
    ) {
      artPlayerInstanceRef.current.play();
    }
  }, [isPlay]);

  useEffect(() => {
    muteRef.current = mute; // Update muteRef when mute state changes
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.muted = mute;
    }
  }, [mute]);

  // Handle rotate state changes
  useEffect(() => {
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.fullscreen = rotate;
    }
  }, [rotate]);

  const cleanupPlayer = () => {
    if (artPlayerInstanceRef.current) {
      // Force garbage collection of video resources
      const video = artPlayerInstanceRef.current.video;
      if (video) {
        video.removeAttribute('src');
        video.load();
      }
      artPlayerInstanceRef.current.destroy();
      artPlayerInstanceRef.current = null;
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className={`video_player w-full ${p_img ? "poster_change" : ""}`}
      style={{ minHeight: '200px' }} // Add minimum height to prevent collapse
    />
  );
};

export default Player;
