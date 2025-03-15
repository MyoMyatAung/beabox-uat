import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../indicator.png";
import vod_loader from "../vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { useWatchtPostMutation } from "../services/homeApi";
import { showToast } from "../services/errorSlice";
import { decryptImage } from "@/utils/imageDecrypt";
import { c } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { setMute } from "../services/muteSlice";
import { sethideBar } from "../services/hideBarSlice";
import forward from "../forward.gif";
// Constants for video preloading
const BUFFER_THRESHOLD = 10; // seconds before current position to start buffering
const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB maximum buffer size
// Add constants for video position remembering
const POSITION_SAVE_INTERVAL = 5000; // Save position every 5 seconds
const VIDEO_POSITIONS_KEY = 'video_positions'; // Local storage key

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

  rotate,
  type,
  post_id,
  isActive,
  abortControllerRef,
  indexRef,
  videoData,
}: {
  src: string;
  thumbnail: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  handleLike: () => void;

  post_id: string;
  rotate: boolean;
  type: string;
  width: number;
  height: number;
  isActive: boolean;
  abortControllerRef: any;
  indexRef: any;
  videoData: any;
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
  const positionSaveTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for saving position
  const [watchtPost] = useWatchtPostMutation(); // Hook for watch history API
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const [p_img, setPImg] = useState(false);
  const preloadRef = useRef<boolean>(false);
  const bufferTimer = useRef<NodeJS.Timeout | null>(null);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fastForwardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const LONG_PRESS_DELAY = 500; // ms before triggering fast forward
  const FAST_FORWARD_RATE = 2; // 2x speed for fast forward
  const FAST_FORWARD_INTERVAL = 50; // ms between each check
  const SWIPE_THRESHOLD = 30; // Increased from 10 to 30 pixels to be more tolerant of small movements
  const wasPlayingRef = useRef(false); // Track if video was playing before fast forward
  const isLongPressActiveRef = useRef(false); // Track if long press is active to prevent early cancellation

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

  // Save video position to local storage
  const saveVideoPosition = (position: number) => {
    if (!user?.token || !post_id) return;
    
    try {
      // Get existing positions from local storage
      const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || '{}';
      const positions = JSON.parse(positionsJson);
      
      // Save position for current video
      positions[post_id] = {
        position,
        timestamp: Date.now(),
      };
      
      // Save back to local storage
      localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
    } catch (error) {
      console.error('Failed to save video position:', error);
    }
  };

  // Get saved position for current video
  const getSavedPosition = (): number | null => {
    if (!user?.token || !post_id) return null;
    
    try {
      const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || '{}';
      const positions = JSON.parse(positionsJson);
      
      const savedData = positions[post_id];
      if (!savedData) return null;
      
      // Check if saved position is not too old (e.g., 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (Date.now() - savedData.timestamp > maxAge) {
        // Position is too old, remove it
        delete positions[post_id];
        localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
        return null;
      }
      
      return savedData.position;
    } catch (error) {
      console.error('Failed to get saved video position:', error);
      return null;
    }
  };

  // Start periodic position saving
  const startPositionSaving = () => {
    if (positionSaveTimerRef.current) {
      clearInterval(positionSaveTimerRef.current);
    }
    
    positionSaveTimerRef.current = setInterval(() => {
      if (artPlayerInstanceRef.current && artPlayerInstanceRef.current.playing) {
        const currentTime = artPlayerInstanceRef.current.currentTime;
        const duration = artPlayerInstanceRef.current.duration;
        
        // Only save if we have a valid time and we're not at the very beginning or end
        if (currentTime > 1 && currentTime < duration - 1) {
          saveVideoPosition(currentTime);
        }
      }
    }, POSITION_SAVE_INTERVAL);
  };

  // Stop periodic position saving
  const stopPositionSaving = () => {
    if (positionSaveTimerRef.current) {
      clearInterval(positionSaveTimerRef.current);
      positionSaveTimerRef.current = null;
    }
  };

  const handleWatchHistory = () => {
    if (!apiCalledRef.current && user?.token) {
      apiCalledRef.current = true;
      
      // Save current position before sending watch history
      if (artPlayerInstanceRef.current) {
        saveVideoPosition(artPlayerInstanceRef.current.currentTime);
      }
      
      watchtPost({ post_id: post_id })
        .unwrap()
        .then(() => console.log("Watch history updated"))
        .catch((error) =>
          console.error("Failed to update watch history", error)
        );
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

    // Show progress bar immediately when initializing player
    if (progressBarRef?.current) {
      progressBarRef.current.style.opacity = "1";
    }

    Artplayer.DBCLICK_FULLSCREEN = false;
    Artplayer.MOBILE_DBCLICK_PLAY = false;
    Artplayer.MOBILE_CLICK_PLAY = true;

    // Determine if the source is an m3u8 file
    const isM3u8 = src.toLowerCase().endsWith('.m3u8');
    
    // Configure Artplayer options
    const options: Artplayer["Option"] = {
      autoOrientation: true,
      container: playerContainerRef.current,
      url: src,
      volume: 0.5,
      muted: muteRef.current,
      autoplay: isActive,
      fullscreenWeb: true,
      poster: decryptedPhoto,
      loop: true,
      moreVideoAttr: {
        playsInline: true,
        preload: "auto" as const,
      },
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      icons: {
        loading: `<div class="video-loading-indicator" style="display: none;"><img width="100" height="100" src=${vod_loader}></div>`,
        state: `<div class="video-play-indicator" style="display: none;"><img src="${indicator}" width="50" height="50" alt="Play"></div>`,
      },
      // Set the type based on the file extension
      type: isM3u8 ? "m3u8" : "mp4",
      customType: {
        mp4: function (video: HTMLVideoElement, url: string) {
          // Configure video element
          video.preload = "metadata";

          // Create a new AbortController for the current request
          const abortController = new AbortController();
          abortControllerRef.current?.push(abortController); // Store the new controller
          videoData?.current?.push(video);
          // dispatch(setPrevious(video));
          const loadVideo = async () => {
            try {
              const headers = new Headers();
              headers.append("Range", "bytes=0-1048576");

              const response = await fetch(url, {
                headers,
                method: "GET",
                signal: abortController?.signal, // Important part
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
              console.error("Error loading video:", error);
              // Fallback to basic loading
              video.src = url;
              video.preload = "metadata";
            }
          };

          // Start loading process
          loadVideo().catch(console.error);

          // Add event listeners for dynamic loading
          video.addEventListener("canplaythrough", () => {
            // Once we can play through current buffer, load more if active
            if (isActive) {
              video.preload = "auto";
            }
          });

          video.addEventListener("waiting", () => {
            // If video is waiting for data and is active, ensure we're loading
            if (isActive) {
              video.preload = "auto";
            }
          });

          // Clean up function
          return () => {
            if (video) {
              video.pause();
              video.removeAttribute("src");
              video.load();
            }
            // // Abort fetch request
            // if (abortControllerRef.current) {
            //   abortControllerRef.current.abort();
            // }
          };
        },
        m3u8: function (videoElement: HTMLVideoElement, url: string) {
          // Check if it's an iOS device first
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          const isMacOS = /Mac/.test(navigator.userAgent);
          const isAppleDevice = isIOS || isMacOS;
          
          if (isAppleDevice && videoElement.canPlayType("application/vnd.apple.mpegurl")) {
            // Use native HLS playback for iOS devices immediately
            // alert('Using native HLS playback for iOS');
            videoElement.src = url;
            videoElement.play().catch(error => {
              console.warn('Auto-play prevented on iOS:', error);
            });
            // videoElement.addEventListener('canplay', function() {
            //   videoElement.play().catch(error => {
            //     console.warn('Auto-play prevented on iOS:', error);
            //   });
            // });
          } 
          else if (Hls.isSupported()) {
            // Use HLS.js for other browsers that support it
            // alert('Using HLS.js for HLS playback');
            const hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              enableWorker: true,
              lowLatencyMode: true,
              startLevel: -1, // Auto level selection
            });
            
            // Add error handling
            hls.on(Hls.Events.ERROR, function(event, data) {
              if (data.fatal) {
                console.error('HLS fatal error:', data.type, data.details);
                switch(data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    // Try to recover network error
                    console.log('Fatal network error encountered, trying to recover');
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('Fatal media error encountered, trying to recover');
                    hls.recoverMediaError();
                    break;
                  default:
                    // Cannot recover
                    hls.destroy();
                    break;
                }
              } else {
                console.warn('Non-fatal HLS error:', data.type, data.details);
              }
            });
            
            // Add manifest loaded event
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              console.log('HLS manifest loaded successfully');
              // Attempt to play after manifest is loaded
              videoElement.play().catch(error => {
                console.warn('Auto-play prevented:', error);
              });
            });
            
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hlsRef.current = hls;
          } 
          else {
            // Fallback for other browsers with native HLS support
            console.log('Falling back to native HLS playback');
            videoElement.src = url;
            videoElement.addEventListener('canplay', function() {
              videoElement.play().catch(error => {
                console.warn('Auto-play prevented:', error);
              });
            });
          }
        }
      },
      layers: [
        {
          html: `
            <div class="custom-progress-container">
              <input type="range" min="0" max="100" step="0.1" class="custom-progress-bar chrome-fix" />
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
            pointerEvents: "auto", // Ensure it can receive pointer events
            display: "block", // Always display the container
            visibility: "visible", // Ensure visibility
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
            
            // Force visibility for Chrome
            progressBarRef.current.style.opacity = "1";
            progressBarRef.current.style.display = "block";
            progressBarRef.current.style.visibility = "visible";
            
            // Add specific Chrome styles
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome) {
              progressBarRef.current.style.webkitAppearance = "none";
              progressBarRef.current.style.appearance = "none";
              progressBarRef.current.style.background = "rgba(255, 255, 255, 0.2)";
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.borderRadius = "2px";
              progressBarRef.current.style.outline = "none";
              progressBarRef.current.style.transition = "opacity 0.2s";
              progressBarRef.current.style.cursor = "pointer";
            }

            // Desktop events
            progressBarRef.current.addEventListener("input", (e) => {
              if (!artPlayerInstanceRef.current) return;
              if (!isDraggingRef.current) {
                dispatch(sethideBar(true));
                if (progressBarRef?.current?.style) {
                  progressBarRef.current.style.height = "10px";
                  progressBarRef.current.style.setProperty(
                    "--thumb-width",
                    "16px"
                  );
                  progressBarRef.current.style.setProperty(
                    "--thumb-height",
                    "20px"
                  );
                  progressBarRef.current.style.setProperty(
                    "--thumb-radius",
                    "5px"
                  );
                }
                isDraggingRef.current = true;
                timeDisplayRef.current!.style.display = "block";
              }

              const value = parseFloat((e.target as HTMLInputElement).value);
              seekTimeRef.current =
                (value / 100) * artPlayerInstanceRef.current.duration;
              progressBarRef.current?.style.setProperty(
                "--progress",
                `${value}%`
              );

              if (timeDisplayRef.current) {
                const currentTime = formatTime(seekTimeRef.current);
                const duration = formatTime(
                  artPlayerInstanceRef.current.duration
                );
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            progressBarRef.current.addEventListener("change", () => {
              if (!artPlayerInstanceRef.current || !isDraggingRef.current)
                return;
              isDraggingRef.current = false;
              dispatch(sethideBar(false));
              if (progressBarRef.current) {
                progressBarRef.current.style.height = "4px";
                progressBarRef.current.style.setProperty(
                  "--thumb-width",
                  "12px"
                );
                progressBarRef.current.style.setProperty(
                  "--thumb-height",
                  "12px"
                );
                progressBarRef.current.style.setProperty(
                  "--thumb-radius",
                  "50%"
                );
              }
              timeDisplayRef.current!.style.display = "none";
              artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
            });

            // Mobile touch events
            element.addEventListener("touchstart", (e) => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current)
                return;
              const touch = e.touches[0];
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(
                Math.max((touchX / rect.width) * 100, 0),
                100
              );

              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty(
                "--progress",
                `${percent}%`
              );
              isDraggingRef.current = true;
              dispatch(sethideBar(true));
              progressBarRef.current.style.height = "10px";
              progressBarRef.current.style.setProperty("--thumb-width", "16px");
              progressBarRef.current.style.setProperty(
                "--thumb-height",
                "20px"
              );
              progressBarRef.current.style.setProperty("--thumb-radius", "5px");
              timeDisplayRef.current!.style.display = "block";

              const newTime =
                (percent / 100) * artPlayerInstanceRef.current.duration;
              seekTimeRef.current = newTime;
              if (timeDisplayRef.current) {
                const currentTime = formatTime(newTime);
                const duration = formatTime(
                  artPlayerInstanceRef.current.duration
                );
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            element.addEventListener("touchmove", (e) => {
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              e.preventDefault();
              const touch = e.touches[0];
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(
                Math.max((touchX / rect.width) * 100, 0),
                100
              );

              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty(
                "--progress",
                `${percent}%`
              );
              seekTimeRef.current =
                (percent / 100) * artPlayerInstanceRef.current.duration;

              if (timeDisplayRef.current) {
                const currentTime = formatTime(seekTimeRef.current);
                const duration = formatTime(
                  artPlayerInstanceRef.current.duration
                );
                timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
              }
            });

            element.addEventListener("touchend", () => {
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              isDraggingRef.current = false;
              dispatch(sethideBar(false));
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.setProperty("--thumb-width", "12px");
              progressBarRef.current.style.setProperty(
                "--thumb-height",
                "12px"
              );
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
                  console.error("Manual play failed:", error);
                  if (playIconRef.current) {
                    playIconRef.current.style.display = "block";
                  }
                });
              }
            });
          },
        },
        {
          html: `
            <div class="click-layer">
              <div class="fast-forward-indicator" style="display: none; opacity: 0;">
                <span>快进播放 x2</span>
                <img src="${forward}" alt="forward" style="width: 16px; height: 16px;" />
              </div>
            </div>
          `,
          style: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "95%",
            zIndex: "10",
            background: "transparent",
            userSelect: "none",
            webkitUserSelect: "none",
            webkitTouchCallout: "none",
            touchAction: "pan-y",
          },
          mounted: (element: HTMLElement) => {
            let lastClick = 0;
            let singleClickTimeout: NodeJS.Timeout | null = null;
            let isLongPress = false;
            const ffIndicator = element.querySelector('.fast-forward-indicator') as HTMLElement;
            const ffIcon = element.querySelector('.ff-icon') as HTMLElement;
            
            if (ffIndicator) {
              // Set initial styles
              Object.assign(ffIndicator.style, {
                position: 'absolute',
                bottom: '0%',  // Changed from bottom: '0%' to center vertically
                left: '50%',
                transform: 'translate(-50%, -50%)',  // Center both horizontally and vertically
                backgroundColor: '#282630',
                color: 'white',
                padding: '8px 16px',  // Slightly increased padding
                borderRadius: '20px',  // Increased border radius
                fontSize: '14px',
                fontWeight: '500',  // Slightly bolder
                display: 'none',
                opacity: '0',
                alignItems: 'center',
                gap: '8px',  // Increased gap between text and icon
                minWidth: '120px',
                justifyContent: 'center',
                letterSpacing: '0.5px',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: '9999'  // Ensure it's above other UI elements
              });
            }

            if (ffIcon) {
              Object.assign(ffIcon.style, {
                fontSize: '16px',
                lineHeight: '1',
                marginRight: '2px'
              });
            }

            const handleLongPressStart = (e: TouchEvent | MouseEvent) => {
              if ('touches' in e) {
                const touch = e.touches[0];
                touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
              }

              // Clear any existing timers
              if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
              }

              longPressTimerRef.current = setTimeout(() => {
                if (touchStartPosRef.current) {
                  isLongPress = true;
                  isLongPressActiveRef.current = true; // Set the ref to true when long press becomes active
                  startFastForward();
                  if (ffIndicator) {
                    ffIndicator.style.display = 'flex';
                    // Add animation
                    ffIndicator.style.transition = 'opacity 0.2s ease-in-out';
                    ffIndicator.style.opacity = '1';
                  }
                }
              }, LONG_PRESS_DELAY);
            };

            const handleLongPressEnd = () => {
              if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
              }
              if (isLongPress) {
                stopFastForward();
                if (ffIndicator) {
                  // Fade out animation
                  ffIndicator.style.opacity = '0';
                  setTimeout(() => {
                    ffIndicator.style.display = 'none';
                  }, 200);
                }
              }
              isLongPress = false;
              isLongPressActiveRef.current = false; // Reset the ref when long press ends
              touchStartPosRef.current = null;
            };

            const handleTouchMove = (e: TouchEvent) => {
              if (!touchStartPosRef.current) return;

              const touch = e.touches[0];
              const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
              const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

              // If user is swiping significantly (especially vertically), cancel long press
              // But only if long press hasn't already activated
              if ((deltaX > SWIPE_THRESHOLD || deltaY > SWIPE_THRESHOLD) && !isLongPressActiveRef.current) {
                handleLongPressEnd();
                return;
              }

              // If long press is already active, be more tolerant of movement
              if (isLongPressActiveRef.current) {
                // Allow more movement once fast forward is active
                if (deltaX > SWIPE_THRESHOLD * 3 || deltaY > SWIPE_THRESHOLD * 3) {
                  handleLongPressEnd();
                  return;
                }
                e.preventDefault(); // Prevent scrolling when in fast forward mode
              }
            };

            // Touch events
            element.addEventListener('touchstart', (e) => {
              const now = Date.now();
              
              // Handle double tap
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
                // Handle single tap
                singleClickTimeout = setTimeout(() => {
                  if (!isLongPress && artPlayerInstanceRef.current) {
                    if (artPlayerInstanceRef.current.playing) {
                      artPlayerInstanceRef.current.pause();
                      showPlayButton();
                    } else {
                      artPlayerInstanceRef.current.play();
                      hidePlayButton();
                    }
                  }
                }, 300);
              }
              lastClick = now;
              
              handleLongPressStart(e);
            });

            element.addEventListener('touchmove', handleTouchMove);
            element.addEventListener('touchend', handleLongPressEnd);
            element.addEventListener('touchcancel', handleLongPressEnd);

            // Prevent context menu
            element.addEventListener('contextmenu', (e) => e.preventDefault());
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

    // Add ready event listener after creating the player
    artPlayerInstanceRef.current.on("ready", () => {
      // Check if there's a saved position for this video
      const savedPosition = getSavedPosition();
      if (savedPosition && artPlayerInstanceRef.current) {
        // Set the player to the saved position
        artPlayerInstanceRef.current.currentTime = savedPosition;
      }
      
      // Start periodic position saving
      startPositionSaving();
    });

    // Update progress bar while playing
    artPlayerInstanceRef.current.on("video:timeupdate", () => {
      if (
        progressBarRef.current &&
        artPlayerInstanceRef.current &&
        !isDraggingRef.current
      ) {
        const currentTime = artPlayerInstanceRef.current.currentTime || 0;
        const duration = artPlayerInstanceRef.current.duration || 1;
        const newProgress = (currentTime / duration) * 100;
        progressBarRef.current.value = newProgress.toString();
        progressBarRef.current.style.setProperty(
          "--progress",
          `${newProgress}%`
        );
        
        // Ensure progress bar is always visible in Chrome
        if (progressBarRef.current.style.opacity !== "1") {
          progressBarRef.current.style.opacity = "1";
        }
      }
    });

    // Add event listeners for video state
    artPlayerInstanceRef.current.on("ready", () => {
      if (width > height) {
        setPImg(true);
      } else {
        setPImg(false);
      }

      // Don't show any indicators in the ready event
      // The video:loadstart or video:canplay events will handle showing the appropriate indicator
    });

    // Add loading state handler with progress bar visibility check
    artPlayerInstanceRef.current.on("video:waiting", () => {
      // Ensure progress bar is visible during loading
      if (progressBarRef?.current) {
        progressBarRef.current.style.opacity = "1";
      }

      // Show loading indicator and hide play button
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;
      const playIndicator =
        artPlayerInstanceRef.current?.template?.$state?.querySelector(
          ".video-play-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "block";
      if (playIndicator) playIndicator.style.display = "none";
      
      // Also hide the custom play icon
      if (playIconRef.current) {
        playIconRef.current.style.display = "none";
      }
    });

    // Add error handler to ensure progress bar remains visible
    artPlayerInstanceRef.current.on("error", (error) => {
      console.error("Video loading error:", error);
      // Ensure progress bar remains visible even on error
      if (progressBarRef?.current) {
        progressBarRef.current.style.opacity = "1";
      }
      showPlayButton();
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "none";
    });

    // Add play state handlers with enhanced error handling
    artPlayerInstanceRef.current.on("play", () => {
      if (!isFastForwarding) {
        hidePlayButton();
      }
    });

    artPlayerInstanceRef.current.on("pause", () => {
      if (!isFastForwarding) {
        showPlayButton();
      }
    });

    artPlayerInstanceRef.current.on("video:playing", () => {
      if (!isFastForwarding) {
        hidePlayButton();
      }
    });

    artPlayerInstanceRef.current.on("video:pause", () => {
      if (!isFastForwarding) {
        showPlayButton();
      }
    });

    // Handle seeking end
    artPlayerInstanceRef.current.on("seeked", () => {
      if (!isFastForwarding && !artPlayerInstanceRef.current?.playing) {
        showPlayButton();
      }
    });

    // Add initial loading state
    artPlayerInstanceRef.current.on("video:loadstart", () => {
      // Show loading indicator and hide play button
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;
      const playIndicator =
        artPlayerInstanceRef.current?.template?.$state?.querySelector(
          ".video-play-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "block";
      if (playIndicator) playIndicator.style.display = "none";
      
      // Also hide the custom play icon
      if (playIconRef.current) {
        playIconRef.current.style.display = "none";
      }
    });

    // Add canplay event to hide loading indicator and show play button if needed
    artPlayerInstanceRef.current.on("video:canplay", () => {
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;
      
      if (loadingIndicator) loadingIndicator.style.display = "none";
      
      // Only show play button if video is not playing
      if (artPlayerInstanceRef.current && !artPlayerInstanceRef.current.playing && !isFastForwarding) {
        showPlayButton();
      } else {
        hidePlayButton();
      }
    });

    artPlayerInstanceRef.current.on("video:ended", () => {
      // Clear saved position when video ends
      if (user?.token && post_id) {
        try {
          const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || '{}';
          const positions = JSON.parse(positionsJson);
          
          // Remove position for this video
          if (positions[post_id]) {
            delete positions[post_id];
            localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
          }
        } catch (error) {
          console.error('Failed to clear video position:', error);
        }
      }
      
      // Stop position saving
      stopPositionSaving();
      
      // Reset watched time for analytics
      if (watchTimer) {
        clearInterval(watchTimer);
        watchTimer = null;
      }
      watchedTimeRef.current = 0;
      
      // The video will automatically loop due to the loop option
      console.log('Video ended, looping will begin automatically');
      
      // Start a new timer for the looped playback if needed
      watchTimer = setInterval(() => {
        watchedTimeRef.current += 1; // Increment watched time every second
        
        // Trigger API call after 5 seconds of playback on loop
        if (watchedTimeRef.current >= 5 && !apiCalledRef.current && !type) {
          handleWatchHistory();
        }
      }, 1000);
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

  // Handle active state changes
  useEffect(() => {
    if (!playerContainerRef.current) return;

    if (isActive) {
      // Increment the index when a new video becomes active
      indexRef.current++;

      // Abort previous request when index >= 1
      if (indexRef.current > 1 && abortControllerRef.current.length > 0) {
        abortControllerRef.current[0].abort(); // Abort the first (oldest) request
        abortControllerRef.current.splice(0, 1); // Remove the first item from the array
        if (videoData?.current.length > 0) {
          videoData?.current[0].pause();
          videoData?.current[0].removeAttribute("src");
          videoData?.current[0].load(); // Reset the video element
          videoData?.current.splice(0, 1);
          indexRef.current--; // Decrease index count
        }
      }

      initializePlayer();

      // Function to attempt playback
      const attemptPlay = () => {
        if (!artPlayerInstanceRef.current) return;
        
        artPlayerInstanceRef.current.play()
          .then(() => {
            hidePlayButton();
          })
          .catch((error) => {
            console.error("Video play failed:", error);
            showPlayButton();
            
            // Handle autoplay blocking specifically
            if (error.name === "NotAllowedError") {
              if (artPlayerInstanceRef.current) {
                artPlayerInstanceRef.current.pause();
                // Show controls to allow manual play
                artPlayerInstanceRef.current.controls.show = true;
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
      // if (abortControllerRef.current) {
      //   abortControllerRef.current.abort();
      //   abortControllerRef.current = null;
      // }
    }
  }, [isActive]);

  // Initialize player when component mounts
  useEffect(() => {
    initializePlayer();
    
    // Force progress bar visibility after a short delay
    // This helps with Chrome visibility issues
    const progressBarVisibilityTimer = setTimeout(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.opacity = "1";
        progressBarRef.current.style.display = "block";
        
        // Add Chrome-specific styles
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome) {
          // Add styles to the head
          const styleEl = document.createElement('style');
          styleEl.textContent = `
            .chrome-fix {
              -webkit-appearance: none !important;
              appearance: none !important;
              background: rgba(255, 255, 255, 0.2) !important;
              height: 4px !important;
              border-radius: 2px !important;
              outline: none !important;
              opacity: 1 !important;
              display: block !important;
              visibility: visible !important;
              cursor: pointer !important;
            }
            
            .chrome-fix::-webkit-slider-thumb {
              -webkit-appearance: none !important;
              appearance: none !important;
              width: 12px !important;
              height: 12px !important;
              background: #d53ff0 !important;
              border-radius: 50% !important;
              cursor: pointer !important;
            }
            
            .custom-progress-container {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
          `;
          document.head.appendChild(styleEl);
          
          // Create a MutationObserver to ensure the progress bar is always visible
          if (playerContainerRef.current) {
            const observer = new MutationObserver((mutations) => {
              // Check if our progress bar exists
              if (progressBarRef.current) {
                // Force visibility
                progressBarRef.current.style.opacity = "1";
                progressBarRef.current.style.display = "block";
                progressBarRef.current.style.visibility = "visible";
              }
            });
            
            // Start observing the player container for DOM changes
            observer.observe(playerContainerRef.current, { 
              childList: true, 
              subtree: true,
              attributes: true,
              attributeFilter: ['style', 'class']
            });
            
            // Return cleanup function
            return () => {
              observer.disconnect();
            };
          }
        }
      }
    }, 500);
    
    return () => {
      clearTimeout(progressBarVisibilityTimer);
      // Save position before unmounting
      if (artPlayerInstanceRef.current) {
        saveVideoPosition(artPlayerInstanceRef.current.currentTime);
      }
      
      // Stop position saving
      stopPositionSaving();
      
      if (artPlayerInstanceRef.current) {
        artPlayerInstanceRef.current.destroy();
        artPlayerInstanceRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, post_id, user]);

  // useEffect(() => {
  //   if (
  //     isPlay &&
  //     artPlayerInstanceRef.current &&
  //     !artPlayerInstanceRef.current.playing
  //   ) {
  //     artPlayerInstanceRef.current.play();
  //   }
  // }, [isPlay]);

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

  const hidePlayButton = () => {
    if (playIconRef.current) {
      playIconRef.current.style.display = 'none';
    }
    
    // Also hide the template play indicator
    if (artPlayerInstanceRef.current?.template?.$state) {
      const playIndicator = artPlayerInstanceRef.current.template.$state.querySelector(
        ".video-play-indicator"
      ) as HTMLDivElement;
      if (playIndicator) playIndicator.style.display = "none";
    }
  };

  const showPlayButton = () => {
    // Only show play button if video is paused and not fast forwarding
    if (!artPlayerInstanceRef.current?.playing && !isFastForwarding) {
      // First ensure loading indicator is hidden
      if (artPlayerInstanceRef.current?.template?.$loading) {
        const loadingIndicator = artPlayerInstanceRef.current.template.$loading.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;
        if (loadingIndicator) loadingIndicator.style.display = "none";
      }
      
      // Then show play button
      if (playIconRef.current) {
        playIconRef.current.style.display = 'block';
      }
      
      // Also show template play indicator
      if (artPlayerInstanceRef.current?.template?.$state) {
        const playIndicator = artPlayerInstanceRef.current.template.$state.querySelector(
          ".video-play-indicator"
        ) as HTMLDivElement;
        if (playIndicator) playIndicator.style.display = "block";
      }
    }
  };

  const startFastForward = () => {
    if (!artPlayerInstanceRef.current) return;
    
    // Store playing state before fast forward
    wasPlayingRef.current = artPlayerInstanceRef.current.playing;
    
    setIsFastForwarding(true);
    isLongPressActiveRef.current = true; // Ensure the ref is set when fast forward starts
    hidePlayButton(); // Always hide play button when starting fast forward
    dispatch(sethideBar(true)); // Hide UI layers during fast forward
    
    const player = artPlayerInstanceRef.current;
    
    // Ensure video is playing during fast forward
    player.play();
    // Set playback rate to 2x
    player.playbackRate = FAST_FORWARD_RATE;
    
    // Ensure progress bar is visible during fast forward
    if (progressBarRef.current) {
      progressBarRef.current.style.opacity = "1";
      progressBarRef.current.style.display = "block";
    }
    
    fastForwardIntervalRef.current = setInterval(() => {
      if (player.currentTime >= player.duration - 1) {
        stopFastForward(); // Stop at end of video
      }
      
      // Update progress bar during fast forward
      if (progressBarRef.current) {
        const currentTime = player.currentTime || 0;
        const duration = player.duration || 1;
        const newProgress = (currentTime / duration) * 100;
        progressBarRef.current.value = newProgress.toString();
        progressBarRef.current.style.setProperty(
          "--progress",
          `${newProgress}%`
        );
      }
    }, FAST_FORWARD_INTERVAL);
  };

  const stopFastForward = () => {
    if (!artPlayerInstanceRef.current) return;
    
    if (fastForwardIntervalRef.current) {
      clearInterval(fastForwardIntervalRef.current);
      fastForwardIntervalRef.current = null;
    }

    const player = artPlayerInstanceRef.current;
    player.playbackRate = 1; // Reset playback rate
    
    setIsFastForwarding(false);
    isLongPressActiveRef.current = false; // Reset the ref when fast forward stops
    dispatch(sethideBar(false)); // Show UI layers again
    
    // Always continue playing after fast forward
    player.play();
    hidePlayButton();
  };

  const cleanupPlayer = () => {
    // Save position before cleanup
    if (artPlayerInstanceRef.current) {
      saveVideoPosition(artPlayerInstanceRef.current.currentTime);
    }
    
    // Stop position saving
    stopPositionSaving();
    
    if (artPlayerInstanceRef.current) {
      // Force garbage collection of video resources
      const video = artPlayerInstanceRef.current.video;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      artPlayerInstanceRef.current.destroy();
      artPlayerInstanceRef.current = null;
    }
    
    // Clean up HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (fastForwardIntervalRef.current) {
      clearInterval(fastForwardIntervalRef.current);
      fastForwardIntervalRef.current = null;
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className={`video_player w-full ${p_img ? "poster_change" : ""}`}
      style={{ minHeight: "200px" }} // Add minimum height to prevent collapse
    />
  );
};

export default Player;