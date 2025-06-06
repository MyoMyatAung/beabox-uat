// import { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import Hls from "hls.js";
// import indicator from "../indicator.png";
// import vod_loader from "../vod_loader.gif";
// import { useDispatch, useSelector } from "react-redux";
// import { useWatchtPostMutation } from "../services/homeApi";
// import { showToast } from "../services/errorSlice";
// import { decryptImage } from "@/utils/imageDecrypt";
// import { ar, c } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
// import { setMute } from "../services/muteSlice";
// import { sethideBar } from "../services/hideBarSlice";
// import forward from "../Fastforward.gif";
// import sprite_loading from "../../../assets/sprite_loading.gif";
// // Constants for video preloading
// const BUFFER_THRESHOLD = 10; // seconds before current position to start buffering
// const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB maximum buffer size
// // Add constants for video position remembering
// const POSITION_SAVE_INTERVAL = 5000; // Save position every 5 seconds
// const VIDEO_POSITIONS_KEY = "video_positions"; // Local storage key

// interface RootState {
//   muteSlice: {
//     mute: boolean;
//   };
//   persist: {
//     user: {
//       token: string;
//     };
//   };
// }

// const Player = ({
//   src,
//   width,
//   height,
//   thumbnail,
//   setWidth,
//   setHeight,
//   handleLike,
//   p_img,
//   rotate,
//   type,
//   post_id,
//   isActive,
//   abortControllerRef,
//   indexRef,
//   videoData,
//   setShowRotate,
//   video,
// }: {
//   src: string;
//   thumbnail: string;
//   setWidth: (width: number) => void;
//   setHeight: (height: number) => void;
//   handleLike: () => void;
//   p_img: any;
//   post_id: string;
//   rotate: boolean;
//   type: string;
//   width: number;
//   height: number;
//   isActive: boolean;
//   abortControllerRef: any;
//   indexRef: any;
//   videoData: any;
//   video: any;
//   setShowRotate: any;
// }) => {
//   const playerContainerRef = useRef<HTMLDivElement | null>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const { mute } = useSelector((state: RootState) => state.muteSlice);
//   const user = useSelector((state: RootState) => state.persist.user);
//   const { playstart } = useSelector((state: any) => state.playSlice);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isPlay, setIsplay] = useState(false);
//   const playIconRef = useRef<HTMLDivElement | null>(null);
//   const progressBarRef = useRef<HTMLInputElement | null>(null); // Reference to the range input
//   const isDraggingRef = useRef(false); // Track if the user is dragging the progress bar
//   const seekTimeRef = useRef(0); // Store the seek time while dragging
//   const timeDisplayRef = useRef<HTMLDivElement | null>(null); // Reference to the time display
//   const muteRef = useRef(mute); // Store latest mute state
//   const watchedTimeRef = useRef(0); // Track total watched time
//   const apiCalledRef = useRef(false); // Ensure API is called only once
//   const positionSaveTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for saving position
//   const [watchtPost] = useWatchtPostMutation(); // Hook for watch history API
//   const [decryptedPhoto, setDecryptedPhoto] = useState("");
//   // const [p_img, setPImg] = useState(false);
//   const preloadRef = useRef<boolean>(false);
//   const bufferTimer = useRef<NodeJS.Timeout | null>(null);
//   const [isFastForwarding, setIsFastForwarding] = useState(false);
//   const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const fastForwardIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
//   const LONG_PRESS_DELAY = 500; // ms before triggering fast forward
//   const FAST_FORWARD_RATE = 2; // 2x speed for fast forward
//   const FAST_FORWARD_INTERVAL = 50; // ms between each check
//   const SWIPE_THRESHOLD = 30; // Increased from 10 to 30 pixels to be more tolerant of small movements
//   const wasPlayingRef = useRef(false); // Track if video was playing before fast forward
//   const isLongPressActiveRef = useRef(false); // Track if long press is active to prevent early cancellation
//   const [newStart, setnewStart] = useState(false);
//   const watchTimerRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the watch timer
//   const [isSpriteLoading, setIsSpriteLoading] = useState(false);

//   const dispatch = useDispatch();

//   const [thumbnailPreview, setThumbnailPreview] = useState({
//     visible: false,
//     position: { x: 0, y: 0 },
//     time: 0,
//   });

//   const spriteImageUrlRef = useRef<string | null>(null);
//   const metadata = video?.sprite_metadata || {};

//   // // Load and decrypt the sprite image
//   // const loadAndDecryptSprite = async () => {
//   //   try {
//   //     const spriteUrl = video.sprite_url || "";
//   //     setIsSpriteLoading(true); // Set loading state

//   //     const xorKey = 0x12;
//   //     const encryptSize = 4096;

//   //     const response = await fetch(spriteUrl);

//   //     const base64Text = await response.text();

//   //     // XOR-decrypt the first N characters
//   //     const chars = base64Text.split("");
//   //     const max = Math.min(encryptSize, chars.length);
//   //     for (let i = 0; i < max; i++) {
//   //       const xorCharCode = chars[i].charCodeAt(0) ^ xorKey;
//   //       chars[i] = String.fromCharCode(xorCharCode);
//   //     }

//   //     const decryptedBase64 = chars.join("");

//   //     // Parse base64 into Blob
//   //     const [header, base64Data] = decryptedBase64.includes("base64,")
//   //       ? decryptedBase64.split(",")
//   //       : ["data:image/jpeg;base64", decryptedBase64];

//   //     const byteString = atob(base64Data);
//   //     const byteArray = new Uint8Array(byteString.length);
//   //     for (let i = 0; i < byteString.length; i++) {
//   //       byteArray[i] = byteString.charCodeAt(i);
//   //     }

//   //     const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";
//   //     const blob = new Blob([byteArray], { type: mimeType });

//   //     // Create object URL
//   //     const url = URL.createObjectURL(blob);

//   //     spriteImageUrlRef.current = url; // Update the ref
//   //   } catch (error) {
//   //     console.error("Error loading sprite:", error);
//   //   }
//   // };

//   const loadAndDecryptSprite = async () => {
//     try {
//       if (spriteImageUrlRef.current || !video?.sprite_url) return;

//       setIsSpriteLoading(true); // Set loading state

//       const spriteUrl = video.sprite_url;
//       const xorKey = 0x12;
//       const encryptSize = 4096;

//       const response = await fetch(spriteUrl);
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);

//       const base64Text = await response.text();

//       // XOR-decrypt the first N characters
//       const chars = base64Text.split("");
//       const max = Math.min(encryptSize, chars.length);
//       for (let i = 0; i < max; i++) {
//         const xorCharCode = chars[i].charCodeAt(0) ^ xorKey;
//         chars[i] = String.fromCharCode(xorCharCode);
//       }

//       const decryptedBase64 = chars.join("");

//       // Parse base64 into Blob
//       const [header, base64Data] = decryptedBase64.includes("base64,")
//         ? decryptedBase64.split(",")
//         : ["data:image/jpeg;base64", decryptedBase64];

//       const byteString = atob(base64Data);
//       const byteArray = new Uint8Array(byteString.length);
//       for (let i = 0; i < byteString.length; i++) {
//         byteArray[i] = byteString.charCodeAt(i);
//       }

//       const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";
//       const blob = new Blob([byteArray], { type: mimeType });

//       // Create object URL
//       const url = URL.createObjectURL(blob);
//       spriteImageUrlRef.current = url;
//     } catch (error) {
//       console.error("Error loading sprite:", error);
//     } finally {
//       setIsSpriteLoading(false); // Clear loading state
//     }
//   };
//   // Get sprite position for a given time
//   const getSpritePosition = (time: number) => {
//     const index = Math.floor(time / metadata.frameInterval);
//     if (index >= metadata.frameCount) return null;

//     const col = index % metadata.tileCols;
//     const row = Math.floor(index / metadata.tileCols);
//     const x = col * metadata.tileWidth;
//     const y = row * metadata.tileHeight;

//     return { x, y };
//   };

//   // Update thumbnail preview
//   const updateThumbnailPreview = (time: number, clientX: number) => {
//     // if (!artPlayerInstanceRef.current || !spriteImageUrlRef.current) return;

//     const pos = getSpritePosition(time);
//     if (!pos) return;

//     setThumbnailPreview({
//       visible: true,
//       position: {
//         x: clientX - 80, // Center the preview under the cursor
//         y: -100, // Position above the progress bar
//       },
//       time,
//     });
//   };

//   // Add this useEffect near your other hooks
//   useEffect(() => {
//     if (!artPlayerInstanceRef.current) return;

//     // Find the preview element in the DOM
//     const previewElement = playerContainerRef.current?.querySelector(
//       ".thumbnail-preview"
//     ) as HTMLDivElement;
//     //  if (!previewElement || !spriteImageUrlRef.current) return;

//     if (thumbnailPreview.visible) {
//       const pos = getSpritePosition(thumbnailPreview.time);
//       if (pos) {
//         previewElement.style.display = "block";
//         // Calculate maximum left position to keep thumbnail within viewport
//         const thumbnailWidth = metadata.isPortrait ? 90 : 160;
//         const viewportWidth = window.innerWidth;
//         const maxLeft = viewportWidth - thumbnailWidth - 10; // buffer from right edge
//         const innerDiv = previewElement.querySelector(".bg-th");

//         // Constrain the position
//         let leftPosition = thumbnailPreview.position.x + 20;
//         leftPosition = Math.max(10, Math.min(leftPosition, maxLeft)); // 10px minimum from left edge

//         previewElement.style.left = `${leftPosition}px`;
//         previewElement.style.bottom = "100px";

//         if (isSpriteLoading && video?.sprite_url) {
//           const innerDiv = previewElement.querySelector(".bg-th");

//           if (innerDiv) {
//             innerDiv.style.backgroundImage = `url(${sprite_loading})`;
//           }
//         } else {
//           const innerDiv = previewElement.querySelector(".bg-th");
//           if (innerDiv) {
//             innerDiv.style.backgroundImage = `url(${spriteImageUrlRef.current})`;
//           }
//         }

//         // Calculate the correct scale factor to fit the sprite in our thumbnail
//         const scaleX = metadata.isPortrait
//           ? 90 / metadata.tileWidth
//           : 160 / metadata.tileWidth;
//         const scaleY = metadata.isPortrait
//           ? 160 / metadata.tileHeight
//           : 90 / metadata.tileHeight;

//         // Use the same scaling for X and Y to maintain aspect ratio
//         const scale = Math.min(scaleX, scaleY);

//         // Calculate scaled position based on the size ratio
//         const scaledX = pos.x * scale;
//         const scaledY = pos.y * scale;

//         if (innerDiv) {
//           // Set the background size and position with appropriate scaling
//           innerDiv.style.backgroundPosition = `-${scaledX}px -${scaledY}px`;
//         }

//         // Calculate the full sprite size
//         const fullWidth = metadata.tileCols * metadata.tileWidth;
//         const fullHeight = metadata.tileRows * metadata.tileHeight;

//         // Scale the full sprite to match our thumbnail dimensions while maintaining aspect ratio
//         const scaledWidth = fullWidth * scale;
//         const scaledHeight = fullHeight * scale;

//         if (innerDiv) {
//           innerDiv.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
//         }
//       }
//     } else {
//       previewElement.style.display = "none";
//     }
//   }, [thumbnailPreview]);

//   // Format time (e.g., 65 => "01:05")
//   const formatTime = (time: number) => {
//     const hours = Math.floor(time / 3600);
//     const minutes = Math.floor((time % 3600) / 60);
//     const seconds = Math.floor(time % 60);
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
//   };

//   // Save video position to local storage
//   const saveVideoPosition = (position: number) => {
//     if (!post_id) return;

//     try {
//       // Get existing positions from local storage
//       const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
//       const positions = JSON.parse(positionsJson);

//       // Save position for current video
//       positions[post_id] = {
//         position,
//         timestamp: Date.now(),
//       };

//       // Save back to local storage
//       localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
//     } catch (error) {
//       console.error("Failed to save video position:", error);
//     }
//   };

//   // Get saved position for current video
//   const getSavedPosition = (): number | null => {
//     if (!post_id) return null;

//     try {
//       const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
//       const positions = JSON.parse(positionsJson);

//       const savedData = positions[post_id];
//       if (!savedData) return null;

//       // Check if saved position is not too old (e.g., 7 days)
//       const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//       if (Date.now() - savedData.timestamp > maxAge) {
//         // Position is too old, remove it
//         delete positions[post_id];
//         localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
//         return null;
//       }

//       return savedData.position;
//     } catch (error) {
//       console.error("Failed to get saved video position:", error);
//       return null;
//     }
//   };

//   // Start periodic position saving
//   const startPositionSaving = () => {
//     if (positionSaveTimerRef.current) {
//       clearInterval(positionSaveTimerRef.current);
//     }

//     positionSaveTimerRef.current = setInterval(() => {
//       if (
//         artPlayerInstanceRef.current &&
//         artPlayerInstanceRef.current.playing
//       ) {
//         const currentTime = artPlayerInstanceRef.current.currentTime;
//         const duration = artPlayerInstanceRef.current.duration;

//         // Only save if we have a valid time and we're not at the very beginning or end
//         if (currentTime > 1 && currentTime < duration - 1) {
//           saveVideoPosition(currentTime);
//         }
//       }
//     }, POSITION_SAVE_INTERVAL);
//   };

//   // Stop periodic position saving
//   const stopPositionSaving = () => {
//     if (positionSaveTimerRef.current) {
//       clearInterval(positionSaveTimerRef.current);
//       positionSaveTimerRef.current = null;
//     }
//   };

//   const handleWatchHistory = () => {
//     if (!apiCalledRef.current && user?.token) {
//       apiCalledRef.current = true;

//       // Save current position before sending watch history
//       if (artPlayerInstanceRef.current) {
//         saveVideoPosition(artPlayerInstanceRef.current.currentTime);
//       }

//       watchtPost({ post_id: post_id })
//         .unwrap()
//         .then(() => console.log("Watch history updated"))
//         .catch((error) =>
//           console.error("Failed to update watch history", error)
//         );
//     }
//   };

//   // useEffect(() => {
//   //   const loadAndDecryptPhoto = async () => {
//   //     if (!thumbnail) {
//   //       setDecryptedPhoto("");
//   //       return;
//   //     }

//   //     try {
//   //       const photoUrl = thumbnail;

//   //       // If it's not a .txt file, assume it's already a valid URL
//   //       if (!photoUrl.endsWith(".txt")) {
//   //         setDecryptedPhoto(photoUrl);
//   //         return;
//   //       }

//   //       const decryptedUrl = await decryptImage(photoUrl);
//   //       setDecryptedPhoto(decryptedUrl);
//   //     } catch (error) {
//   //       console.error("Error loading profile photo:", error);
//   //       setDecryptedPhoto("");
//   //     }
//   //   };

//   //   loadAndDecryptPhoto();
//   // }, [thumbnail]);

//   // Initialize player function
//   const initializePlayer = () => {
//     if (!playerContainerRef.current || artPlayerInstanceRef.current) return;

//     // Show progress bar immediately when initializing player
//     if (progressBarRef?.current) {
//       progressBarRef.current.style.opacity = "1";
//     }

//     Artplayer.DBCLICK_FULLSCREEN = false;
//     Artplayer.MOBILE_DBCLICK_PLAY = false;
//     Artplayer.MOBILE_CLICK_PLAY = true;

//     // Determine if the source is an m3u8 file
//     const isM3u8 = src.toLowerCase().endsWith(".m3u8");

//     // Configure Artplayer options
//     const options: Artplayer["Option"] = {
//       autoOrientation: true,
//       container: playerContainerRef.current,
//       url: src,
//       volume: 0.5,
//       muted: muteRef.current, // Mute initially unless user has interacted
//       autoplay: isActive, //
//       fullscreenWeb: true,
//       poster: thumbnail,
//       loop: true,
//       moreVideoAttr: {
//         playsInline: true,
//         preload: "auto" as const,
//       },
//       aspectRatio: true,
//       fullscreen: false,
//       theme: "#d53ff0",
//       icons: {
//         loading: `<div class="video-loading-indicator" style="display: none;"><img width="100" height="100" src=${vod_loader}></div>`,
//         state: `<div class="video-play-indicator" style="display: none;"><img src="${indicator}" width="50" height="50" alt="Play"></div>`,
//       },
//       // Set the type based on the file extension
//       type: isM3u8 ? "m3u8" : "mp4",
//       customType: {
//         mp4: function (video: HTMLVideoElement, url: string) {
//           // Configure video element
//           video.preload = "metadata";

