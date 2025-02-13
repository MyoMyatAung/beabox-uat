// import { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import Hls from "hls.js";
// import indicator from "../indicator.svg";
// import vod_loader from "../vod_loader.gif";
// import { useSelector } from "react-redux";

// const Player = ({
//   src,
//   thumbnail,
//   setWidth,
//   setHeight,
//   handleLike,
// }: {
//   src: string;
//   thumbnail: string;
//   setWidth: (width: number) => void;
//   setHeight: (height: number) => void;
//   handleLike: () => void;
// }) => {
//   const playerContainerRef = useRef<HTMLDivElement | null>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const hlsRef = useRef<Hls | null>(null); // HLS instance for `src`
//   const { mute } = useSelector((state: any) => state.muteSlice);
//   const [isPaused, setIsPaused] = useState(false);
//   const playIconRef = useRef<HTMLDivElement | null>(null); // Reference to the play icon

//   // Initialize Artplayer for the current video
//   const initializeArtplayer = () => {
//     if (!playerContainerRef.current || artPlayerInstanceRef.current) return;

//     Artplayer.DBCLICK_FULLSCREEN = false;
//     Artplayer.MOBILE_DBCLICK_PLAY = false;
//     Artplayer.MOBILE_CLICK_PLAY = true;

//     artPlayerInstanceRef.current = new Artplayer({
//       autoOrientation: true,
//       container: playerContainerRef.current,
//       url: src,
//       volume: 0.5,
//       muted: mute,
//       autoplay: false,
//       fullscreenWeb: true,
//       moreVideoAttr: {
//         playsInline: true,
//         preload: "metadata",
//       },

//       // flip: true,
//       aspectRatio: true,
//       fullscreen: false,
//       theme: "#d53ff0",
//       customType: {
//         m3u8: (videoElement, url) => {
//           if (Hls.isSupported()) {
//             const hls = new Hls({
//               maxBufferLength: 30, // Limit buffer to 30 seconds of video
//             });
//             hls.loadSource(url);
//             hls.attachMedia(videoElement);
//             hlsRef.current = hls; // Store the Hls instance
//           } else if (
//             videoElement.canPlayType("application/vnd.apple.mpegurl")
//           ) {
//             videoElement.src = url;
//           }
//         },
//       },
//       icons: {
//         loading: `<img width="100" height="100" src=${vod_loader}>`,
//         state: "",
//       },
//       layers: [
//         {
//           html: `<div class="custom-play-icon">
//                     <img src="${indicator}" width="50" height="50" alt="Play">
//                  </div>`,
//           style: {
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "999999",
//             display: "none", // Initially hidden
//           },
//           mounted: (element) => {
//             playIconRef.current = element; // Store reference to custom play button

//             // Click the play button to resume video
//             playIconRef?.current?.addEventListener("click", () => {
//               artPlayerInstanceRef.current?.play();
//             });
//           },
//         },
//         {
//           html: '<div class="click-layer"></div>',
//           style: {
//             position: "absolute",
//             top: "0",
//             left: "0",
//             width: "90%",
//             height: "85%",
//             zIndex: "10",
//             background: "transparent",
//           },
//           mounted: (element) => {
//             let lastClick = 0;
//             let singleClickTimeout: NodeJS.Timeout | null = null;

//             // Add event listener to handle both single and double clicks
//             element.addEventListener("click", () => {
//               const now = Date.now();
//               if (now - lastClick <= 300) {
//                 // Double-click detected
//                 if (singleClickTimeout) clearTimeout(singleClickTimeout); // Cancel single-click action
//                 handleLike(); // Call the double-click function
//               } else {
//                 // Single-click: set a timeout to execute play/pause
//                 singleClickTimeout = setTimeout(() => {
//                   artPlayerInstanceRef.current?.toggle(); // Play or pause on single click
//                 }, 300); // Wait for 300ms to ensure it's not a double-click
//               }
//               lastClick = now; // Update last click timestamp
//             });
//           },
//         },
//       ],
//     });

//     artPlayerInstanceRef.current.on("pause", () => {
//       setIsPaused(true);
//       if (playIconRef.current) playIconRef.current.style.display = "block";
//     });