//           // Create a new AbortController for the current request
//           const abortController = new AbortController();
//           abortControllerRef.current?.push(abortController); // Store the new controller
//           videoData?.current?.push(video);
//           // dispatch(setPrevious(video));
//           const loadVideo = async () => {
//             try {
//               const headers = new Headers();
//               headers.append("Range", "bytes=0-1048576");

//               const response = await fetch(url, {
//                 headers,
//                 method: "GET",
//                 signal: abortController?.signal, // Important part
//               });

//               if (response.status === 206) {
//                 // Server supports range requests, set video source
//                 video.src = url;

//                 // If this is active video, start loading more
//                 if (isActive) {
//                   video.preload = "auto";
//                 }
//               } else {
//                 // Server doesn't support range requests, fallback to normal loading
//                 video.src = url;
//                 video.preload = "metadata";
//               }
//             } catch (error) {
//               console.error("Error loading video:", error);
//               // Fallback to basic loading
//               video.src = url;
//               video.preload = "metadata";
//             }
//           };

//           // Start loading process
//           loadVideo().catch(console.error);

//           // Add event listeners for dynamic loading
//           video.addEventListener("canplaythrough", () => {
//             // Once we can play through current buffer, load more if active
//             if (isActive) {
//               video.preload = "auto";
//             }
//           });

//           video.addEventListener("waiting", () => {
//             // If video is waiting for data and is active, ensure we're loading
//             if (isActive) {
//               video.preload = "auto";
//             }
//           });

//           // Clean up function
//           return () => {
//             if (video) {
//               video.pause();
//               video.removeAttribute("src");
//               video.load();
//             }
//             // // Abort fetch request
//             // if (abortControllerRef.current) {
//             //   abortControllerRef.current.abort();
//             // }
//           };
//         },
//         // m3u8: function (videoElement: HTMLVideoElement, url: string) {
//         //   // Check if it's an iOS device first
//         //   const isIOS =
//         //     /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//         //   const isMacOS = /Mac/.test(navigator.userAgent);
//         //   const isAppleDevice = isIOS || isMacOS;

//         //   if (
//         //     isAppleDevice &&
//         //     videoElement.canPlayType("application/vnd.apple.mpegurl")
//         //   ) {
//         //     // Use native HLS playback for iOS devices immediately
//         //     // alert('Using native HLS playback for iOS');
//         //     videoElement.src = url;

//         //     if (playstart) {
//         //       videoElement.play().catch((error) => {
//         //         console.warn("Auto-play prevented on iOS:", error);
//         //       });
//         //     }

//         //     // videoElement.addEventListener('canplay', function() {
//         //     //   videoElement.play().catch(error => {
//         //     //     console.warn('Auto-play prevented on iOS:', error);
//         //     //   });
//         //     // });
//         //   } else if (Hls.isSupported()) {
//         //     // Use HLS.js for other browsers that support it
//         //     // alert('Using HLS.js for HLS playback');
//         //     const hls = new Hls({
//         //       maxBufferLength: 30,
//         //       maxMaxBufferLength: 60,
//         //       enableWorker: true,
//         //       lowLatencyMode: true,
//         //       startLevel: -1, // Auto level selection
//         //     });

//         //     // Add error handling
//         //     hls.on(Hls.Events.ERROR, function (event, data) {
//         //       if (data.fatal) {
//         //         console.error("HLS fatal error:", data.type, data.details);
//         //         switch (data.type) {
//         //           case Hls.ErrorTypes.NETWORK_ERROR:
//         //             // Try to recover network error
//         //             console.log(
//         //               "Fatal network error encountered, trying to recover"
//         //             );
//         //             hls.startLoad();
//         //             break;
//         //           case Hls.ErrorTypes.MEDIA_ERROR:
//         //             console.log(
//         //               "Fatal media error encountered, trying to recover"
//         //             );
//         //             hls.recoverMediaError();
//         //             break;
//         //           default:
//         //             // Cannot recover
//         //             hls.destroy();
//         //             break;
//         //         }
//         //       } else {
//         //         console.warn("Non-fatal HLS error:", data.type, data.details);
//         //       }
//         //     });

//         //     // Add manifest loaded event
//         //     hls.on(Hls.Events.MANIFEST_PARSED, function () {
//         //       console.log("HLS manifest loaded successfully");
//         //       // Attempt to play after manifest is loaded
//         //       if (isActive && playstart) {
//         //         videoElement.play().catch((error) => {
//         //           console.warn("Auto-play prevented:", error);
//         //         });
//         //       }
//         //     });

//         //     hls.loadSource(url);
//         //     hls.attachMedia(videoElement);
//         //     hlsRef.current = hls;
//         //   } else {
//         //     // Fallback for other browsers with native HLS support
//         //     console.log("Falling back to native HLS playback");
//         //     videoElement.src = url;
//         //     videoElement.addEventListener("canplay", function () {
//         //       if (isActive && playstart) {
//         //         videoElement.play().catch((error) => {
//         //           console.warn("Auto-play prevented:", error);
//         //         });
//         //       }
//         //     });
//         //   }
//         // },
//         // Update the m3u8 customType in your Artplayer options
//         m3u8: function (videoElement: HTMLVideoElement, url: string) {
//           // Check if it's an iOS device first
//           // const isIOS =
//           //   /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//           // const isMacOS = /Mac/.test(navigator.userAgent);
//           // const isAppleDevice = isIOS || isMacOS;

//           // console.log(isAppleDevice);

//           // if (
//           //   isAppleDevice &&
//           //   videoElement.canPlayType("application/vnd.apple.mpegurl")
//           // ) {
//           //   console.log("winnn");
//           //   // Native HLS for Apple devices with preload optimization
//           //   videoElement.preload = "auto";
//           //   videoElement.src = url;

//           //   // Pre-warm the video element for iOS
//           //   if (isIOS) {
//           //     videoElement.load();
//           //     videoElement.play().catch(() => {});
//           //     videoElement.pause();
//           //   }

//           //   if (playstart) {
//           //     videoElement.play().catch((error) => {
//           //       console.warn("Auto-play prevented on iOS:", error);
//           //     });
//           //   }
//           if (Hls.isSupported()) {
//             // Optimized HLS.js configuration
//             const hls = new Hls({
//               enableWorker: true,
//               lowLatencyMode: true,
//               backBufferLength: 30, // Reduced from default 60 to save memory
//               maxBufferLength: 30,
//               maxMaxBufferLength: 60,
//               maxBufferSize: 50 * 1000 * 1000, // 50MB
//               maxBufferHole: 0.5, // Reduced from default 1 to minimize gaps
//               maxFragLookUpTolerance: 0.25,
//               startLevel: -1, // Auto quality
//               abrEwmaDefaultEstimate: 500000, // Initial bandwidth estimate
//               abrBandWidthFactor: 0.95,
//               abrBandWidthUpFactor: 0.7,
//               abrMaxWithRealBitrate: true,
//               startFragPrefetch: false, // Prefetch fragments
//               fpsDroppedMonitoringThreshold: 0.2,
//               fpsDroppedMonitoringPeriod: 1000,
//               capLevelToPlayerSize: true, // Match quality to player size
//               initialLiveManifestSize: 1,
//               stretchShortVideoTrack: true,
//               forceKeyFrameOnDiscontinuity: true,
//               // Manifest loading optimizations
//               manifestLoadingTimeOut: 10000,
//               manifestLoadingMaxRetry: 3,
//               manifestLoadingRetryDelay: 500,
//               manifestLoadingMaxRetryTimeout: 5000,
//               levelLoadingTimeOut: 10000,
//               levelLoadingMaxRetry: 3,
//               levelLoadingRetryDelay: 500,
//               levelLoadingMaxRetryTimeout: 5000,
//               fragLoadingTimeOut: 20000, // Increased timeout for mobile
//               fragLoadingMaxRetry: 6,
//               fragLoadingRetryDelay: 500,
//               fragLoadingMaxRetryTimeout: 5000,
//             });

//             // Improved error handling
//             hls.on(Hls.Events.ERROR, function (event, data) {
//               console.log("HLS error:", data.type, data.details);

//               if (data.fatal) {
//                 switch (data.type) {
//                   case Hls.ErrorTypes.NETWORK_ERROR:
//                     console.log("Network error, trying to recover");
//                     if (
//                       data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
//                       data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
//                       data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR
//                     ) {
//                       // Try to reload the manifest
//                       hls.startLoad();
//                     } else if (
//                       data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR ||
//                       data.details === Hls.ErrorDetails.FRAG_LOAD_TIMEOUT ||
//                       data.details === Hls.ErrorDetails.KEY_LOAD_ERROR ||
//                       data.details === Hls.ErrorDetails.KEY_LOAD_TIMEOUT
//                     ) {
//                       // Try to recover fragment loading
//                       hls.startLoad();
//                     }
//                     break;
//                   case Hls.ErrorTypes.MEDIA_ERROR:
//                     console.log("Media error, trying to recover");
//                     hls.recoverMediaError();
//                     break;
//                   default:
//                     console.log("Unrecoverable error, destroying HLS");
//                     hls.destroy();
//                     break;
//                 }
//               }
//             });

//             // Pre-warm the player before playback starts
//             hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
//               // Start loading but don't play yet
//               hls.startLoad(-1);

//               // For mobile, preload more aggressively
//               if (
//                 /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//                   navigator.userAgent
//                 )
//               ) {
//                 // Load first 3 fragments immediately
//                 const levels = hls.levels;
//                 if (levels && levels.length > 0) {
//                   const startLevel = hls.currentLevel;
//                   const frags = hls.levels[startLevel].details?.fragments;
//                   if (frags && frags.length > 3) {
//                     hls.nextLoadLevel = startLevel;
//                     for (let i = 0; i < 3; i++) {
//                       hls.loadFragment(frags[i], startLevel, null);
//                     }
//                   }
//                 }
//               }
//             });

//             // When enough data is buffered, start playback
//             hls.on(Hls.Events.FRAG_BUFFERED, function () {
//               if (!isActive) return;

//               const buffered = videoElement.buffered;
//               if (buffered && buffered.length > 0) {
//                 const bufferedEnd = buffered.end(buffered.length - 1);
//                 const currentTime = videoElement.currentTime || 0;

//                 // If we have at least 2 seconds buffered ahead, start playback
//                 if (bufferedEnd - currentTime > 2) {
//                   if (playstart && videoElement.paused) {
//                     videoElement
//                       .play()
//                       .catch((e) => console.log("Playback error:", e));
//                   }
//                 }
//               }
//             });

//             hls.loadSource(url);
//             hls.attachMedia(videoElement);
//             hlsRef.current = hls;

//             // Start loading immediately
//             hls.startLoad(-1);
//           } else {
//             // Fallback with more aggressive preloading
//             videoElement.src = url;
//             videoElement.preload = "auto";

//             // For mobile fallback, try to force loading
//             if (
//               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//                 navigator.userAgent
//               )
//             ) {
//               videoElement.load();
//             }

//             videoElement.addEventListener("canplay", function () {
//               if (isActive && playstart) {
//                 videoElement.play().catch((error) => {
//                   console.warn("Auto-play prevented:", error);
//                 });
//               }
//             });
//           }
//         },
//       },
//       layers: [
//         {
//           html: `
//             <div class="custom-progress-container">
//               <input type="range" min="0" max="100" step="0.1" class="custom-progress-bar chrome-fix" />
//                 <div class="custom-time-display" style="display: none; justify-content: center; position: absolute; width: 100%; left: 0; text-align: center;"></div>
//             </div>
//           `,
//           style: {
//             position: "absolute",
//             bottom: "0px",
//             left: "5%",
//             width: "90%",
//             height: "25px",
//             zIndex: "9999",
//             pointerEvents: "auto", // Ensure it can receive pointer events
//             display: "block", // Always display the container
//             visibility: "visible", // Ensure visibility
//           },
//           mounted: (element: HTMLElement) => {
//             progressBarRef.current = element.querySelector(
//               ".custom-progress-bar"
//             ) as HTMLInputElement;
//             timeDisplayRef.current = element.querySelector(
//               ".custom-time-display"
//             ) as HTMLDivElement;

//             if (!progressBarRef.current) {
//               console.error("Custom progress bar or tooltip element not found");
//               return;
//             }

//             // Initial setup for the progress bar
//             progressBarRef.current.value = "0";

//             // Force visibility for Chrome
//             progressBarRef.current.style.opacity = "1";
//             progressBarRef.current.style.display = "block";
//             progressBarRef.current.style.visibility = "visible";

//             // Add specific Chrome styles
//             const isChrome =
//               /Chrome/.test(navigator.userAgent) &&
//               /Google Inc/.test(navigator.vendor);
//             if (isChrome) {
//               progressBarRef.current.style.webkitAppearance = "none";
//               progressBarRef.current.style.appearance = "none";
//               progressBarRef.current.style.background =
//                 "rgba(255, 255, 255, 0.2)";
//               progressBarRef.current.style.height = "4px";
//               progressBarRef.current.style.borderRadius = "2px";
//               progressBarRef.current.style.outline = "none";
//               progressBarRef.current.style.transition = "opacity 0.2s";
//               progressBarRef.current.style.cursor = "pointer";
//             }

//             // Desktop events
//             progressBarRef.current.addEventListener("input", (e) => {
//               setShowRotate(true);
//               if (!artPlayerInstanceRef.current) return;
//               if (!isDraggingRef.current) {
//                 dispatch(sethideBar(true));
//                 if (progressBarRef?.current?.style) {
//                   progressBarRef.current.style.height = "10px";
//                   progressBarRef.current.style.setProperty(
//                     "--thumb-width",
//                     "16px"
//                   );
//                   progressBarRef.current.style.setProperty(
//                     "--thumb-height",
//                     "20px"
//                   );
//                   progressBarRef.current.style.setProperty(
//                     "--thumb-radius",
//                     "5px"
//                   );
//                 }
//                 isDraggingRef.current = true;
//                 timeDisplayRef.current!.style.display = "block";
//               }

//               const value = parseFloat((e.target as HTMLInputElement).value);
//               seekTimeRef.current =
//                 (value / 100) * artPlayerInstanceRef.current.duration;
//               progressBarRef.current?.style.setProperty(
//                 "--progress",
//                 `${value}%`
//               );

//               // Update thumbnail preview
//               if (e instanceof MouseEvent) {
//                 updateThumbnailPreview(seekTimeRef.current, e.clientX);
//               }

//               if (timeDisplayRef.current) {
//                 const currentTime = formatTime(seekTimeRef.current);
//                 const duration = formatTime(
//                   artPlayerInstanceRef.current.duration
//                 );

//                 // if (video?.sprite_url) {
//                 //   if (metadata?.isPortrait) {
//                 //     timeDisplayRef.current.style.bottom = `220px`;
//                 //   } else {
//                 //     timeDisplayRef.current.style.bottom = `150px`;
//                 //   }
//                 // } else {
//                 //   timeDisplayRef.current.style.bottom = `100px`;
//                 // }
//                 if (metadata?.isPortrait) {
//                   timeDisplayRef.current.style.bottom = `270px`;
//                 } else {
//                   timeDisplayRef.current.style.bottom = `200px`;
//                 }
//                 timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
//                   background: rgba(0, 0, 0, 0.5);
//                   padding: 16px 20px;
//                   width: 280px;
//                   display: inline-block;
//                   text-align: center;"><span style="color: #d53ff0;
//                 "  >${currentTime}</span> / ${duration} </span>`;
//               }
//             });

//             progressBarRef.current.addEventListener("change", () => {
//               if (!artPlayerInstanceRef.current?.playing) {
//                 artPlayerInstanceRef.current?.play();
//               }
//               setShowRotate(false);
//               if (!artPlayerInstanceRef.current || !isDraggingRef.current)
//                 return;
//               isDraggingRef.current = false;
//               setThumbnailPreview((prev) => ({ ...prev, visible: false }));
//               dispatch(sethideBar(false));
//               if (progressBarRef.current) {
//                 progressBarRef.current.style.height = "4px";
//                 progressBarRef.current.style.setProperty(
//                   "--thumb-width",
//                   "6px"
//                 );
//                 progressBarRef.current.style.setProperty(
//                   "--thumb-height",
//                   "16px"
//                 );
//                 progressBarRef.current.style.setProperty(
//                   "--thumb-radius",
//                   "5px"
//                 );
//               }
//               timeDisplayRef.current!.style.display = "none";
//               artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
//             });

//             // Mobile touch events
//             element.addEventListener("touchstart", (e) => {
//               if (!artPlayerInstanceRef.current?.playing) {
//                 artPlayerInstanceRef.current?.play();
//                 artPlayerInstanceRef.current?.pause();
//               }
//               setShowRotate(true);
//               if (!artPlayerInstanceRef.current || !progressBarRef.current)
//                 return;
//               const touch = e.touches[0];

//               const rect = element.getBoundingClientRect();
//               const touchX = touch.clientX - rect.left;
//               const percent = Math.min(
//                 Math.max((touchX / rect.width) * 100, 0),
//                 100
//               );

//               progressBarRef.current.value = percent.toString();
//               progressBarRef.current.style.setProperty(
//                 "--progress",
//                 `${percent}%`
//               );
//               isDraggingRef.current = true;
//               dispatch(sethideBar(true));
//               progressBarRef.current.style.height = "10px";
//               progressBarRef.current.style.setProperty("--thumb-width", "16px");
//               progressBarRef.current.style.setProperty(
//                 "--thumb-height",
//                 "20px"
//               );
//               progressBarRef.current.style.setProperty("--thumb-radius", "5px");
//               timeDisplayRef.current!.style.display = "block";

//               const newTime =
//                 (percent / 100) * artPlayerInstanceRef.current.duration;
//               seekTimeRef.current = newTime;
//               updateThumbnailPreview(newTime, touch.clientX);
//               if (timeDisplayRef.current) {
//                 const currentTime = formatTime(newTime);
//                 const duration = formatTime(
//                   artPlayerInstanceRef.current.duration
//                 );

//                 // if (video?.sprite_url) {
//                 //   if (metadata?.isPortrait) {
//                 //     timeDisplayRef.current.style.bottom = `220px`;
//                 //   } else {
//                 //     timeDisplayRef.current.style.bottom = `150px`;
//                 //   }
//                 // } else {
//                 //   timeDisplayRef.current.style.bottom = `100px`;
//                 // }
//                 if (metadata?.isPortrait) {
//                   timeDisplayRef.current.style.bottom = `270px`;
//                 } else {
//                   timeDisplayRef.current.style.bottom = `200px`;
//                 }
//                 timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
//                 background: rgba(0, 0, 0, 0.5);
//                 padding: 16px 20px;
//                 width: 280px;
//                 display: inline-block;
//                 text-align: center;"><span style="color: #d53ff0;
//               "  >${currentTime}</span> / ${duration} </span>`;
//               }
//             });

//             element.addEventListener("touchmove", (e) => {
//               setShowRotate(true);
//               if (
//                 !artPlayerInstanceRef.current ||
//                 !progressBarRef.current ||
//                 !isDraggingRef.current
//               )
//                 return;
//               e.preventDefault();
//               const touch = e.touches[0];
//               updateThumbnailPreview(seekTimeRef.current, touch.clientX);
//               const rect = element.getBoundingClientRect();
//               const touchX = touch.clientX - rect.left;
//               const percent = Math.min(
//                 Math.max((touchX / rect.width) * 100, 0),
//                 100
//               );

//               // Make sure hideBar stays true during the entire touch drag operation
//               dispatch(sethideBar(true));

//               progressBarRef.current.value = percent.toString();
//               progressBarRef.current.style.setProperty(
//                 "--progress",
//                 `${percent}%`
//               );
//               seekTimeRef.current =
//                 (percent / 100) * artPlayerInstanceRef.current.duration;

//               if (timeDisplayRef.current) {
//                 const currentTime = formatTime(seekTimeRef.current);
//                 const duration = formatTime(
//                   artPlayerInstanceRef.current.duration
//                 );

//                 // if (video?.sprite_url) {
//                 //   if (metadata?.isPortrait) {
//                 //     timeDisplayRef.current.style.bottom = `220px`;
//                 //   } else {
//                 //     timeDisplayRef.current.style.bottom = `150px`;
//                 //   }
//                 // } else {
//                 //   timeDisplayRef.current.style.bottom = `100px`;
//                 // }
//                 if (metadata?.isPortrait) {
//                   timeDisplayRef.current.style.bottom = `270px`;
//                 } else {
//                   timeDisplayRef.current.style.bottom = `200px`;
//                 }

//                 // timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
//                 timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
//                 background: rgba(0, 0, 0, 0.5);
//                 padding: 16px 20px;
//                 width: 280px;
//                 display: inline-block;
//                 text-align: center;"><span style="color: #d53ff0;
//               "  >${currentTime}</span> / ${duration} </span>`;
//               }
//             });

//             element.addEventListener("touchend", () => {
//               if (!artPlayerInstanceRef.current?.playing) {
//                 artPlayerInstanceRef.current?.play();
//               }

//               setShowRotate(false);
//               if (
//                 !artPlayerInstanceRef.current ||
//                 !progressBarRef.current ||
//                 !isDraggingRef.current
//               )
//                 return;
//               isDraggingRef.current = false;
//               dispatch(sethideBar(false));
//               setThumbnailPreview((prev) => ({ ...prev, visible: false }));
//               progressBarRef.current.style.height = "4px";
//               progressBarRef.current.style.setProperty("--thumb-width", "6px");
//               progressBarRef.current.style.setProperty(
//                 "--thumb-height",
//                 "16px"
//               );
//               progressBarRef.current.style.setProperty("--thumb-radius", "5px");
//               timeDisplayRef.current!.style.display = "none";
//               artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
//             });
//           },
//         },
//         {
//           html: `
// <div class="thumbnail-preview" style="
//     position: absolute;
//     width: ${metadata.isPortrait ? "90px" : "160px"};
//     height: ${metadata.isPortrait ? "160px" : "90px"};
//     background-repeat: no-repeat;
//     background-size: cover;
//     pointer-events: none;
//     z-index: 10000;
//     box-sizing: content-box;
//     padding: 0;
//     border-radius: 4px;
//     /* Create space for the outside border */
//     margin: 1.5px;
// ">
//     <!-- Background image container -->
//     <div style="
//         width: 100%;
//         height: 100%;
//         border-radius: inherit;
//         background-repeat: no-repeat;
//         background-size: cover;
//         background-origin: border-box;
//     " class="bg-th"></div>

//     <!-- Gradient border positioned outside -->
//     <div style="
//         position: absolute;
//         top: -1.5px;
//         left: -1.5px;
//         right: -1.5px;
//         bottom: -1.5px;
//         background: linear-gradient(to bottom,
//             #da72ff 0%,
//             #da72ff 30%,
//             transparent 100%);
//         border-radius: 4px;
//         z-index: -1;
//         pointer-events: none;
//         padding: 1.5px;
//         box-sizing: border-box;
//     ">
//         <!-- Inner mask to create the border effect -->
//         <div style="
//             width: 100%;
//             height: 100%;
//             background: #000;
//             border-radius: inherit;
//         "></div>
//     </div>
// </div>

//           `,
//           style: {
//             position: "absolute",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             pointerEvents: "none",
//             zIndex: "9999",
//           },

//           mounted: (element: HTMLElement) => {
//             const previewElement = element.querySelector(
//               ".thumbnail-preview"
//             ) as HTMLDivElement;

//             // Create a function to update the preview
//             const updatePreview = () => {
//               // if (!previewElement || !spriteImageUrlRef.current) return;

//               if (thumbnailPreview.visible) {
//                 const pos = getSpritePosition(thumbnailPreview.time);
//                 if (pos) {
//                   previewElement.style.display = "block";
//                   // Calculate maximum left position to keep thumbnail within viewport
//                   const thumbnailWidth = metadata.isPortrait ? 90 : 160;
//                   const viewportWidth = window.innerWidth;
//                   const maxLeft = viewportWidth - thumbnailWidth - 20; // buffer from right edge

//                   // Constrain the position
//                   let leftPosition = thumbnailPreview.position.x + 20;
//                   leftPosition = Math.max(10, Math.min(leftPosition, maxLeft)); // 10px minimum from left edge
//                   const innerDiv = previewElement.querySelector(".bg-th");

//                   previewElement.style.left = `${leftPosition}px`;
//                   previewElement.style.bottom = "100px";

//                   if (isSpriteLoading && video?.sprite_url) {
//                     const innerDiv = previewElement.querySelector(".bg-th");
//                     if (innerDiv) {
//                       innerDiv.style.backgroundImage = `url(${sprite_loading})`;
//                     }
//                   } else {
//                     const innerDiv = previewElement.querySelector(".bg-th");
//                     if (innerDiv) {
//                       innerDiv.style.backgroundImage = `url(${spriteImageUrlRef.current})`;
//                     }
//                   }
//                   // Calculate the correct scale factor to fit the sprite in our thumbnail
//                   const scaleX = metadata.isPortrait
//                     ? 90 / metadata.tileWidth
//                     : 160 / metadata.tileWidth;
//                   const scaleY = metadata.isPortrait
//                     ? 160 / metadata.tileHeight
//                     : 90 / metadata.tileHeight;

//                   // Use the same scaling for X and Y to maintain aspect ratio
//                   const scale = Math.min(scaleX, scaleY);

//                   // Calculate scaled position based on the size ratio
//                   const scaledX = pos.x * scale;
//                   const scaledY = pos.y * scale;

//                   if (innerDiv) {
//                     innerDiv.style.backgroundPosition = `-${scaledX}px -${scaledY}px`;
//                   }

//                   // Set the background size and position with appropriate scaling

//                   // Calculate the full sprite size
//                   const fullWidth = metadata.tileCols * metadata.tileWidth;
//                   const fullHeight = metadata.tileRows * metadata.tileHeight;

//                   // Scale the full sprite to match our thumbnail dimensions while maintaining aspect ratio
//                   const scaledWidth = fullWidth * scale;
//                   const scaledHeight = fullHeight * scale;

//                   if (innerDiv) {
//                     innerDiv.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
//                   }
//                 }
//               } else {
//                 previewElement.style.display = "none";
//               }
//             };

//             // Initial update
//             updatePreview();

//             // Store the preview element reference
//             const previewRef = { current: previewElement };

//             // Return a cleanup function
//             return () => {
//               // previewRef?.current = null;
//             };
//           },
//         },

//         {
//           html: `<div class="custom-play-icon">
//                     <img src="${indicator}" width="50" height="50" alt="Play">
//                  </div>`,
//           style: {
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "999",
//             display: "none",
//           },
//           mounted: (element: HTMLElement) => {
//             playIconRef.current = element as HTMLDivElement;

//             playIconRef?.current?.addEventListener("click", () => {
//               if (artPlayerInstanceRef.current) {
//                 // Show loading indicator during play attempt
//                 const loadingIndicator =
//                   artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//                     ".video-loading-indicator"
//                   ) as HTMLDivElement;
//                 if (loadingIndicator) loadingIndicator.style.display = "block";

//                 // Hide play button during play attempt
//                 // hidePlayButton();

//                 // Don't fade out poster immediately - wait until play succeeds
//                 artPlayerInstanceRef.current
//                   .play()
//                   .then(() => {
//                     // Play succeeded - hide loading indicator and play button
//                     if (loadingIndicator)
//                       loadingIndicator.style.display = "none";
//                     hidePlayButton();

//                     // Only fade out poster when we have actual frames
//                     if (
//                       artPlayerInstanceRef.current?.video &&
//                       artPlayerInstanceRef.current.video.readyState >= 3
//                     ) {
//                       setTimeout(() => safeFadePosterOut(true), 100);
//                     } else if (artPlayerInstanceRef.current?.video) {
//                       // If video isn't ready yet, wait for it
//                       const checkReadyState = () => {
//                         if (
//                           artPlayerInstanceRef.current?.video &&
//                           artPlayerInstanceRef.current.video.readyState >= 3
//                         ) {
//                           safeFadePosterOut(true);
//                           artPlayerInstanceRef.current.video.removeEventListener(
//                             "canplay",
//                             checkReadyState
//                           );
//                         }
//                       };
//                       if (artPlayerInstanceRef.current) {
//                         artPlayerInstanceRef.current.video.addEventListener(
//                           "canplay",
//                           checkReadyState
//                         );
//                       }
//                     }
//                   })
//                   .catch((error) => {
//                     console.error("Manual play failed:", error);

//                     // Play failed - hide loading indicator and show play button again
//                     if (loadingIndicator)
//                       loadingIndicator.style.display = "none";
//                     if (playIconRef.current) {
//                       playIconRef.current.style.display = "block";
//                     }

//                     // Keep poster visible on error
//                     showPoster();
//                   });
//               }
//             });
//           },
//         },
//         {
//           html: `
//             <div class="click-layer">
//               <div class="fast-forward-indicator" style="display: none; opacity: 0;">
//                 <span>快进播放 x2</span>
//                 <img src="${forward}" alt="forward" style="width: 16px; height: 16px;" />
//               </div>
//             </div>
//           `,
//           style: {
//             position: "absolute",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "95%",
//             zIndex: "10",
//             background: "transparent",
//             userSelect: "none",
//             webkitUserSelect: "none",
//             webkitTouchCallout: "none",
//             touchAction: "pan-y",
//           },
//           mounted: (element: HTMLElement) => {
//             let lastClick = 0;
//             let singleClickTimeout: NodeJS.Timeout | null = null;
//             let isLongPress = false;
//             const ffIndicator = element.querySelector(
//               ".fast-forward-indicator"
//             ) as HTMLElement;
//             const ffIcon = element.querySelector(".ff-icon") as HTMLElement;

//             if (ffIndicator) {
//               // Set initial styles
//               Object.assign(ffIndicator.style, {
//                 position: "absolute",
//                 bottom: "0%", // Changed from bottom: '0%' to center vertically
//                 left: "50%",
//                 transform: "translate(-50%, -50%)", // Center both horizontally and vertically
//                 backgroundColor: "#282630",
//                 color: "white",
//                 padding: "8px 16px", // Slightly increased padding
//                 borderRadius: "20px", // Increased border radius
//                 fontSize: "14px",
//                 fontWeight: "500", // Slightly bolder
//                 display: "none",
//                 opacity: "0",
//                 alignItems: "center",
//                 gap: "8px", // Increased gap between text and icon
//                 minWidth: "120px",
//                 justifyContent: "center",
//                 letterSpacing: "0.5px",
//                 transition: "opacity 0.3s ease-in-out",
//                 zIndex: "9999", // Ensure it's above other UI elements
//               });
//             }

//             if (ffIcon) {
//               Object.assign(ffIcon.style, {
//                 fontSize: "16px",
//                 lineHeight: "1",
//                 marginRight: "2px",
//               });
//             }

//             const handleLongPressStart = (e: TouchEvent | MouseEvent) => {
//               setShowRotate(true);
//               if ("touches" in e) {
//                 const touch = e.touches[0];
//                 touchStartPosRef.current = {
//                   x: touch.clientX,
//                   y: touch.clientY,
//                 };
//               }

//               // Clear any existing timers
//               if (longPressTimerRef.current) {
//                 clearTimeout(longPressTimerRef.current);
//               }

//               longPressTimerRef.current = setTimeout(() => {
//                 if (touchStartPosRef.current) {
//                   isLongPress = true;
//                   isLongPressActiveRef.current = true; // Set the ref to true when long press becomes active
//                   startFastForward();
//                   if (ffIndicator) {
//                     ffIndicator.style.display = "flex";
//                     // Add animation
//                     ffIndicator.style.transition = "opacity 0.2s ease-in-out";
//                     ffIndicator.style.opacity = "1";
//                   }
//                 }
//               }, LONG_PRESS_DELAY);
//             };

//             const handleLongPressEnd = () => {
//               setShowRotate(false);
//               if (longPressTimerRef.current) {
//                 clearTimeout(longPressTimerRef.current);
//                 longPressTimerRef.current = null;
//               }
//               if (isLongPress) {
//                 stopFastForward();
//                 if (ffIndicator) {
//                   // Fade out animation
//                   ffIndicator.style.opacity = "0";
//                   setTimeout(() => {
//                     ffIndicator.style.display = "none";
//                   }, 200);
//                 }
//               }
//               isLongPress = false;
//               isLongPressActiveRef.current = false; // Reset the ref when long press ends
//               touchStartPosRef.current = null;
//             };

//             const handleTouchMove = (e: TouchEvent) => {
//               if (!touchStartPosRef.current) return;

//               const touch = e.touches[0];
//               const deltaX = Math.abs(
//                 touch.clientX - touchStartPosRef.current.x
//               );
//               const deltaY = Math.abs(
//                 touch.clientY - touchStartPosRef.current.y
//               );

//               // If user is swiping significantly (especially vertically), cancel long press
//               // But only if long press hasn't already activated
//               if (
//                 (deltaX > SWIPE_THRESHOLD || deltaY > SWIPE_THRESHOLD) &&
//                 !isLongPressActiveRef.current
//               ) {
//                 handleLongPressEnd();
//                 return;
//               }