//     // **Hide Play Icon When Video is Playing**
//     artPlayerInstanceRef.current.on("play", () => {
//       setIsPaused(false);
//       if (playIconRef.current) playIconRef.current.style.display = "none";
//     });

//     artPlayerInstanceRef.current.on("error", () => {
//       console.error("Error in Artplayer");
//     });
//   };

// useEffect(() => {
//   const container = playerContainerRef.current;

//   if (!container) return;

//   // Observer for initializing the player
//   const initObserver = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting && !artPlayerInstanceRef.current) {
//           initializeArtplayer(); // Initialize Artplayer for the current video
//         }
//       });
//     },
//     {
//       rootMargin: "0px", // Start initializing slightly before entering viewport
//       threshold: 0.01, // Trigger when at least 1% of the element is visible
//     }
//   );

//   // Observer for autoplay functionality
//   const autoplayObserver = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//         } else {
//           if (artPlayerInstanceRef.current) {
//             artPlayerInstanceRef.current.video.src = "";
//             artPlayerInstanceRef.current.destroy();
//             artPlayerInstanceRef.current = null;
//             //(artPlayerInstanceRef.current as any)?.pause();
//           }
//         }
//       });
//     },
//     {
//       rootMargin: "0px", // Trigger exactly at the edge of the viewport
//       threshold: 0.01, // Trigger when 50% of the element is visible
//     }
//   );
//   const autoplayObserver1 = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           // Handle ready and play events for dimension updates
//           (artPlayerInstanceRef.current as any)?.on("ready", () => {
//             setWidth(
//               (artPlayerInstanceRef.current as Artplayer)?.video
//                 ?.videoWidth || 0
//             );
//             setHeight(
//               (artPlayerInstanceRef.current as Artplayer)?.video
//                 ?.videoHeight || 0
//             );
//           });

//           (artPlayerInstanceRef.current as any)?.on("play", () => {
//             setWidth(
//               (artPlayerInstanceRef.current as Artplayer)?.video?.videoWidth
//             );
//             setHeight(
//               (artPlayerInstanceRef.current as Artplayer)?.video?.videoHeight
//             );
//           });
//           (artPlayerInstanceRef.current as any)?.play();
//         } else {
//           if (artPlayerInstanceRef.current) {
//             // artPlayerInstanceRef.current.video.src = "";
//             // artPlayerInstanceRef.current.destroy();
//             // artPlayerInstanceRef.current = null;
//             (artPlayerInstanceRef.current as any)?.pause();
//           }
//         }
//       });
//     },
//     {
//       rootMargin: "200px", // Trigger exactly at the edge of the viewport
//       threshold: 0.5, // Trigger when 50% of the element is visible
//     }
//   );

//   // Observe the player container for both initialization and autoplay
//   initObserver.observe(container);
//   autoplayObserver.observe(container);
//   autoplayObserver1.observe(container);

//   return () => {
//     initObserver.disconnect();
//     autoplayObserver.disconnect();
//     autoplayObserver1.disconnect();

//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.destroy();
//       artPlayerInstanceRef.current = null;
//     }

//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
//   };
// }, [src]); // Re-run when `src` changes

//   useEffect(() => {
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.muted = mute;
//     }
//   }, [mute]);
// useEffect(() => {
//   if (artPlayerInstanceRef.current) {
//     artPlayerInstanceRef.current.fullscreenWeb = rotate;
//   }
// }, [rotate]); // This effect runs whenever `mute` changes

//   return <div ref={playerContainerRef} className={`video_player w-full `} />;
// };

// export default Player;

import { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../indicator.svg";
import vod_loader from "../vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { useWatchtPostMutation } from "../services/homeApi";
import { showToast } from "../services/errorSlice";

const Player = ({
  src,
  thumbnail,
  setWidth,
  setHeight,
  handleLike,
  sethideBar,
  rotate,
  post_id,
}: {
  src: string;
  thumbnail: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  handleLike: () => void;
  sethideBar: any;
  post_id: any;
  rotate: any;
}) => {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { mute } = useSelector((state: any) => state.muteSlice);
  const user = useSelector((state: any) => state.persist.user);
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

  const dispatch = useDispatch();

  useEffect(() => {
    muteRef.current = mute; // Update muteRef when mute state changes
  }, [mute]);

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
      apiCalledRef.current = true; // Mark API as called
      watchtPost({ post_id: post_id }) // Replace with actual post ID
        .unwrap()
        .then(() => console.log("Watch history updated"))
        .catch((error) =>
          console.error("Failed to update watch history", error)
        );
    }
  };

  // Initialize Artplayer for the current video
  const initializeArtplayer = () => {
    if (!playerContainerRef.current || artPlayerInstanceRef.current) return;

    Artplayer.DBCLICK_FULLSCREEN = false;
    Artplayer.MOBILE_DBCLICK_PLAY = false;
    Artplayer.MOBILE_CLICK_PLAY = true;

    artPlayerInstanceRef.current = new Artplayer({
      autoOrientation: true,
      container: playerContainerRef.current,
      url: src,
      volume: 0.5,
      loop: true,
      muted: mute,
      autoplay: false,
      fullscreenWeb: true,
      moreVideoAttr: {
        playsInline: true,
        preload: "metadata",
      },
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      customType: {
        m3u8: (videoElement, url) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 30,
            });
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hlsRef.current = hls;
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoElement.src = url;
          }
        },
      },
      icons: {
        loading: `<img width="100" height="100" src=${vod_loader}>`,
        state: "",
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
          // mounted: (element) => {
          //   progressBarRef.current = element.querySelector(
          //     ".custom-progress-bar"
          //   ) as HTMLInputElement;
          //   timeDisplayRef.current = element.querySelector(
          //     ".custom-time-display"
          //   ) as HTMLDivElement;

          //   if (!progressBarRef.current) {
          //     console.error("Custom progress bar or tooltip element not found");
          //     return;
          //   }

          //   progressBarRef.current.value = "0"; // Ensure progress starts at 0
          //   progressBarRef.current.style.opacity = "0"; // Hide thumb initially

          //   // Handle input (while dragging)
          //   progressBarRef.current.addEventListener("input", (e) => {
          //     if (!artPlayerInstanceRef.current) return;

          //     // If not already dragging, set the flag to true (start of dragging)
          //     if (!isDraggingRef.current) {
          //       sethideBar(true);
          //       if (progressBarRef.current) {
          //         progressBarRef.current.style.height = "10px";
          //         progressBarRef.current.style.setProperty(
          //           "--thumb-width",
          //           "16px"
          //         );
          //         progressBarRef.current.style.setProperty(
          //           "--thumb-height",
          //           "20px"
          //         );
          //         progressBarRef.current.style.setProperty(
          //           "--thumb-radius",
          //           "5px"
          //         );
          //       }
          //       isDraggingRef.current = true;
          //       timeDisplayRef.current!.style.display = "block"; // Show time display
          //     }

          //     const value = parseFloat((e.target as HTMLInputElement).value);
          //     seekTimeRef.current =
          //       (value / 100) * artPlayerInstanceRef.current.duration;

          //     progressBarRef.current!.style.setProperty(
          //       "--progress",
          //       `${value}%`
          //     );

          //     // Update time display text
          //     if (timeDisplayRef.current) {
          //       const currentTime = formatTime(seekTimeRef.current);
          //       const duration = formatTime(
          //         artPlayerInstanceRef.current.duration
          //       );
          //       timeDisplayRef.current.textContent = `${currentTime} / ${duration}`;
          //     }
          //   });

          //   // Handle change (end dragging)
          //   progressBarRef.current.addEventListener("change", () => {
          //     if (!artPlayerInstanceRef.current || !isDraggingRef.current)
          //       return;

          //     isDraggingRef.current = false; // End of dragging
          //     sethideBar(false);
          //     if (progressBarRef.current) {
          //       progressBarRef.current.style.height = "4px";
          //       progressBarRef.current.style.setProperty(
          //         "--thumb-width",
          //         "12px"
          //       );
          //       progressBarRef.current.style.setProperty(
          //         "--thumb-height",
          //         "12px"
          //       );
          //       progressBarRef.current.style.setProperty(
          //         "--thumb-radius",
          //         "50%"
          //       );
          //     }
          //     timeDisplayRef.current!.style.display = "none"; // Hide time display
          //     artPlayerInstanceRef.current.currentTime = seekTimeRef.current;
          //   });
          // },
          mounted: (element) => {
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

            // Desktop events (existing)
            progressBarRef.current.addEventListener("input", (e) => {
              if (!artPlayerInstanceRef.current) return;
              if (!isDraggingRef.current) {
                sethideBar(true);
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
              sethideBar(false);
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

            // Allow clicking anywhere in the container (for desktop)
            element.addEventListener("click", (e) => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current)
                return;

              // If the click is directly on the thumb, let its own events handle it.
              if (
                (e.target as HTMLElement).classList.contains(
                  "custom-progress-bar"
                )
              ) {
                return;
              }
              const rect = element.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percent = Math.min(
                Math.max((clickX / rect.width) * 100, 0),
                100
              );

              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty(
                "--progress",
                `${percent}%`
              );
              const newTime =
                (percent / 100) * artPlayerInstanceRef.current.duration;
              artPlayerInstanceRef.current.currentTime = newTime;
            });

            // ==== Mobile Touch Events ====

            // Start dragging on touchstart
            element.addEventListener("touchstart", (e) => {
              if (!artPlayerInstanceRef.current || !progressBarRef.current)
                return;
              // Use the first touch
              const touch = e.touches[0];
              const rect = element.getBoundingClientRect();
              const touchX = touch.clientX - rect.left;
              const percent = Math.min(
                Math.max((touchX / rect.width) * 100, 0),
                100
              );

              // Update progress bar visuals immediately
              progressBarRef.current.value = percent.toString();
              progressBarRef.current.style.setProperty(
                "--progress",
                `${percent}%`
              );
              isDraggingRef.current = true;
              sethideBar(true);
              progressBarRef.current.style.height = "10px";
              progressBarRef.current.style.setProperty("--thumb-width", "16px");
              progressBarRef.current.style.setProperty(
                "--thumb-height",
                "20px"
              );
              progressBarRef.current.style.setProperty("--thumb-radius", "5px");
              timeDisplayRef.current!.style.display = "block";

              // Update the time display
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

            // Update progress on touchmove
            element.addEventListener("touchmove", (e) => {
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              // Prevent scrolling while dragging the progress bar
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

            // End dragging on touchend
            element.addEventListener("touchend", () => {
              if (
                !artPlayerInstanceRef.current ||
                !progressBarRef.current ||
                !isDraggingRef.current
              )
                return;
              isDraggingRef.current = false;
              sethideBar(false);
              progressBarRef.current.style.height = "4px";
              progressBarRef.current.style.setProperty("--thumb-width", "12px");
              progressBarRef.current.style.setProperty(
                "--thumb-height",
                "12px"
              );
              progressBarRef.current.style.setProperty("--thumb-radius", "50%");
              timeDisplayRef.current!.style.display = "none";
              // Set the video time to the position chosen via touch
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
          mounted: (element) => {
            playIconRef.current = element; // Store reference to custom play button

            // Handle play/pause events
            artPlayerInstanceRef.current?.on("pause", () => {
              setIsPaused(true);

              if (element) element.style.display = "block";
            });

            artPlayerInstanceRef.current?.on("play", () => {
              // progressBarRef?.current?.classList.remove("hidden");
              setIsPaused(false);
              if (element) elementstyle.display = "none";
            });

            // Click the play button to resume video
            playIconRef?.current?.addEventListener("click", () => {
              artPlayerInstanceRef.current?.play();
            });
            // playIconRef?.current = element;
            // playIconRef?.current?.addEventListener("click", () => {
            //   artPlayerInstanceRef.current?.play();
            // });
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
          mounted: (element) => {
            let lastClick = 0;
            let singleClickTimeout: NodeJS.Timeout | null = null;

            element.addEventListener("click", () => {
              const now = Date.now();
              if (now - lastClick <= 300) {
                if (singleClickTimeout) clearTimeout(singleClickTimeout);
                if (user?.token) {
                  handleLike();
                } else {
                  //  setCommentCount((prev: any) => +prev + 1);
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
    });

    // Update progress bar while video is playing
    artPlayerInstanceRef.current?.on("video:timeupdate", () => {
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
        // Track watched time
        watchedTimeRef.current = currentTime;
        if (watchedTimeRef.current >= 60 && !apiCalledRef.current) {
          handleWatchHistory(); // Call API after 1 minute
        }
      }
    });
    artPlayerInstanceRef?.current?.on("loading", () => {
      if (playIconRef.current) playIconRef.current.style.display = "none";
    });

    artPlayerInstanceRef.current.on("ready", () => {
      if (!artPlayerInstanceRef.current?.playing) {
        if (playIconRef.current) playIconRef.current.style.display = "block";
      } else {
        if (playIconRef.current) playIconRef.current.style.display = "none";
      }
      if (progressBarRef?.current) {
        if (progressBarRef.current) {
          progressBarRef.current.style.opacity = "1";
        }
      }
    });

    // Handle play/pause events
    artPlayerInstanceRef.current.on("pause", () => {
      setIsPaused(true);
      if (playIconRef.current) playIconRef.current.style.display = "block";
    });

    artPlayerInstanceRef.current.on("play", () => {
      setIsPaused(false);
      if (playIconRef.current) playIconRef.current.style.display = "none";
    });

    artPlayerInstanceRef.current.on("error", () => {
      console.error("Error in Artplayer");
    });
  };

  useEffect(() => {
    const container = playerContainerRef.current;

    if (!container) return;

    // Observer for initializing the player
    const initObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !artPlayerInstanceRef.current) {
            initializeArtplayer(); // Initialize Artplayer for the current video
          }
        });
      },
      {
        rootMargin: "0px", // Start initializing slightly before entering viewport
        threshold: 0.01, // Trigger when at least 1% of the element is visible
      }
    );

    // Observer for autoplay functionality
    const autoplayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
          } else {
            if (artPlayerInstanceRef.current) {
              artPlayerInstanceRef.current.video.src = "";
              artPlayerInstanceRef.current.destroy();
              artPlayerInstanceRef.current = null;
              //(artPlayerInstanceRef.current as any)?.pause();
            }
          }
        });
      },
      {
        rootMargin: "0px", // Trigger exactly at the edge of the viewport
        threshold: 0.01, // Trigger when 50% of the element is visible
      }
    );
    const autoplayObserver1 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsplay(true);

            // Handle ready and play events for dimension updates
            (artPlayerInstanceRef.current as any)?.on("ready", () => {
              setWidth(
                (artPlayerInstanceRef.current as Artplayer)?.video
                  ?.videoWidth || 0
              );
              setHeight(
                (artPlayerInstanceRef.current as Artplayer)?.video
                  ?.videoHeight || 0
              );
              (artPlayerInstanceRef.current as any)?.play();
            });

            (artPlayerInstanceRef.current as any)?.on("play", () => {
              setWidth(
                (artPlayerInstanceRef.current as Artplayer)?.video?.videoWidth
              );
              setHeight(
                (artPlayerInstanceRef.current as Artplayer)?.video?.videoHeight
              );
            });
            (artPlayerInstanceRef.current as any)?.play();
            if (artPlayerInstanceRef.current) {
              (artPlayerInstanceRef.current as any).muted = muteRef.current;
            }
          } else {
            if (artPlayerInstanceRef.current) {
              setIsplay(false);
              // artPlayerInstanceRef.current.video.src = "";
              // artPlayerInstanceRef.current.destroy();
              // artPlayerInstanceRef.current = null;
              (artPlayerInstanceRef.current as any)?.pause();

              if (artPlayerInstanceRef.current) {
                (artPlayerInstanceRef.current as any).muted = muteRef.current;
              }
            }
          }
        });
      },
      {
        rootMargin: "200px", // Trigger exactly at the edge of the viewport
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    // Observe the player container for both initialization and autoplay
    initObserver.observe(container);
    autoplayObserver.observe(container);
    autoplayObserver1.observe(container);

    return () => {
      initObserver.disconnect();
      autoplayObserver.disconnect();
      autoplayObserver1.disconnect();

      if (artPlayerInstanceRef.current) {
        artPlayerInstanceRef.current.destroy();
        artPlayerInstanceRef.current = null;
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]); // Re-run when `src` changes
  useEffect(() => {
    if (isPlay) {
      artPlayerInstanceRef?.current?.play();
    }
  }, [isPlay]);

  useEffect(() => {
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.muted = mute;
    }
  }, [mute]);

  useEffect(() => {
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.fullscreen = rotate;
    }
  }, [rotate]); // This effect runs whenever `mute` changes

  return <div ref={playerContainerRef} className={`video_player w-full`} />;
};

export default Player;