//               // If long press is already active, be more tolerant of movement
//               if (isLongPressActiveRef.current) {
//                 // Allow more movement once fast forward is active
//                 if (
//                   deltaX > SWIPE_THRESHOLD * 3 ||
//                   deltaY > SWIPE_THRESHOLD * 3
//                 ) {
//                   handleLongPressEnd();
//                   return;
//                 }
//                 e.preventDefault(); // Prevent scrolling when in fast forward mode
//               }
//             };

//             // Touch events
//             element.addEventListener("touchstart", (e) => {
//               const now = Date.now();

//               // Handle double tap
//               if (now - lastClick <= 300) {
//                 if (singleClickTimeout) clearTimeout(singleClickTimeout);
//                 if (user?.token) {
//                   handleLike();
//                 } else {
//                   dispatch(
//                     showToast({
//                       message: "登陆后可点赞",
//                       type: "success",
//                     })
//                   );
//                 }
//               } else {
//                 // Handle single tap
//                 singleClickTimeout = setTimeout(() => {
//                   if (!isLongPress && artPlayerInstanceRef.current) {
//                     if (artPlayerInstanceRef.current.playing) {
//                       artPlayerInstanceRef.current.pause();
//                       showPlayButton();
//                     } else {
//                       hidePlayButton();
//                       safeFadePosterOut(true);
//                       setTimeout(() => {
//                         artPlayerInstanceRef.current?.play();
//                       }, 500);
//                     }
//                   }
//                 }, 300);
//               }
//               lastClick = now;

//               handleLongPressStart(e);
//             });

//             element.addEventListener("touchmove", handleTouchMove);
//             element.addEventListener("touchend", handleLongPressEnd);
//             element.addEventListener("touchcancel", handleLongPressEnd);

//             // Prevent context menu
//             element.addEventListener("contextmenu", (e) => e.preventDefault());
//           },
//         },
//       ],
//     };

//     // If player already exists, destroy it first
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.destroy();
//       artPlayerInstanceRef.current = null;
//     }

//     // Create new player instance
//     artPlayerInstanceRef.current = new Artplayer(options);

//     // Add CSS transitions to the poster element for smooth fade effect
//     if (artPlayerInstanceRef.current?.template?.$poster) {
//       const posterElement = artPlayerInstanceRef.current.template.$poster;

//       // Apply strong CSS transitions with longer duration
//       posterElement.style.cssText += `
//         transition: opacity 1s ease-out !important;
//         -webkit-transition: opacity 1s ease-out !important;
//         opacity: 1 !important;
//         visibility: visible !important;
//         display: block !important;
//       `;

//       // Add a custom class for easier targeting

//       // Add transitionend listener to properly handle the end of transition
//       posterElement.addEventListener("transitionend", (e) => {
//         if (
//           e.propertyName === "opacity" &&
//           getComputedStyle(posterElement).opacity === "0"
//         ) {
//           posterElement.style.display = "none";
//         }
//       });

//       // Force a reflow to ensure styles are applied
//       void posterElement.offsetWidth;
//     }

//     // Add ready event listener after creating the player
//     artPlayerInstanceRef.current.on("ready", () => {
//       // Check if there's a saved position for this video
//       const savedPosition = getSavedPosition();
//       if (savedPosition && artPlayerInstanceRef.current) {
//         // Set the player to the saved position
//         artPlayerInstanceRef.current.currentTime = savedPosition;
//       }

//       // Start periodic position saving
//       startPositionSaving();
//     });

//     // Update progress bar while playing
//     artPlayerInstanceRef.current.on("video:timeupdate", () => {
//       if (
//         progressBarRef.current &&
//         artPlayerInstanceRef.current &&
//         !isDraggingRef.current
//       ) {
//         const currentTime = artPlayerInstanceRef.current.currentTime || 0;
//         const duration = artPlayerInstanceRef.current.duration || 1;
//         const newProgress = (currentTime / duration) * 100;
//         progressBarRef.current.value = newProgress.toString();
//         progressBarRef.current.style.setProperty(
//           "--progress",
//           `${newProgress}%`
//         );

//         // Ensure progress bar is always visible in Chrome
//         if (progressBarRef.current.style.opacity !== "1") {
//           progressBarRef.current.style.opacity = "1";
//         }

//         // Fade out poster only if video has actually progressed beyond initial frame
//         // and is definitely playing (at least 0.5 seconds in)
//         if (currentTime > 0.5 && artPlayerInstanceRef.current.playing) {
//           safeFadePosterOut();
//         }
//       }
//     });

//     // Add event listeners for video state
//     artPlayerInstanceRef.current.on("ready", () => {
//       // if (width > height) {
//       //   setPImg(true);
//       // } else {
//       //   setPImg(false);
//       // }
//       // Don't show any indicators in the ready event
//       // The video:loadstart or video:canplay events will handle showing the appropriate indicator
//     });

//     // Add loading state handler with progress bar visibility check
//     artPlayerInstanceRef.current.on("video:waiting", () => {
//       // Ensure progress bar is visible during loading
//       if (progressBarRef?.current) {
//         progressBarRef.current.style.opacity = "1";
//       }

//       // Show loading indicator and hide play button during normal loading
//       const loadingIndicator =
//         artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//           ".video-loading-indicator"
//         ) as HTMLDivElement;

//       if (loadingIndicator) loadingIndicator.style.display = "block";

//       // During initial loading, keep the poster visible and don't show play button
//       if (
//         artPlayerInstanceRef.current &&
//         artPlayerInstanceRef.current.currentTime < 0.5
//       ) {
//         // Ensure poster is visible during initial loading
//         if (thumbnail && artPlayerInstanceRef.current.template.$poster) {
//           artPlayerInstanceRef.current.poster = thumbnail;
//           showPoster();
//         }

//         // Hide play button during initial loading when we expect autoplay
//         if (isActive && playstart) {
//           hidePlayButton();
//         }
//       }
//     });

//     // Add error handler to ensure progress bar remains visible
//     artPlayerInstanceRef.current.on("error", (error) => {
//       console.error("Video loading error:", error);
//       // Ensure progress bar remains visible even on error
//       if (progressBarRef?.current) {
//         progressBarRef.current.style.opacity = "1";
//       }

//       // On error, we show both poster and play button
//       showPoster();
//       showPlayButton();

//       const loadingIndicator =
//         artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//           ".video-loading-indicator"
//         ) as HTMLDivElement;

//       if (loadingIndicator) loadingIndicator.style.display = "none";
//     });

//     // Main play attempt handler
//     artPlayerInstanceRef.current.on("play", () => {
//       // Don't immediately fade out the poster - wait for actual frames
//       if (!isFastForwarding) {
//         // Only hide the play button, but keep poster until video is actually playing
//         hidePlayButton();
//       }
//     });

//     // Video has started playing - now we can safely fade the poster
//     artPlayerInstanceRef.current.on("video:playing", () => {
//       // Hide play button first
//       if (!isFastForwarding) {
//         hidePlayButton();
//       }

//       // Only fade out the poster if we have enough data to show frames
//       if (
//         artPlayerInstanceRef.current?.video &&
//         artPlayerInstanceRef.current.video.readyState >= 3
//       ) {
//         // Wait a short time to ensure frames are visible before fading out poster
//         setTimeout(() => safeFadePosterOut(true), 100);
//       } else if (artPlayerInstanceRef.current?.video) {
//         // If not enough data yet, set up a readyState check
//         const checkReadyState = () => {
//           if (
//             artPlayerInstanceRef.current?.video &&
//             artPlayerInstanceRef.current.video.readyState >= 3
//           ) {
//             safeFadePosterOut(true);
//             artPlayerInstanceRef.current.video.removeEventListener(
//               "canplay",
//               checkReadyState
//             );
//           }
//         };
//         artPlayerInstanceRef.current.video.addEventListener(
//           "canplay",
//           checkReadyState
//         );
//       }
//     });

//     // Handle pause events
//     artPlayerInstanceRef.current.on("pause", () => {
//       // Only show play button if not fast forwarding and not during initial loading
//       if (
//         !isFastForwarding &&
//         !(
//           isActive &&
//           playstart &&
//           artPlayerInstanceRef.current &&
//           typeof artPlayerInstanceRef.current.currentTime === "number" &&
//           artPlayerInstanceRef.current.currentTime < 0.5
//         )
//       ) {
//         showPlayButton();
//       }
//     });

//     // Handle video pause events
//     artPlayerInstanceRef.current.on("video:pause", () => {
//       // Only show play button if not during initial loading
//       if (
//         !isFastForwarding &&
//         !(
//           isActive &&
//           playstart &&
//           artPlayerInstanceRef.current &&
//           typeof artPlayerInstanceRef.current.currentTime === "number" &&
//           artPlayerInstanceRef.current.currentTime < 0.5
//         )
//       ) {
//         showPlayButton();
//       }
//     });

//     // Add initial loading state handler - critical for preventing flicker
//     artPlayerInstanceRef.current.on("video:loadstart", () => {
//       // Show loading indicator during initial load
//       const loadingIndicator =
//         artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//           ".video-loading-indicator"
//         ) as HTMLDivElement;

//       if (loadingIndicator) loadingIndicator.style.display = "block";

//       // Hide play button during initial loading when autoplay is expected
//       if (isActive && playstart) {
//         hidePlayButton();
//       }

//       // Ensure the poster is properly set and visible during initial loading
//       if (artPlayerInstanceRef.current && thumbnail) {
//         artPlayerInstanceRef.current.poster = thumbnail;

//         // Always ensure poster is visible during initial loading - use single animation frame
//         requestAnimationFrame(() => {
//           const posterElement = artPlayerInstanceRef.current.template.$poster;

//           // Apply all styles in a single operation to prevent flickering
//           posterElement.style.cssText += `
//             display: block !important;
//             visibility: visible !important;
//             transition: opacity 1s ease-out !important;
//             -webkit-transition: opacity 1s ease-out !important;
//             opacity: 1 !important;
//           `;

//           posterElement.classList.add("art-poster-with-transition");
//         });
//       }
//     });

//     // Add canplay event to hide loading indicator and show play button if needed
//     artPlayerInstanceRef.current.on("video:canplay", () => {
//       const loadingIndicator =
//         artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//           ".video-loading-indicator"
//         ) as HTMLDivElement;

//       if (loadingIndicator) loadingIndicator.style.display = "none";

//       // Only show play button if:
//       // 1. Video is not playing AND
//       // 2. Not fast forwarding AND
//       // 3. Not attempting autoplay during initial loading
//       if (
//         artPlayerInstanceRef.current &&
//         !artPlayerInstanceRef.current.playing &&
//         !isFastForwarding &&
//         !(
//           isActive &&
//           playstart &&
//           artPlayerInstanceRef.current.currentTime < 0.5
//         )
//       ) {
//         // showPlayButton();
//       } else {
//         hidePlayButton();
//       }
//     });

//     artPlayerInstanceRef.current.on("video:ended", () => {
//       // Clear saved position when video ends
//       if (user?.token && post_id) {
//         try {
//           const positionsJson =
//             localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
//           const positions = JSON.parse(positionsJson);

//           // Remove position for this video
//           if (positions[post_id]) {
//             delete positions[post_id];
//             localStorage.setItem(
//               VIDEO_POSITIONS_KEY,
//               JSON.stringify(positions)
//             );
//           }
//         } catch (error) {
//           console.error("Failed to clear video position:", error);
//         }
//       }

//       // Stop position saving
//       stopPositionSaving();
//     });

//     // Add error handler to keep poster visible on error
//     artPlayerInstanceRef.current.on("error", () => {
//       showPoster();
//       showPlayButton();
//     });

//     // When video is paused after attempting to play, ensure poster is visible
//     // artPlayerInstanceRef.current.on("video:stalled", () => {
//     //   if (!artPlayerInstanceRef.current?.playing) {
//     //     showPoster();
//     //     showPlayButton();
//     //   }
//     // });

//     // Keep poster visible if video waiting for data
//     artPlayerInstanceRef.current.on("video:waiting", function () {
//       // Only show poster if at the beginning of the video (not mid-playback buffering)
//       if (
//         artPlayerInstanceRef.current &&
//         artPlayerInstanceRef.current.currentTime < 0.5 &&
//         !artPlayerInstanceRef.current.playing
//       ) {
//         showPoster();
//       }
//     });
//   };

//   // Setup watch timer function
//   const setupWatchTimer = () => {
//     // Clear any existing timer first
//     cleanupWatchTimer();

//     // Set up a new timer
//     watchTimerRef.current = setInterval(() => {
//       watchedTimeRef.current += 1; // Increment watched time every second

//       // Trigger API call after 5 seconds of playback
//       if (watchedTimeRef.current >= 5 && !apiCalledRef.current && !type) {
//         handleWatchHistory();
//         // Stop the timer after we've reached 5 seconds and made the API call
//         cleanupWatchTimer();
//       }
//     }, 1000); // Update every second
//   };

//   // Cleanup watch timer function
//   const cleanupWatchTimer = () => {
//     if (watchTimerRef.current) {
//       clearInterval(watchTimerRef.current);
//       watchTimerRef.current = null;
//     }
//   };

//   // Update the event handlers to use the new functions
//   artPlayerInstanceRef.current?.on("play", () => {
//     setupWatchTimer();
//   });

//   artPlayerInstanceRef.current?.on("pause", () => {
//     cleanupWatchTimer();
//   });

//   // Add a function to safely fade out the poster only when video is confirmed playing
//   const safeFadePosterOut = (force = false) => {
//     if (!artPlayerInstanceRef.current?.template?.$poster) return;

//     const posterElement = artPlayerInstanceRef.current.template.$poster;
//     const videoElement = artPlayerInstanceRef.current.video;

//     if (!videoElement) return;

//     // Use requestAnimationFrame to ensure style changes are batched properly
//     requestAnimationFrame(() => {
//       // Ensure transition is applied before changing opacity
//       if (!posterElement.classList.contains("art-poster-with-transition")) {
//         posterElement.style.cssText += `
//           transition: opacity 1s ease-out !important;
//           -webkit-transition: opacity 1s ease-out !important;
//           visibility: visible !important;
//           display: block !important;
//         `;
//         posterElement.classList.add("art-poster-with-transition");
//         // Force a reflow to ensure transition is applied
//         void posterElement.offsetWidth;
//       }

//       // Only fade out if:
//       // 1. We're forcing it (from a known good state) OR
//       // 2. The video is actually ready to play AND either playing or has buffered content
//       if (
//         force ||
//         (videoElement.readyState >= 3 &&
//           (artPlayerInstanceRef.current.playing ||
//             videoElement.buffered.length > 0))
//       ) {
//         posterElement.style.cssText += `opacity: 0 !important;`;
//       }
//     });
//   };

//   // Explicitly show poster with animation
//   const showPoster = () => {
//     if (!artPlayerInstanceRef.current?.template?.$poster) return;

//     const posterElement = artPlayerInstanceRef.current.template.$poster;

//     // Use requestAnimationFrame to ensure styles are applied together
//     requestAnimationFrame(() => {
//       // Apply all styles in a single operation
//       posterElement.style.cssText += `
//         display: block !important;
//         visibility: visible !important;
//         transition: opacity 1s ease-out !important;
//         -webkit-transition: opacity 1s ease-out !important;
//       `;

//       if (!posterElement.classList.contains("art-poster-with-transition")) {
//         posterElement.classList.add("art-poster-with-transition");
//       }

//       // Force a reflow to ensure style changes are processed
//       void posterElement.offsetWidth;

//       // Now set opacity in a separate frame to ensure transition happens
//       requestAnimationFrame(() => {
//         posterElement.style.cssText += `opacity: 1 !important;`;
//       });
//     });
//   };

//   useEffect(() => {
//     if (!spriteImageUrlRef.current && video.sprite_url) {
//       loadAndDecryptSprite();
//     }
//   }, [video?.sprite_url]);

//   // Handle active state changes
//   useEffect(() => {
//     if (!playerContainerRef.current) return;

//     if (isActive) {
//       // if (!spriteImageUrlRef.current && video.sprite_url) {
//       //   loadAndDecryptSprite();
//       // }
//       // Increment the index when a new video becomes active
//       indexRef.current++;

//       // Abort previous request when index >= 1
//       if (indexRef.current > 1 && abortControllerRef.current.length > 0) {
//         abortControllerRef.current[0].abort(); // Abort the first (oldest) request
//         abortControllerRef.current.splice(0, 1); // Remove the first item from the array
//         if (videoData?.current.length > 0) {
//           videoData?.current[0].pause();
//           videoData?.current[0].removeAttribute("src");
//           videoData?.current[0].load(); // Reset the video element
//           videoData?.current.splice(0, 1);
//           indexRef.current--; // Decrease index count
//         }
//       }

//       //initializePlayer();

//       attemptPlay();

//       // Set quality to auto for active video
//       if (hlsRef.current) {
//         hlsRef.current.currentLevel = -1;
//       }
//     } else {
//       // Clear watch timer and reset counters when component becomes inactive
//       cleanupWatchTimer();
//       // Reset watch time tracking when switching videos
//       watchedTimeRef.current = 0;
//       apiCalledRef.current = false;

//       // Cleanup when inactive
//       if (artPlayerInstanceRef.current) {
//         artPlayerInstanceRef.current.destroy();
//         artPlayerInstanceRef.current = null;
//       }
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     }
//   }, [isActive]);

//   useEffect(() => {
//     if (isActive && playstart && !newStart) {
//       // Add a small delay to ensure the player is fully initialized
//       setTimeout(() => {
//         attemptPlay();
//       }, 100);
//       setnewStart(true);
//     }
//   }, [isActive, playstart]);

//   // Track user interaction
//   useEffect(() => {
//     const handleUserInteraction = () => {
//       localStorage.setItem("userInteracted", "true");
//       document.removeEventListener("scroll", handleUserInteraction);
//       document.removeEventListener("touchstart", handleUserInteraction);
//     };

//     document.addEventListener("scroll", handleUserInteraction, { once: true });
//     document.addEventListener("touchstart", handleUserInteraction, {
//       once: true,
//     });

//     return () => {
//       document.removeEventListener("scroll", handleUserInteraction);
//       document.removeEventListener("touchstart", handleUserInteraction);
//     };
//   }, []);

//   // Initialize player when component mounts
//   useEffect(() => {
//     // initializePlayer();
//     const container = playerContainerRef.current;

//     if (!container) return;

//     // Force progress bar visibility after a short delay
//     // This helps with Chrome visibility issues
//     const progressBarVisibilityTimer = setTimeout(() => {
//       if (progressBarRef.current) {
//         progressBarRef.current.style.opacity = "1";
//         progressBarRef.current.style.display = "block";

//         // Add Chrome-specific styles
//         const isChrome =
//           /Chrome/.test(navigator.userAgent) &&
//           /Google Inc/.test(navigator.vendor);
//         if (isChrome) {
//           // Add styles to the head
//           const styleEl = document.createElement("style");
//           styleEl.textContent = `
//             .chrome-fix {
//               -webkit-appearance: none !important;
//               appearance: none !important;
//               background: rgba(255, 255, 255, 0.2) !important;
//               height: 4px !important;
//               border-radius: 2px !important;
//               outline: none !important;
//               opacity: 1 !important;
//               display: block !important;
//               visibility: visible !important;
//               cursor: pointer !important;
//             }

//             .chrome-fix::-webkit-slider-thumb {
//               -webkit-appearance: none !important;
//               appearance: none !important;
//               width: 12px !important;
//               height: 12px !important;
//               background: #d53ff0 !important;
//               border-radius: 50% !important;
//               cursor: pointer !important;
//             }

//             .custom-progress-container {
//               display: block !important;
//               visibility: visible !important;
//               opacity: 1 !important;
//             }
//           `;
//           document.head.appendChild(styleEl);

//           // Create a MutationObserver to ensure the progress bar is always visible
//           if (playerContainerRef.current) {
//             const observer = new MutationObserver((mutations) => {
//               // Check if our progress bar exists
//               if (progressBarRef.current) {
//                 // Force visibility
//                 progressBarRef.current.style.opacity = "1";
//                 progressBarRef.current.style.display = "block";
//                 progressBarRef.current.style.visibility = "visible";
//               }
//             });

//             // Start observing the player container for DOM changes
//             observer.observe(playerContainerRef.current, {
//               childList: true,
//               subtree: true,
//               attributes: true,
//               attributeFilter: ["style", "class"],
//             });

//             // Return cleanup function
//             return () => {
//               observer.disconnect();
//             };
//           }
//         }
//       }
//     }, 500);

//     // Observer for initializing the player
//     const initObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !artPlayerInstanceRef.current) {
//             // if (width > height) {
//             //   setPImg(true);
//             // } else {
//             //   setPImg(false);
//             // }
//             initializePlayer();
//           }
//         });
//       },
//       {
//         rootMargin: "200px 0px", // Start initializing slightly before entering viewport
//         threshold: 0.5, // Trigger when at least 1% of the element is visible
//       }
//     );

//     // Observe the player container for both initialization and autoplay
//     initObserver.observe(container);

//     return () => {
//       initObserver.disconnect();

//       clearTimeout(progressBarVisibilityTimer);
//       // Clear the watch timer when component unmounts
//       cleanupWatchTimer();
//       // Reset API called flag to ensure proper tracking for next mount
//       apiCalledRef.current = false;
//       watchedTimeRef.current = 0;

//       // Save position before unmounting
//       if (artPlayerInstanceRef.current) {
//         saveVideoPosition(artPlayerInstanceRef.current.currentTime);
//       }

//       // Stop position saving
//       stopPositionSaving();

//       if (artPlayerInstanceRef.current) {
//         artPlayerInstanceRef.current.destroy();
//         artPlayerInstanceRef.current = null;
//       }
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [src, post_id, user]);

//   // useEffect(() => {
//   //   if (
//   //     isPlay &&
//   //     artPlayerInstanceRef.current &&
//   //     !artPlayerInstanceRef.current.playing
//   //   ) {
//   //     artPlayerInstanceRef.current.play();
//   //   }
//   // }, [isPlay]);

//   useEffect(() => {
//     muteRef.current = mute; // Update muteRef when mute state changes
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.muted = mute;
//     }
//   }, [mute]);

//   // Handle rotate state changes
//   useEffect(() => {
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.fullscreen = rotate;
//     }
//   }, [rotate]);

//   const hidePlayButton = () => {
//     if (playIconRef.current) {
//       playIconRef.current.style.display = "none";
//     }

//     // Also hide the template play indicator
//     if (artPlayerInstanceRef.current?.template?.$state) {
//       const playIndicator =
//         artPlayerInstanceRef.current.template.$state.querySelector(
//           ".video-play-indicator"
//         ) as HTMLDivElement;
//       if (playIndicator) playIndicator.style.display = "none";
//     }
//   };

//   const showPlayButton = () => {
//     if (playIconRef.current) {
//       playIconRef.current.style.display = "block";
//     }
//   };

//   const startFastForward = () => {
//     if (!artPlayerInstanceRef.current) return;

//     // Store playing state before fast forward
//     wasPlayingRef.current = artPlayerInstanceRef.current.playing;

//     setIsFastForwarding(true);
//     isLongPressActiveRef.current = true; // Ensure the ref is set when fast forward starts
//     hidePlayButton(); // Always hide play button when starting fast forward
//     dispatch(sethideBar(true)); // Hide UI layers during fast forward

//     const player = artPlayerInstanceRef.current;

//     // Ensure video is playing during fast forward
//     player.play();
//     // Set playback rate to 2x
//     player.playbackRate = FAST_FORWARD_RATE;

//     // Hide progress bar during fast forward
//     if (progressBarRef.current) {
//       progressBarRef.current.style.opacity = "0";
//       progressBarRef.current.style.display = "none";
//     }

//     fastForwardIntervalRef.current = setInterval(() => {
//       if (player.currentTime >= player.duration - 1) {
//         stopFastForward(); // Stop at end of video
//       }

//       // Update progress bar during fast forward (even though it's hidden)
//       if (progressBarRef.current) {
//         const currentTime = player.currentTime || 0;
//         const duration = player.duration || 1;
//         const newProgress = (currentTime / duration) * 100;
//         progressBarRef.current.value = newProgress.toString();
//         progressBarRef.current.style.setProperty(
//           "--progress",
//           `${newProgress}%`
//         );
//       }
//     }, FAST_FORWARD_INTERVAL);
//   };

//   const stopFastForward = () => {
//     if (!artPlayerInstanceRef.current) return;

//     if (fastForwardIntervalRef.current) {
//       clearInterval(fastForwardIntervalRef.current);
//       fastForwardIntervalRef.current = null;
//     }

//     const player = artPlayerInstanceRef.current;
//     player.playbackRate = 1; // Reset playback rate

//     setIsFastForwarding(false);
//     isLongPressActiveRef.current = false; // Reset the ref when fast forward stops
//     dispatch(sethideBar(false)); // Show UI layers again

//     // Show progress bar again after fast forward
//     if (progressBarRef.current) {
//       progressBarRef.current.style.opacity = "1";
//       progressBarRef.current.style.display = "block";
//     }

//     // Always continue playing after fast forward
//     player.play();
//     hidePlayButton();
//   };

//   const cleanupPlayer = () => {
//     // Save position before cleanup
//     if (artPlayerInstanceRef.current) {
//       saveVideoPosition(artPlayerInstanceRef.current.currentTime);
//     }

//     // Stop position saving
//     stopPositionSaving();

//     if (artPlayerInstanceRef.current) {
//       // Force garbage collection of video resources
//       const video = artPlayerInstanceRef.current.video;
//       if (video) {
//         video.pause();
//         video.removeAttribute("src");
//         video.load();
//       }
//       artPlayerInstanceRef.current.destroy();
//       artPlayerInstanceRef.current = null;
//     }

//     // Clean up HLS instance if it exists
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
//     if (longPressTimerRef.current) {
//       clearTimeout(longPressTimerRef.current);
//       longPressTimerRef.current = null;
//     }
//     if (fastForwardIntervalRef.current) {
//       clearInterval(fastForwardIntervalRef.current);
//       fastForwardIntervalRef.current = null;
//     }
//   };

//   const attemptPlay = () => {
//     if (!artPlayerInstanceRef.current) return;

//     if (playstart) {
//       // Ensure poster is visible and loading indicator is shown during play attempt
//       showPoster();

//       const loadingIndicator =
//         artPlayerInstanceRef.current?.template?.$loading?.querySelector(
//           ".video-loading-indicator"
//         ) as HTMLDivElement;
//       if (loadingIndicator) loadingIndicator.style.display = "block";

//       // Hide play button during initial autoplay attempt
//       hidePlayButton();

//       // For HLS videos, make sure video is loaded before attempting play
//       if (hlsRef.current) {
//         // Ensure HLS has loaded enough data
//         const videoElement = artPlayerInstanceRef.current.video;
//         const buffered = videoElement.buffered;

//         if (buffered && buffered.length > 0) {
//           const bufferedEnd = buffered.end(buffered.length - 1);
//           const currentTime = videoElement.currentTime || 0;

//           // If we have enough buffered data, play
//           if (bufferedEnd - currentTime > 1) {
//             artPlayerInstanceRef.current
//               .play()
//               .then(() => {
//                 // Play succeeded - hide loading indicator and wait for video frames
//                 if (loadingIndicator) loadingIndicator.style.display = "none";
//                 hidePlayButton();

//                 // Only fade out poster when we have actual frames
//                 setTimeout(() => {
//                   if (
//                     artPlayerInstanceRef.current?.video &&
//                     artPlayerInstanceRef.current.video.readyState >= 3
//                   ) {
//                     safeFadePosterOut(true);
//                   }
//                 }, 100);
//               })
//               .catch((error) => {
//                 console.error("Video play failed:", error);

//                 // Play failed - hide loading indicator and show play button
//                 if (loadingIndicator) loadingIndicator.style.display = "none";
//                 showPlayButton();

//                 // Keep poster visible on error
//                 showPoster();
//               });
//           } else {
//             // Not enough buffered data yet, wait a bit and try again
//             setTimeout(attemptPlay, 500);
//           }
//         } else {
//           // No buffered data yet, wait a bit and try again
//           setTimeout(attemptPlay, 500);
//         }
//       } else {
//         // For non-HLS videos, just try to play
//         artPlayerInstanceRef.current
//           .play()
//           .then(() => {
//             // Play succeeded - hide loading indicator and wait for video frames
//             if (loadingIndicator) loadingIndicator.style.display = "none";
//             hidePlayButton();

//             // Only fade out poster when we have actual frames
//             setTimeout(() => {
//               if (
//                 artPlayerInstanceRef.current?.video &&
//                 artPlayerInstanceRef.current.video.readyState >= 3
//               ) {
//                 safeFadePosterOut(true);
//               }
//             }, 100);
//           })
//           .catch((error) => {
//             console.error("Video play failed:", error);

//             // Play failed - hide loading indicator and show play button
//             if (loadingIndicator) loadingIndicator.style.display = "none";
//             showPlayButton();

//             // Keep poster visible on error
//             showPoster();

//             // Handle autoplay blocking specifically
//             if (error.name === "NotAllowedError") {
//               if (artPlayerInstanceRef.current) {
//                 artPlayerInstanceRef.current.pause();
//                 // Show controls to allow manual play
//                 artPlayerInstanceRef.current.controls.show = true;
//               }
//             }
//           });
//       }
//     }
//   };

//   return (
//     <div
//       ref={playerContainerRef}
//       className={`video_player w-full ${p_img ? "poster_change" : ""}`}
//       style={{ minHeight: "200px" }} // Add minimum height to prevent collapse
//     />
//   );
// };

// export default Player;

import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../indicator.png";
import vod_loader from "../vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { useWatchtPostMutation } from "../services/homeApi";
import { showToast } from "../services/errorSlice";
import { decryptImage } from "@/utils/imageDecrypt";
import { ar, c } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { setMute } from "../services/muteSlice";
import { sethideBar } from "../services/hideBarSlice";
import forward from "../Fastforward.gif";
import sprite_loading from "../../../assets/sprite_loading.gif";
// Constants for video preloading
const BUFFER_THRESHOLD = 10; // seconds before current position to start buffering
const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB maximum buffer size
// Add constants for video position remembering
const POSITION_SAVE_INTERVAL = 5000; // Save position every 5 seconds
const VIDEO_POSITIONS_KEY = "video_positions"; // Local storage key

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
  p_img,
  rotate,
  type,
  post_id,
  isActive,
  abortControllerRef,
  indexRef,
  videoData,
  setShowRotate,
  video,
}: {
  src: string;
  thumbnail: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  handleLike: () => void;
  p_img: any;
  post_id: string;
  rotate: boolean;
  type: string;
  width: number;
  height: number;
  isActive: boolean;
  abortControllerRef: any;
  indexRef: any;
  videoData: any;
  video: any;
  setShowRotate: any;
}) => {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { mute } = useSelector((state: RootState) => state.muteSlice);
  const user = useSelector((state: RootState) => state.persist.user);
  const { playstart } = useSelector((state: any) => state.playSlice);
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
  // const [p_img, setPImg] = useState(false);
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
  const [newStart, setnewStart] = useState(false);
  const watchTimerRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the watch timer
  const [isSpriteLoading, setIsSpriteLoading] = useState(false);
  const blackScreenRef = useRef<HTMLDivElement | null>(null); // Reference to the black screen overlay

  const dispatch = useDispatch();

  const [thumbnailPreview, setThumbnailPreview] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    time: 0,
  });

  const spriteImageUrlRef = useRef<string | null>(null);
  const metadata = video?.sprite_metadata || {};

  // // Load and decrypt the sprite image
  // const loadAndDecryptSprite = async () => {
  //   try {
  //     const spriteUrl = video.sprite_url || "";
  //     setIsSpriteLoading(true); // Set loading state

  //     const xorKey = 0x12;
  //     const encryptSize = 4096;

  //     const response = await fetch(spriteUrl);

  //     const base64Text = await response.text();

  //     // XOR-decrypt the first N characters
  //     const chars = base64Text.split("");
  //     const max = Math.min(encryptSize, chars.length);
  //     for (let i = 0; i < max; i++) {
  //       const xorCharCode = chars[i].charCodeAt(0) ^ xorKey;
  //       chars[i] = String.fromCharCode(xorCharCode);
  //     }

  //     const decryptedBase64 = chars.join("");

  //     // Parse base64 into Blob
  //     const [header, base64Data] = decryptedBase64.includes("base64,")
  //       ? decryptedBase64.split(",")
  //       : ["data:image/jpeg;base64", decryptedBase64];

  //     const byteString = atob(base64Data);
  //     const byteArray = new Uint8Array(byteString.length);
  //     for (let i = 0; i < byteString.length; i++) {
  //       byteArray[i] = byteString.charCodeAt(i);
  //     }

  //     const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";
  //     const blob = new Blob([byteArray], { type: mimeType });

  //     // Create object URL
  //     const url = URL.createObjectURL(blob);

  //     spriteImageUrlRef.current = url; // Update the ref
  //   } catch (error) {
  //     console.error("Error loading sprite:", error);
  //   }
  // };

  const loadAndDecryptSprite = async () => {
    try {
      if (spriteImageUrlRef.current || !video?.sprite_url) return;

      setIsSpriteLoading(true); // Set loading state

      const spriteUrl = video.sprite_url;
      const xorKey = 0x12;
      const encryptSize = 4096;

      const response = await fetch(spriteUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const base64Text = await response.text();

      // XOR-decrypt the first N characters
      const chars = base64Text.split("");
      const max = Math.min(encryptSize, chars.length);
      for (let i = 0; i < max; i++) {
        const xorCharCode = chars[i].charCodeAt(0) ^ xorKey;
        chars[i] = String.fromCharCode(xorCharCode);
      }

      const decryptedBase64 = chars.join("");

      // Parse base64 into Blob
      const [header, base64Data] = decryptedBase64.includes("base64,")
        ? decryptedBase64.split(",")
        : ["data:image/jpeg;base64", decryptedBase64];

      const byteString = atob(base64Data);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      const mimeType = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";
      const blob = new Blob([byteArray], { type: mimeType });

      // Create object URL
      const url = URL.createObjectURL(blob);
      spriteImageUrlRef.current = url;
    } catch (error) {
      console.error("Error loading sprite:", error);
    } finally {
      setIsSpriteLoading(false); // Clear loading state
    }
  };
  // Get sprite position for a given time
  const getSpritePosition = (time: number) => {
    const index = Math.floor(time / metadata.frameInterval);
    if (index >= metadata.frameCount) return null;

    const col = index % metadata.tileCols;
    const row = Math.floor(index / metadata.tileCols);
    const x = col * metadata.tileWidth;
    const y = row * metadata.tileHeight;

    return { x, y };
  };

  // Update thumbnail preview
  const updateThumbnailPreview = (time: number, clientX: number) => {
    // if (!artPlayerInstanceRef.current || !spriteImageUrlRef.current) return;

    const pos = getSpritePosition(time);
    if (!pos) return;

    setThumbnailPreview({
      visible: true,
      position: {
        x: clientX - 80, // Center the preview under the cursor
        y: -100, // Position above the progress bar
      },
      time,
    });
  };

  // Add this useEffect near your other hooks
  useEffect(() => {
    if (!artPlayerInstanceRef.current) return;

    // Find the preview element in the DOM
    const previewElement = playerContainerRef.current?.querySelector(
      ".thumbnail-preview"
    ) as HTMLDivElement;
    //  if (!previewElement || !spriteImageUrlRef.current) return;

    if (thumbnailPreview.visible) {
      const pos = getSpritePosition(thumbnailPreview.time);
      if (pos) {
        previewElement.style.display = "block";
        // Calculate maximum left position to keep thumbnail within viewport
        const thumbnailWidth = metadata.isPortrait ? 90 : 160;
        const viewportWidth = window.innerWidth;
        const maxLeft = viewportWidth - thumbnailWidth - 10; // buffer from right edge
        const innerDiv = previewElement.querySelector(".bg-th");

        // Constrain the position
        let leftPosition = thumbnailPreview.position.x + 20;
        leftPosition = Math.max(10, Math.min(leftPosition, maxLeft)); // 10px minimum from left edge

        previewElement.style.left = `${leftPosition}px`;
        previewElement.style.bottom = "100px";

        if (isSpriteLoading && video?.sprite_url) {
          const innerDiv = previewElement.querySelector(".bg-th");

          if (innerDiv) {
            innerDiv.style.backgroundImage = `url(${sprite_loading})`;
          }
        } else {
          const innerDiv = previewElement.querySelector(".bg-th");
          if (innerDiv) {
            innerDiv.style.backgroundImage = `url(${spriteImageUrlRef.current})`;
          }
        }

        // Calculate the correct scale factor to fit the sprite in our thumbnail
        const scaleX = metadata.isPortrait
          ? 90 / metadata.tileWidth
          : 160 / metadata.tileWidth;
        const scaleY = metadata.isPortrait
          ? 160 / metadata.tileHeight
          : 90 / metadata.tileHeight;

        // Use the same scaling for X and Y to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY);

        // Calculate scaled position based on the size ratio
        const scaledX = pos.x * scale;
        const scaledY = pos.y * scale;

        if (innerDiv) {
          // Set the background size and position with appropriate scaling
          innerDiv.style.backgroundPosition = `-${scaledX}px -${scaledY}px`;
        }

        // Calculate the full sprite size
        const fullWidth = metadata.tileCols * metadata.tileWidth;
        const fullHeight = metadata.tileRows * metadata.tileHeight;

        // Scale the full sprite to match our thumbnail dimensions while maintaining aspect ratio
        const scaledWidth = fullWidth * scale;
        const scaledHeight = fullHeight * scale;

        if (innerDiv) {
          innerDiv.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
        }
      }
    } else {
      previewElement.style.display = "none";
    }
  }, [thumbnailPreview]);

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
    if (!post_id) return;

    try {
      // Get existing positions from local storage
      const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
      const positions = JSON.parse(positionsJson);

      // Save position for current video
      positions[post_id] = {
        position,
        timestamp: Date.now(),
      };

      // Save back to local storage
      localStorage.setItem(VIDEO_POSITIONS_KEY, JSON.stringify(positions));
    } catch (error) {
      console.error("Failed to save video position:", error);
    }
  };

  // Get saved position for current video
  const getSavedPosition = (): number | null => {
    if (!post_id) return null;

    try {
      const positionsJson = localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
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
      console.error("Failed to get saved video position:", error);
      return null;
    }
  };

  // Start periodic position saving
  const startPositionSaving = () => {
    if (positionSaveTimerRef.current) {
      clearInterval(positionSaveTimerRef.current);
    }

    positionSaveTimerRef.current = setInterval(() => {
      if (
        artPlayerInstanceRef.current &&
        artPlayerInstanceRef.current.playing
      ) {
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

  // useEffect(() => {
  //   const loadAndDecryptPhoto = async () => {
  //     if (!thumbnail) {
  //       setDecryptedPhoto("");
  //       return;
  //     }

  //     try {
  //       const photoUrl = thumbnail;

  //       // If it's not a .txt file, assume it's already a valid URL
  //       if (!photoUrl.endsWith(".txt")) {
  //         setDecryptedPhoto(photoUrl);
  //         return;
  //       }

  //       const decryptedUrl = await decryptImage(photoUrl);
  //       setDecryptedPhoto(decryptedUrl);
  //     } catch (error) {
  //       console.error("Error loading profile photo:", error);
  //       setDecryptedPhoto("");
  //     }
  //   };

  //   loadAndDecryptPhoto();
  // }, [thumbnail]);

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
    const isM3u8 = src.toLowerCase().endsWith(".m3u8");

    // Configure Artplayer options
    const options: Artplayer["Option"] = {
      autoOrientation: true,
      container: playerContainerRef.current,
      url: src,
      volume: 0.5,
      muted: muteRef.current, // Mute initially unless user has interacted
      autoplay: isActive, //
      fullscreenWeb: true,
      poster: thumbnail,
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
        // m3u8: function (videoElement: HTMLVideoElement, url: string) {
        //   // Check if it's an iOS device first
        //   const isIOS =
        //     /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        //   const isMacOS = /Mac/.test(navigator.userAgent);
        //   const isAppleDevice = isIOS || isMacOS;

        //   if (
        //     isAppleDevice &&
        //     videoElement.canPlayType("application/vnd.apple.mpegurl")
        //   ) {
        //     // Use native HLS playback for iOS devices immediately
        //     // alert('Using native HLS playback for iOS');
        //     videoElement.src = url;

        //     if (playstart) {
        //       videoElement.play().catch((error) => {
        //         console.warn("Auto-play prevented on iOS:", error);
        //       });
        //     }

        //     // videoElement.addEventListener('canplay', function() {
        //     //   videoElement.play().catch(error => {
        //     //     console.warn('Auto-play prevented on iOS:', error);
        //     //   });
        //     // });
        //   } else if (Hls.isSupported()) {
        //     // Use HLS.js for other browsers that support it
        //     // alert('Using HLS.js for HLS playback');
        //     const hls = new Hls({
        //       maxBufferLength: 30,
        //       maxMaxBufferLength: 60,
        //       enableWorker: true,
        //       lowLatencyMode: true,
        //       startLevel: -1, // Auto level selection
        //     });

        //     // Add error handling
        //     hls.on(Hls.Events.ERROR, function (event, data) {
        //       if (data.fatal) {
        //         console.error("HLS fatal error:", data.type, data.details);
        //         switch (data.type) {
        //           case Hls.ErrorTypes.NETWORK_ERROR:
        //             // Try to recover network error
        //             console.log(
        //               "Fatal network error encountered, trying to recover"
        //             );
        //             hls.startLoad();
        //             break;
        //           case Hls.ErrorTypes.MEDIA_ERROR:
        //             console.log(
        //               "Fatal media error encountered, trying to recover"
        //             );
        //             hls.recoverMediaError();
        //             break;
        //           default:
        //             // Cannot recover
        //             hls.destroy();
        //             break;
        //         }
        //       } else {
        //         console.warn("Non-fatal HLS error:", data.type, data.details);
        //       }
        //     });

        //     // Add manifest loaded event
        //     hls.on(Hls.Events.MANIFEST_PARSED, function () {
        //       console.log("HLS manifest loaded successfully");
        //       // Attempt to play after manifest is loaded
        //       if (isActive && playstart) {
        //         videoElement.play().catch((error) => {
        //           console.warn("Auto-play prevented:", error);
        //         });
        //       }
        //     });

        //     hls.loadSource(url);
        //     hls.attachMedia(videoElement);
        //     hlsRef.current = hls;
        //   } else {
        //     // Fallback for other browsers with native HLS support
        //     console.log("Falling back to native HLS playback");
        //     videoElement.src = url;
        //     videoElement.addEventListener("canplay", function () {
        //       if (isActive && playstart) {
        //         videoElement.play().catch((error) => {
        //           console.warn("Auto-play prevented:", error);
        //         });
        //       }
        //     });
        //   }
        // },
        // Update the m3u8 customType in your Artplayer options
        m3u8: function (videoElement: HTMLVideoElement, url: string) {
          // Check if it's an iOS device first
          // const isIOS =
          //   /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          // const isMacOS = /Mac/.test(navigator.userAgent);
          // const isAppleDevice = isIOS || isMacOS;

          // console.log(isAppleDevice);

          // if (
          //   isAppleDevice &&
          //   videoElement.canPlayType("application/vnd.apple.mpegurl")
          // ) {
          //   console.log("winnn");
          //   // Native HLS for Apple devices with preload optimization
          //   videoElement.preload = "auto";
          //   videoElement.src = url;

          //   // Pre-warm the video element for iOS
          //   if (isIOS) {
          //     videoElement.load();
          //     videoElement.play().catch(() => {});
          //     videoElement.pause();
          //   }

          //   if (playstart) {
          //     videoElement.play().catch((error) => {
          //       console.warn("Auto-play prevented on iOS:", error);
          //     });
          //   }
          if (Hls.isSupported()) {
            // Optimized HLS.js configuration
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30, // Reduced from default 60 to save memory
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              maxBufferSize: 50 * 1000 * 1000, // 50MB
              maxBufferHole: 0.5, // Reduced from default 1 to minimize gaps
              maxFragLookUpTolerance: 0.25,
              startLevel: -1, // Auto quality
              abrEwmaDefaultEstimate: 500000, // Initial bandwidth estimate
              abrBandWidthFactor: 0.95,
              abrBandWidthUpFactor: 0.7,
              abrMaxWithRealBitrate: true,
              startFragPrefetch: false, // Prefetch fragments
              fpsDroppedMonitoringThreshold: 0.2,
              fpsDroppedMonitoringPeriod: 1000,
              capLevelToPlayerSize: true, // Match quality to player size
              initialLiveManifestSize: 1,
              stretchShortVideoTrack: true,
              forceKeyFrameOnDiscontinuity: true,
              // Manifest loading optimizations
              manifestLoadingTimeOut: 10000,
              manifestLoadingMaxRetry: 3,
              manifestLoadingRetryDelay: 500,
              manifestLoadingMaxRetryTimeout: 5000,
              levelLoadingTimeOut: 10000,
              levelLoadingMaxRetry: 3,
              levelLoadingRetryDelay: 500,
              levelLoadingMaxRetryTimeout: 5000,
              fragLoadingTimeOut: 20000, // Increased timeout for mobile
              fragLoadingMaxRetry: 6,
              fragLoadingRetryDelay: 500,
              fragLoadingMaxRetryTimeout: 5000,
            });

            // Improved error handling
            hls.on(Hls.Events.ERROR, function (event, data) {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log("Network error, trying to recover");
                    if (
                      data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
                      data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
                      data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR
                    ) {
                      // Try to reload the manifest
                      hls.startLoad();
                    } else if (
                      data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR ||
                      data.details === Hls.ErrorDetails.FRAG_LOAD_TIMEOUT ||
                      data.details === Hls.ErrorDetails.KEY_LOAD_ERROR ||
                      data.details === Hls.ErrorDetails.KEY_LOAD_TIMEOUT
                    ) {
                      // Try to recover fragment loading
                      hls.startLoad();
                    }
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log("Media error, trying to recover");
                    hls.recoverMediaError();
                    break;
                  default:
                    console.log("Unrecoverable error, destroying HLS");
                    hls.destroy();
                    break;
                }
              }
            });

            // Pre-warm the player before playback starts
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              // Start loading but don't play yet
              hls.startLoad(-1);

              // For mobile, preload more aggressively
              if (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  navigator.userAgent
                )
              ) {
                // Load first 3 fragments immediately
                const levels = hls.levels;
                if (levels && levels.length > 0) {
                  const startLevel = hls.currentLevel;
                  const frags = hls.levels[startLevel].details?.fragments;
                  if (frags && frags.length > 3) {
                    hls.nextLoadLevel = startLevel;
                    for (let i = 0; i < 3; i++) {
                      hls.loadFragment(frags[i], startLevel, null);
                    }
                  }
                }
              }
            });

            // When enough data is buffered, start playback
            hls.on(Hls.Events.FRAG_BUFFERED, function () {
              if (!isActive) return;

              const buffered = videoElement.buffered;
              if (buffered && buffered.length > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                const currentTime = videoElement.currentTime || 0;

                // If we have at least 2 seconds buffered ahead, start playback
                if (bufferedEnd - currentTime > 2) {
                  if (playstart && videoElement.paused) {
                    videoElement
                      .play()
                      .catch((e) => console.log("Playback error:", e));
                  }
                }
              }
            });

            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hlsRef.current = hls;

            // Start loading immediately
            hls.startLoad(-1);
          } else {
            // Fallback with more aggressive preloading
            videoElement.src = url;
            videoElement.preload = "auto";

            // For mobile fallback, try to force loading
            if (
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              )
            ) {
              videoElement.load();
            }

            videoElement.addEventListener("canplay", function () {
              if (isActive && playstart) {
                videoElement.play().catch((error) => {
                  console.warn("Auto-play prevented:", error);
                });
              }
            });
          }
        },
      },
      layers: [
        {
          html: `
            <div class="custom-progress-container">
              <input type="range" min="0" max="100" step="0.1" class="custom-progress-bar chrome-fix" />
                <div class="custom-time-display" style="display: none; justify-content: center; position: absolute; width: 100%; left: 0; text-align: center;"></div>
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
            const isChrome =
              /Chrome/.test(navigator.userAgent) &&
              /Google Inc/.test(navigator.vendor);
            if (isChrome) {
              progressBarRef.current.style.webkitAppearance = "none";
              progressBarRef.current.style.appearance = "none";
              progressBarRef.current.style.background =
                "rgba(255, 255, 255, 0.2)";
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.borderRadius = "2px";
              progressBarRef.current.style.outline = "none";
              progressBarRef.current.style.transition = "opacity 0.2s";
              progressBarRef.current.style.cursor = "pointer";
            }

            // Desktop events
            progressBarRef.current.addEventListener("input", (e) => {
              setShowRotate(true);
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

              // Update thumbnail preview
              if (e instanceof MouseEvent) {
                updateThumbnailPreview(seekTimeRef.current, e.clientX);
              }

              if (timeDisplayRef.current) {
                const currentTime = formatTime(seekTimeRef.current);
                const duration = formatTime(
                  artPlayerInstanceRef.current.duration
                );

                // if (video?.sprite_url) {
                //   if (metadata?.isPortrait) {
                //     timeDisplayRef.current.style.bottom = `220px`;
                //   } else {
                //     timeDisplayRef.current.style.bottom = `150px`;
                //   }
                // } else {
                //   timeDisplayRef.current.style.bottom = `100px`;
                // }
                if (metadata?.isPortrait) {
                  timeDisplayRef.current.style.bottom = `270px`;
                } else {
                  timeDisplayRef.current.style.bottom = `200px`;
                }
                timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
                  background: rgba(0, 0, 0, 0.5);
                  padding: 16px 20px;
                  width: 280px;
                  display: inline-block;
                  text-align: center;"><span style="color: #d53ff0;  
                "  >${currentTime}</span> / ${duration} </span>`;
              }
            });

            progressBarRef.current.addEventListener("change", () => {
              if (!artPlayerInstanceRef.current?.playing) {
                artPlayerInstanceRef.current?.play();
              }
              setShowRotate(false);
              if (!artPlayerInstanceRef.current || !isDraggingRef.current)
                return;
              isDraggingRef.current = false;
              setThumbnailPreview((prev) => ({ ...prev, visible: false }));
              dispatch(sethideBar(false));
              if (progressBarRef.current) {
                progressBarRef.current.style.height = "4px";
                progressBarRef.current.style.setProperty(
                  "--thumb-width",
                  "6px"
                );
                progressBarRef.current.style.setProperty(
                  "--thumb-height",
                  "16px"
                );
                progressBarRef.current.style.setProperty(
                  "--thumb-radius",
                  "5px"
                );
              }
              timeDisplayRef.current!.style.display = "none";
              artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
            });

            // Mobile touch events
            element.addEventListener("touchstart", (e) => {
              if (!artPlayerInstanceRef.current?.playing) {
                artPlayerInstanceRef.current?.play();
                artPlayerInstanceRef.current?.pause();
              }
              setShowRotate(true);
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
              updateThumbnailPreview(newTime, touch.clientX);
              if (timeDisplayRef.current) {
                const currentTime = formatTime(newTime);
                const duration = formatTime(
                  artPlayerInstanceRef.current.duration
                );

                // if (video?.sprite_url) {
                //   if (metadata?.isPortrait) {
                //     timeDisplayRef.current.style.bottom = `220px`;
                //   } else {
                //     timeDisplayRef.current.style.bottom = `150px`;
                //   }
                // } else {
                //   timeDisplayRef.current.style.bottom = `100px`;
                // }
                if (metadata?.isPortrait) {
                  timeDisplayRef.current.style.bottom = `270px`;
                } else {
                  timeDisplayRef.current.style.bottom = `200px`;
                }
                timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
                background: rgba(0, 0, 0, 0.5);
                padding: 16px 20px;
                width: 280px;
                display: inline-block;
                text-align: center;"><span style="color: #d53ff0;  
              "  >${currentTime}</span> / ${duration} </span>`;
              }
            });

            element.addEventListener("touchmove", (e) => {
              setShowRotate(true);
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              e.preventDefault();
              const touch = e.touches[0];
              updateThumbnailPreview(seekTimeRef.current, touch.clientX);
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(
                Math.max((touchX / rect.width) * 100, 0),
                100
              );

              // Make sure hideBar stays true during the entire touch drag operation
              dispatch(sethideBar(true));

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

                // if (video?.sprite_url) {
                //   if (metadata?.isPortrait) {
                //     timeDisplayRef.current.style.bottom = `220px`;
                //   } else {
                //     timeDisplayRef.current.style.bottom = `150px`;
                //   }
                // } else {
                //   timeDisplayRef.current.style.bottom = `100px`;
                // }
                if (metadata?.isPortrait) {
                  timeDisplayRef.current.style.bottom = `270px`;
                } else {
                  timeDisplayRef.current.style.bottom = `200px`;
                }

                // timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
                timeDisplayRef.current.innerHTML = `<span style="border-radius: 100px;
                background: rgba(0, 0, 0, 0.5);
                padding: 16px 20px;
                width: 280px;
                display: inline-block;
                text-align: center;"><span style="color: #d53ff0;  
              "  >${currentTime}</span> / ${duration} </span>`;
              }
            });

            element.addEventListener("touchend", () => {
              if (!artPlayerInstanceRef.current?.playing) {
                artPlayerInstanceRef.current?.play();
              }

              setShowRotate(false);
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              isDraggingRef.current = false;
              dispatch(sethideBar(false));
              setThumbnailPreview((prev) => ({ ...prev, visible: false }));
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.setProperty("--thumb-width", "6px");
              progressBarRef.current.style.setProperty(
                "--thumb-height",
                "16px"
              );
              progressBarRef.current.style.setProperty("--thumb-radius", "5px");
              timeDisplayRef.current!.style.display = "none";
              artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
            });
          },
        },
        {
          html: `
<div class="thumbnail-preview" style="
    position: absolute;
    width: ${metadata.isPortrait ? "90px" : "160px"};
    height: ${metadata.isPortrait ? "160px" : "90px"};
    background-repeat: no-repeat;
    background-size: cover;
    pointer-events: none;
    z-index: 10000;
    box-sizing: content-box;
    padding: 0;
    border-radius: 4px;
    /* Create space for the outside border */
    margin: 1.5px;
">
    <!-- Background image container -->
    <div style="
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: border-box;
    " class="bg-th"></div>
    
    <!-- Gradient border positioned outside -->
    <div style="
        position: absolute;
        top: -1.5px;
        left: -1.5px;
        right: -1.5px;
        bottom: -1.5px;
        background: linear-gradient(to bottom, 
            #da72ff 0%, 
            #da72ff 30%,
            transparent 100%);
        border-radius: 4px;
        z-index: -1;
        pointer-events: none;
        padding: 1.5px;
        box-sizing: border-box;
    ">
        <!-- Inner mask to create the border effect -->
        <div style="
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: inherit;
        "></div>
    </div>
</div>


          `,
          style: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "9999",
          },

          mounted: (element: HTMLElement) => {
            const previewElement = element.querySelector(
              ".thumbnail-preview"
            ) as HTMLDivElement;

            // Create a function to update the preview
            const updatePreview = () => {
              // if (!previewElement || !spriteImageUrlRef.current) return;

              if (thumbnailPreview.visible) {
                const pos = getSpritePosition(thumbnailPreview.time);
                if (pos) {
                  previewElement.style.display = "block";
                  // Calculate maximum left position to keep thumbnail within viewport
                  const thumbnailWidth = metadata.isPortrait ? 90 : 160;
                  const viewportWidth = window.innerWidth;
                  const maxLeft = viewportWidth - thumbnailWidth - 20; // buffer from right edge

                  // Constrain the position
                  let leftPosition = thumbnailPreview.position.x + 20;
                  leftPosition = Math.max(10, Math.min(leftPosition, maxLeft)); // 10px minimum from left edge
                  const innerDiv = previewElement.querySelector(".bg-th");

                  previewElement.style.left = `${leftPosition}px`;
                  previewElement.style.bottom = "100px";

                  if (isSpriteLoading && video?.sprite_url) {
                    const innerDiv = previewElement.querySelector(".bg-th");
                    if (innerDiv) {
                      innerDiv.style.backgroundImage = `url(${sprite_loading})`;
                    }
                  } else {
                    const innerDiv = previewElement.querySelector(".bg-th");
                    if (innerDiv) {
                      innerDiv.style.backgroundImage = `url(${spriteImageUrlRef.current})`;
                    }
                  }
                  // Calculate the correct scale factor to fit the sprite in our thumbnail
                  const scaleX = metadata.isPortrait
                    ? 90 / metadata.tileWidth
                    : 160 / metadata.tileWidth;
                  const scaleY = metadata.isPortrait
                    ? 160 / metadata.tileHeight
                    : 90 / metadata.tileHeight;

                  // Use the same scaling for X and Y to maintain aspect ratio
                  const scale = Math.min(scaleX, scaleY);

                  // Calculate scaled position based on the size ratio
                  const scaledX = pos.x * scale;
                  const scaledY = pos.y * scale;

                  if (innerDiv) {
                    innerDiv.style.backgroundPosition = `-${scaledX}px -${scaledY}px`;
                  }

                  // Set the background size and position with appropriate scaling

                  // Calculate the full sprite size
                  const fullWidth = metadata.tileCols * metadata.tileWidth;
                  const fullHeight = metadata.tileRows * metadata.tileHeight;

                  // Scale the full sprite to match our thumbnail dimensions while maintaining aspect ratio
                  const scaledWidth = fullWidth * scale;
                  const scaledHeight = fullHeight * scale;

                  if (innerDiv) {
                    innerDiv.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
                  }
                }
              } else {
                previewElement.style.display = "none";
              }
            };

            // Initial update
            updatePreview();

            // Store the preview element reference
            const previewRef = { current: previewElement };

            // Return a cleanup function
            return () => {
              // previewRef?.current = null;
            };
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
            const ffIndicator = element.querySelector(
              ".fast-forward-indicator"
            ) as HTMLElement;
            const ffIcon = element.querySelector(".ff-icon") as HTMLElement;

            if (ffIndicator) {
              // Set initial styles
              Object.assign(ffIndicator.style, {
                position: "absolute",
                bottom: "0%", // Changed from bottom: '0%' to center vertically
                left: "50%",
                transform: "translate(-50%, -50%)", // Center both horizontally and vertically
                backgroundColor: "#282630",
                color: "white",
                padding: "8px 16px", // Slightly increased padding
                borderRadius: "20px", // Increased border radius
                fontSize: "14px",
                fontWeight: "500", // Slightly bolder
                display: "none",
                opacity: "0",
                alignItems: "center",
                gap: "8px", // Increased gap between text and icon
                minWidth: "120px",
                justifyContent: "center",
                letterSpacing: "0.5px",
                transition: "opacity 0.3s ease-in-out",
                zIndex: "9999", // Ensure it's above other UI elements
              });
            }

            if (ffIcon) {
              Object.assign(ffIcon.style, {
                fontSize: "16px",
                lineHeight: "1",
                marginRight: "2px",
              });
            }

            const handleLongPressStart = (e: TouchEvent | MouseEvent) => {
              setShowRotate(true);
              if ("touches" in e) {
                const touch = e.touches[0];
                touchStartPosRef.current = {
                  x: touch.clientX,
                  y: touch.clientY,
                };
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
                    ffIndicator.style.display = "flex";
                    // Add animation
                    ffIndicator.style.transition = "opacity 0.2s ease-in-out";
                    ffIndicator.style.opacity = "1";
                  }
                }
              }, LONG_PRESS_DELAY);
            };

            const handleLongPressEnd = () => {
              setShowRotate(false);
              if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
              }
              if (isLongPress) {
                stopFastForward();
                if (ffIndicator) {
                  // Fade out animation
                  ffIndicator.style.opacity = "0";
                  setTimeout(() => {
                    ffIndicator.style.display = "none";
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
              const deltaX = Math.abs(
                touch.clientX - touchStartPosRef.current.x
              );
              const deltaY = Math.abs(
                touch.clientY - touchStartPosRef.current.y
              );

              // If user is swiping significantly (especially vertically), cancel long press
              // But only if long press hasn't already activated
              if (
                (deltaX > SWIPE_THRESHOLD || deltaY > SWIPE_THRESHOLD) &&
                !isLongPressActiveRef.current
              ) {
                handleLongPressEnd();
                return;
              }

              // If long press is already active, be more tolerant of movement
              if (isLongPressActiveRef.current) {
                // Allow more movement once fast forward is active
                if (
                  deltaX > SWIPE_THRESHOLD * 3 ||
                  deltaY > SWIPE_THRESHOLD * 3
                ) {
                  handleLongPressEnd();
                  return;
                }
                e.preventDefault(); // Prevent scrolling when in fast forward mode
              }
            };

            // Touch events
            element.addEventListener("touchstart", (e) => {
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
                      hidePlayButton();
                      safeFadePosterOut(true);
                      setTimeout(() => {
                        artPlayerInstanceRef.current?.play();
                      }, 500);
                    }
                  }
                }, 300);
              }
              lastClick = now;

              handleLongPressStart(e);
            });

            element.addEventListener("touchmove", handleTouchMove);
            element.addEventListener("touchend", handleLongPressEnd);
            element.addEventListener("touchcancel", handleLongPressEnd);

            // Prevent context menu
            element.addEventListener("contextmenu", (e) => e.preventDefault());
          },
        },
        // Add this to your layers array in the Artplayer options
        // {
        //   html: `
        //   <div  class="black-screen-layer" style="
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     width: 100%;
        //     height: 100%;
        //     background-color: black;
        //     display: block;
        //     inset:0;
        //   "></div>
        // `,
        //   style: {
        //     position: "absolute",
        //     top: "0",
        //     left: "0",
        //     width: " 100%",
        //     height: "100%",
        //     zIndex: "11",
        //     inset: "0",
        //   },

        //   mounted: (element: HTMLElement) => {
        //     const blackScreenLayer = element.querySelector(
        //       ".black-screen-layer"
        //     ) as HTMLDivElement;

        //     // Store the reference to the black screen layer
        //     blackScreenRef.current = blackScreenLayer;

        //     // Return cleanup function
        //     return () => {
        //       blackScreenRef.current = null;
        //     };
        //   },
        // },
        {
          html: `<div class="custom-play-icon" style="z-index: 999;">
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
                // Show loading indicator during play attempt
                const loadingIndicator =
                  artPlayerInstanceRef.current?.template?.$loading?.querySelector(
                    ".video-loading-indicator"
                  ) as HTMLDivElement;
                if (loadingIndicator) loadingIndicator.style.display = "block";

                // Hide play button during play attempt
                // hidePlayButton();

                // Don't fade out poster immediately - wait until play succeeds
                artPlayerInstanceRef.current
                  .play()
                  .then(() => {
                    // Play succeeded - hide loading indicator and play button
                    if (loadingIndicator)
                      loadingIndicator.style.display = "none";
                    hidePlayButton();

                    // Only fade out poster when we have actual frames
                    if (
                      artPlayerInstanceRef.current?.video &&
                      artPlayerInstanceRef.current.video.readyState >= 3
                    ) {
                      setTimeout(() => safeFadePosterOut(true), 100);
                    } else if (artPlayerInstanceRef.current?.video) {
                      // If video isn't ready yet, wait for it
                      const checkReadyState = () => {
                        if (
                          artPlayerInstanceRef.current?.video &&
                          artPlayerInstanceRef.current.video.readyState >= 3
                        ) {
                          safeFadePosterOut(true);
                          artPlayerInstanceRef.current.video.removeEventListener(
                            "canplay",
                            checkReadyState
                          );
                        }
                      };
                      if (artPlayerInstanceRef.current) {
                        artPlayerInstanceRef.current.video.addEventListener(
                          "canplay",
                          checkReadyState
                        );
                      }
                    }
                  })
                  .catch((error) => {
                    console.error("Manual play failed:", error);

                    // Play failed - hide loading indicator and show play button again
                    if (loadingIndicator)
                      loadingIndicator.style.display = "none";
                    if (playIconRef.current) {
                      playIconRef.current.style.display = "block";
                    }

                    // Keep poster visible on error
                    showPoster();
                  });
              }
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

    // Add CSS transitions to the poster element for smooth fade effect
    if (artPlayerInstanceRef.current?.template?.$poster) {
      const posterElement = artPlayerInstanceRef.current.template.$poster;

      // Apply strong CSS transitions with longer duration
      posterElement.style.cssText += `
        transition: opacity 1s ease-out !important;
        -webkit-transition: opacity 1s ease-out !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      `;

      // Add a custom class for easier targeting

      // Add transitionend listener to properly handle the end of transition
      posterElement.addEventListener("transitionend", (e) => {
        if (
          e.propertyName === "opacity" &&
          getComputedStyle(posterElement).opacity === "0"
        ) {
          posterElement.style.display = "none";
        }
      });

      // Force a reflow to ensure styles are applied
      void posterElement.offsetWidth;
    }

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

        // Fade out poster only if video has actually progressed beyond initial frame
        // and is definitely playing (at least 0.5 seconds in)
        if (currentTime > 0.5 && artPlayerInstanceRef.current.playing) {
          safeFadePosterOut();
        }
      }
    });

    // Add event listeners for video state
    artPlayerInstanceRef.current.on("ready", () => {
      // if (width > height) {
      //   setPImg(true);
      // } else {
      //   setPImg(false);
      // }
      // Don't show any indicators in the ready event
      // The video:loadstart or video:canplay events will handle showing the appropriate indicator
    });

    // Add loading state handler with progress bar visibility check
    artPlayerInstanceRef.current.on("video:waiting", () => {
      // Ensure progress bar is visible during loading
      if (progressBarRef?.current) {
        progressBarRef.current.style.opacity = "1";
      }

      // Show loading indicator and hide play button during normal loading
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "block";

      // During initial loading, keep the poster visible and don't show play button
      if (
        artPlayerInstanceRef.current &&
        artPlayerInstanceRef.current.currentTime < 0.5
      ) {
        // Ensure poster is visible during initial loading
        if (thumbnail && artPlayerInstanceRef.current.template.$poster) {
          artPlayerInstanceRef.current.poster = thumbnail;
          showPoster();
        }

        // Hide play button during initial loading when we expect autoplay
        if (isActive && playstart) {
          hidePlayButton();
        }
      }
    });

    // Add error handler to ensure progress bar remains visible
    artPlayerInstanceRef.current.on("error", (error) => {
      console.error("Video loading error:", error);
      // Ensure progress bar remains visible even on error
      if (progressBarRef?.current) {
        progressBarRef.current.style.opacity = "1";
      }

      // On error, we show both poster and play button
      showPoster();
      showPlayButton();

      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "none";
    });

    // Main play attempt handler
    artPlayerInstanceRef.current.on("play", () => {
      // Don't immediately fade out the poster - wait for actual frames
      if (!isFastForwarding) {
        // Only hide the play button, but keep poster until video is actually playing
        hidePlayButton();
      }
    });

    // Video has started playing - now we can safely fade the poster
    artPlayerInstanceRef.current.on("video:playing", () => {
      // Hide play button first
      if (!isFastForwarding) {
        hidePlayButton();
      }

      // Only fade out the poster if we have enough data to show frames
      if (
        artPlayerInstanceRef.current?.video &&
        artPlayerInstanceRef.current.video.readyState >= 3
      ) {
        // Wait a short time to ensure frames are visible before fading out poster
        setTimeout(() => safeFadePosterOut(true), 100);
      } else if (artPlayerInstanceRef.current?.video) {
        // If not enough data yet, set up a readyState check
        const checkReadyState = () => {
          if (
            artPlayerInstanceRef.current?.video &&
            artPlayerInstanceRef.current.video.readyState >= 3
          ) {
            safeFadePosterOut(true);
            artPlayerInstanceRef.current.video.removeEventListener(
              "canplay",
              checkReadyState
            );
          }
        };
        artPlayerInstanceRef.current.video.addEventListener(
          "canplay",
          checkReadyState
        );
      }
    });

    // Handle pause events
    artPlayerInstanceRef.current.on("pause", () => {
      // Only show play button if not fast forwarding and not during initial loading
      if (
        !isFastForwarding &&
        !(
          isActive &&
          playstart &&
          artPlayerInstanceRef.current &&
          typeof artPlayerInstanceRef.current.currentTime === "number" &&
          artPlayerInstanceRef.current.currentTime < 0.5
        )
      ) {
        showPlayButton();
      }
    });

    // Handle video pause events
    artPlayerInstanceRef.current.on("video:pause", () => {
      // Only show play button if not during initial loading
      if (
        !isFastForwarding &&
        !(
          isActive &&
          playstart &&
          artPlayerInstanceRef.current &&
          typeof artPlayerInstanceRef.current.currentTime === "number" &&
          artPlayerInstanceRef.current.currentTime < 0.5
        )
      ) {
        showPlayButton();
      }
    });

    // Add initial loading state handler - critical for preventing flicker
    artPlayerInstanceRef.current.on("video:loadstart", () => {
      // Show loading indicator during initial load
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "block";

      // Hide play button during initial loading when autoplay is expected
      if (isActive && playstart) {
        hidePlayButton();
      }

      // Ensure the poster is properly set and visible during initial loading
      if (artPlayerInstanceRef.current && thumbnail) {
        artPlayerInstanceRef.current.poster = thumbnail;

        // Always ensure poster is visible during initial loading - use single animation frame
        requestAnimationFrame(() => {
          const posterElement = artPlayerInstanceRef.current.template.$poster;

          // Apply all styles in a single operation to prevent flickering
          posterElement.style.cssText += `
            display: block !important;
            visibility: visible !important;
            transition: opacity 1s ease-out !important;
            -webkit-transition: opacity 1s ease-out !important;
            opacity: 1 !important;
          `;

          posterElement.classList.add("art-poster-with-transition");
        });
      }
    });

    // Add canplay event to hide loading indicator and show play button if needed
    artPlayerInstanceRef.current.on("video:canplay", () => {
      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;

      if (loadingIndicator) loadingIndicator.style.display = "none";

      // Only show play button if:
      // 1. Video is not playing AND
      // 2. Not fast forwarding AND
      // 3. Not attempting autoplay during initial loading
      if (
        artPlayerInstanceRef.current &&
        !artPlayerInstanceRef.current.playing &&
        !isFastForwarding &&
        !(
          isActive &&
          playstart &&
          artPlayerInstanceRef.current.currentTime < 0.5
        )
      ) {
        // showPlayButton();
      } else {
        hidePlayButton();
      }
    });

    artPlayerInstanceRef.current.on("video:ended", () => {
      // Clear saved position when video ends
      if (user?.token && post_id) {
        try {
          const positionsJson =
            localStorage.getItem(VIDEO_POSITIONS_KEY) || "{}";
          const positions = JSON.parse(positionsJson);

          // Remove position for this video
          if (positions[post_id]) {
            delete positions[post_id];
            localStorage.setItem(
              VIDEO_POSITIONS_KEY,
              JSON.stringify(positions)
            );
          }
        } catch (error) {
          console.error("Failed to clear video position:", error);
        }
      }

      // Stop position saving
      stopPositionSaving();
    });

    // Add error handler to keep poster visible on error
    artPlayerInstanceRef.current.on("error", () => {
      showPoster();
      showPlayButton();
    });

    // When video is paused after attempting to play, ensure poster is visible
    // artPlayerInstanceRef.current.on("video:stalled", () => {
    //   if (!artPlayerInstanceRef.current?.playing) {
    //     showPoster();
    //     showPlayButton();
    //   }
    // });

    // Keep poster visible if video waiting for data
    artPlayerInstanceRef.current.on("video:waiting", function () {
      // Only show poster if at the beginning of the video (not mid-playback buffering)
      if (
        artPlayerInstanceRef.current &&
        artPlayerInstanceRef.current.currentTime < 0.5 &&
        !artPlayerInstanceRef.current.playing
      ) {
        showPoster();
      }
    });
  };

  // Setup watch timer function
  const setupWatchTimer = () => {
    // Clear any existing timer first
    cleanupWatchTimer();

    // Set up a new timer
    watchTimerRef.current = setInterval(() => {
      watchedTimeRef.current += 1; // Increment watched time every second

      // Trigger API call after 5 seconds of playback
      if (watchedTimeRef.current >= 5 && !apiCalledRef.current && !type) {
        handleWatchHistory();
        // Stop the timer after we've reached 5 seconds and made the API call
        cleanupWatchTimer();
      }
    }, 1000); // Update every second
  };

  // Cleanup watch timer function
  const cleanupWatchTimer = () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
      watchTimerRef.current = null;
    }
  };

  // Update the event handlers to use the new functions
  artPlayerInstanceRef.current?.on("play", () => {
    setupWatchTimer();
  });

  artPlayerInstanceRef.current?.on("pause", () => {
    cleanupWatchTimer();
  });

  // Add a function to safely fade out the poster only when video is confirmed playing
  const safeFadePosterOut = (force = false) => {
    setIsPosterVisible(false);
    if (!artPlayerInstanceRef.current?.template?.$poster) return;

    const posterElement = artPlayerInstanceRef.current.template.$poster;
    const videoElement = artPlayerInstanceRef.current.video;

    if (!videoElement) return;

    // Use requestAnimationFrame to ensure style changes are batched properly
    requestAnimationFrame(() => {
      // Ensure transition is applied before changing opacity
      if (!posterElement.classList.contains("art-poster-with-transition")) {
        posterElement.style.cssText += `
          transition: opacity 1s ease-out !important;
          -webkit-transition: opacity 1s ease-out !important;
          visibility: visible !important;
          display: block !important;
        `;
        posterElement.classList.add("art-poster-with-transition");
        // Force a reflow to ensure transition is applied
        void posterElement.offsetWidth;
      }

      // Only fade out if:
      // 1. We're forcing it (from a known good state) OR
      // 2. The video is actually ready to play AND either playing or has buffered content
      if (
        force ||
        (videoElement.readyState >= 3 &&
          (artPlayerInstanceRef.current.playing ||
            videoElement.buffered.length > 0))
      ) {
        posterElement.style.cssText += `opacity: 0 !important;`;
      }
    });
  };

  // Explicitly show poster with animation
  const showPoster = () => {
    setIsPosterVisible(true);
    if (!artPlayerInstanceRef.current?.template?.$poster) return;

    const posterElement = artPlayerInstanceRef.current.template.$poster;

    // Use requestAnimationFrame to ensure styles are applied together
    requestAnimationFrame(() => {
      // Apply all styles in a single operation
      posterElement.style.cssText += `
        display: block !important;
        visibility: visible !important;
        transition: opacity 1s ease-out !important;
        -webkit-transition: opacity 1s ease-out !important;
      `;

      if (!posterElement.classList.contains("art-poster-with-transition")) {
        posterElement.classList.add("art-poster-with-transition");
      }

      // Force a reflow to ensure style changes are processed
      void posterElement.offsetWidth;

      // Now set opacity in a separate frame to ensure transition happens
      requestAnimationFrame(() => {
        posterElement.style.cssText += `opacity: 1 !important;`;
      });
    });
  };

  useEffect(() => {
    if (!spriteImageUrlRef.current && video.sprite_url) {
      loadAndDecryptSprite();
    }
  }, [video?.sprite_url]);

  // Handle active state changes
  useEffect(() => {
    if (!playerContainerRef.current) return;

    if (isActive) {
      // if (!spriteImageUrlRef.current && video.sprite_url) {
      //   loadAndDecryptSprite();
      // }
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

      //initializePlayer();

      attemptPlay();

      // Set quality to auto for active video
      if (hlsRef.current) {
        hlsRef.current.currentLevel = -1;
      }
    } else {
      // Clear watch timer and reset counters when component becomes inactive
      cleanupWatchTimer();
      // Reset watch time tracking when switching videos
      watchedTimeRef.current = 0;
      apiCalledRef.current = false;

      // Cleanup when inactive
      if (artPlayerInstanceRef.current) {
        artPlayerInstanceRef.current.destroy();
        artPlayerInstanceRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && playstart && !newStart) {
      // Add a small delay to ensure the player is fully initialized
      setTimeout(() => {
        attemptPlay();
      }, 100);
      setnewStart(true);
    }
  }, [isActive, playstart]);

  // Track user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      localStorage.setItem("userInteracted", "true");
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("scroll", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  // Initialize player when component mounts
  useEffect(() => {
    // initializePlayer();
    const container = playerContainerRef.current;

    if (!container) return;

    // Force progress bar visibility after a short delay
    // This helps with Chrome visibility issues
    const progressBarVisibilityTimer = setTimeout(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.opacity = "1";
        progressBarRef.current.style.display = "block";

        // Add Chrome-specific styles
        const isChrome =
          /Chrome/.test(navigator.userAgent) &&
          /Google Inc/.test(navigator.vendor);
        if (isChrome) {
          // Add styles to the head
          const styleEl = document.createElement("style");
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
              attributeFilter: ["style", "class"],
            });

            // Return cleanup function
            return () => {
              observer.disconnect();
            };
          }
        }
      }
    }, 500);

    // Observer for initializing the player
    const initObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !artPlayerInstanceRef.current) {
            // if (width > height) {
            //   setPImg(true);
            // } else {
            //   setPImg(false);
            // }
            initializePlayer();
          }
        });
      },
      {
        rootMargin: "200px 0px", // Start initializing slightly before entering viewport
        threshold: 0.5, // Trigger when at least 1% of the element is visible
      }
    );

    // Observe the player container for both initialization and autoplay
    initObserver.observe(container);

    return () => {
      initObserver.disconnect();

      clearTimeout(progressBarVisibilityTimer);
      // Clear the watch timer when component unmounts
      cleanupWatchTimer();
      // Reset API called flag to ensure proper tracking for next mount
      apiCalledRef.current = false;
      watchedTimeRef.current = 0;

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
      playIconRef.current.style.display = "none";
    }

    // Also hide the template play indicator
    if (artPlayerInstanceRef.current?.template?.$state) {
      const playIndicator =
        artPlayerInstanceRef.current.template.$state.querySelector(
          ".video-play-indicator"
        ) as HTMLDivElement;
      if (playIndicator) playIndicator.style.display = "none";
    }
  };

  const showPlayButton = () => {
    if (playIconRef.current) {
      playIconRef.current.style.display = "block";
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
      progressBarRef.current.style.opacity = "0";
      progressBarRef.current.style.display = "none";
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

    // Ensure progress bar is visible during fast forward
    if (progressBarRef.current) {
      progressBarRef.current.style.opacity = "1";
      progressBarRef.current.style.display = "block";
    }

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

  const attemptPlay = () => {
    if (!artPlayerInstanceRef.current) return;

    if (playstart) {
      // Ensure poster is visible and loading indicator is shown during play attempt
      showPoster();

      const loadingIndicator =
        artPlayerInstanceRef.current?.template?.$loading?.querySelector(
          ".video-loading-indicator"
        ) as HTMLDivElement;
      if (loadingIndicator) loadingIndicator.style.display = "block";

      // Hide play button during initial autoplay attempt
      hidePlayButton();

      // For HLS videos, make sure video is loaded before attempting play
      if (hlsRef.current) {
        // Ensure HLS has loaded enough data
        const videoElement = artPlayerInstanceRef.current.video;
        const buffered = videoElement.buffered;

        if (buffered && buffered.length > 0) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          const currentTime = videoElement.currentTime || 0;

          // If we have enough buffered data, play
          if (bufferedEnd - currentTime > 1) {
            artPlayerInstanceRef.current
              .play()
              .then(() => {
                // Play succeeded - hide loading indicator and wait for video frames
                if (loadingIndicator) loadingIndicator.style.display = "none";
                hidePlayButton();

                // Only fade out poster when we have actual frames
                setTimeout(() => {
                  if (
                    artPlayerInstanceRef.current?.video &&
                    artPlayerInstanceRef.current.video.readyState >= 3
                  ) {
                    safeFadePosterOut(true);
                  }
                }, 100);
              })
              .catch((error) => {
                console.error("Video play failed:", error);

                // Play failed - hide loading indicator and show play button
                if (loadingIndicator) loadingIndicator.style.display = "none";
                showPlayButton();

                // Keep poster visible on error
                showPoster();
              });
          } else {
            // Not enough buffered data yet, wait a bit and try again
            setTimeout(attemptPlay, 500);
          }
        } else {
          // No buffered data yet, wait a bit and try again
          setTimeout(attemptPlay, 500);
        }
      } else {
        // For non-HLS videos, just try to play
        artPlayerInstanceRef.current
          .play()
          .then(() => {
            // Play succeeded - hide loading indicator and wait for video frames
            if (loadingIndicator) loadingIndicator.style.display = "none";
            hidePlayButton();

            // Only fade out poster when we have actual frames
            setTimeout(() => {
              if (
                artPlayerInstanceRef.current?.video &&
                artPlayerInstanceRef.current.video.readyState >= 3
              ) {
                safeFadePosterOut(true);
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Video play failed:", error);

            // Play failed - hide loading indicator and show play button
            if (loadingIndicator) loadingIndicator.style.display = "none";
            showPlayButton();

            // Keep poster visible on error
            showPoster();

            // Handle autoplay blocking specifically
            if (error.name === "NotAllowedError") {
              if (artPlayerInstanceRef.current) {
                artPlayerInstanceRef.current.pause();
                // Show controls to allow manual play
                artPlayerInstanceRef.current.controls.show = true;
              }
            }
          });
      }
    }
  };
  const [isPosterVisible, setIsPosterVisible] = useState(true);

  // useEffect(() => {
  //   if (blackScreenRef.current) {
  //     const shouldShow = p_img && isPosterVisible;
  //     blackScreenRef.current.style.display = shouldShow ? "block" : "none";
  //     blackScreenRef.current.style.backgroundColor = shouldShow
  //       ? "black"
  //       : "transparent";
  //   }
  // }, [p_img, isPosterVisible]);

  return (
    <>
      <div
        className="black-screen-layer"
        ref={blackScreenRef}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: " 100%",
          height: "100%",
          backgroundColor: p_img && isPosterVisible ? "black" : "transparent",
          display: p_img && isPosterVisible ? "block" : "none",
          zIndex: "11",
        }}
      ></div>
      <div
        ref={playerContainerRef}
        className={`video_player w-full ${p_img ? "poster_change" : ""}`}
        style={{ minHeight: "200px" }} // Add minimum height to prevent collapse
      ></div>
    </>
  );
};

export default Player;
