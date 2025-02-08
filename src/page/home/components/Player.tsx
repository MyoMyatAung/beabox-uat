import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../indicator.svg";
import vod_loader from "../vod_loader.gif";
import { useSelector } from "react-redux";

const Player = ({
  src,
  thumbnail,
  setWidth,
  setHeight,
  handleLike,
}: {
  src: string;
  thumbnail: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  handleLike: () => void;
}) => {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null); // HLS instance for `src`
  const { mute } = useSelector((state: any) => state.muteSlice);

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
      muted: mute,
      autoplay: false,
      fullscreenWeb: true,
      moreVideoAttr: {
        playsInline: true,
        preload: "metadata",
      },

      // flip: true,
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      customType: {
        m3u8: (videoElement, url) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 30, // Limit buffer to 30 seconds of video
            });
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hlsRef.current = hls; // Store the Hls instance
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoElement.src = url;
          }
        },
      },
      icons: {
        loading: `<img width="100" height="100" src=${vod_loader}>`,
        state: `<img width="50" height="50" src=${indicator}>`,
      },
      layers: [
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

            // Add event listener to handle both single and double clicks
            element.addEventListener("click", () => {
              const now = Date.now();
              if (now - lastClick <= 300) {
                // Double-click detected
                if (singleClickTimeout) clearTimeout(singleClickTimeout); // Cancel single-click action
                handleLike(); // Call the double-click function
              } else {
                // Single-click: set a timeout to execute play/pause
                singleClickTimeout = setTimeout(() => {
                  artPlayerInstanceRef.current?.toggle(); // Play or pause on single click
                }, 300); // Wait for 300ms to ensure it's not a double-click
              }
              lastClick = now; // Update last click timestamp
            });
          },
        },
      ],
    });

    // artPlayerInstanceRef?.current?.on("click", handleClick);

    // artPlayerInstanceRef.current.on("dblclick", handleLike);

    // artPlayerInstanceRef.current.on("ready", () => {
    //   artPlayerInstanceRef?.current?.play();
    //   // setWidth(artPlayerInstanceRef.current?.video?.videoWidth || 0);
    //   // setHeight(artPlayerInstanceRef.current?.video?.videoHeight || 0);
    // });

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
            // // Handle ready and play events for dimension updates
            // (artPlayerInstanceRef.current as any)?.on("ready", () => {
            //   setWidth(
            //     (artPlayerInstanceRef.current as Artplayer)?.video
            //       ?.videoWidth || 0
            //   );
            //   setHeight(
            //     (artPlayerInstanceRef.current as Artplayer)?.video
            //       ?.videoHeight || 0
            //   );
            // });
            // (artPlayerInstanceRef.current as any)?.on("play", () => {
            //   setWidth(
            //     (artPlayerInstanceRef.current as Artplayer)?.video?.videoWidth
            //   );
            //   setHeight(
            //     (artPlayerInstanceRef.current as Artplayer)?.video?.videoHeight
            //   );
            // });
            // (artPlayerInstanceRef.current as any)?.play();
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
          } else {
            if (artPlayerInstanceRef.current) {
              // artPlayerInstanceRef.current.video.src = "";
              // artPlayerInstanceRef.current.destroy();
              // artPlayerInstanceRef.current = null;
              (artPlayerInstanceRef.current as any)?.pause();
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
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.muted = mute;
    }
  }, [mute]);
  // useEffect(() => {
  //   if (artPlayerInstanceRef.current) {
  //     artPlayerInstanceRef.current.fullscreenWeb = rotate;
  //   }
  // }, [rotate]); // This effect runs whenever `mute` changes

  return <div ref={playerContainerRef} className={`video_player w-full `} />;
};

export default Player;

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

//   // Custom progress state
//   const [progress, setProgress] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const lastSeekTimeRef = useRef(0);

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
//         state: `<img width="50" height="50" src=${indicator}>`,
//       },
//       layers: [
//         {
//           html: `
//             <div class="custom-progress-container">
//               <div class="custom-progress-bar">
//                 <div class="custom-progress-fill"></div>
//                 <div class="custom-progress-thumb"></div>
//               </div>
//             </div>
//           `,
//           style: {
//             position: "absolute",
//             bottom: "10px",
//             left: "5%",
//             width: "90%",
//             height: "10px",
//             zIndex: "15",
//           },
//           mounted: (element) => {
//             const progressBar = element.querySelector(".custom-progress-bar");
//             const progressFill = element.querySelector(".custom-progress-fill");
//             const progressThumb = element.querySelector(
//               ".custom-progress-thumb"
//             );

//             if (!progressBar || !progressFill || !progressThumb) {
//               console.error("❌ Custom progress bar elements not found");
//               return;
//             }

//             // **Update progress bar while video is playing**
//             artPlayerInstanceRef.current.on("video:timeupdate", () => {
//               if (!isDragging) {
//                 const currentTime =
//                   artPlayerInstanceRef.current?.currentTime || 0;
//                 const duration = artPlayerInstanceRef.current?.duration || 1;
//                 const newProgress = (currentTime / duration) * 100;
//                 setProgress(newProgress);
//                 progressFill.style.width = `${newProgress}%`;
//                 progressThumb.style.left = `${newProgress}%`;
//               }
//             });

//             // **Handle click on progress bar**
//             progressBar.addEventListener("click", (e) => {
//               if (!artPlayerInstanceRef.current) return;
//               const rect = progressBar.getBoundingClientRect();
//               const percentage = (e.clientX - rect.left) / rect.width;
//               const newTime =
//                 percentage * artPlayerInstanceRef.current.duration;

//               artPlayerInstanceRef.current.currentTime = newTime;
//               setProgress(percentage * 100);
//               progressFill.style.width = `${percentage * 100}%`;
//               progressThumb.style.left = `${percentage * 100}%`;
//             });

//             // **Handle drag start**
//             progressThumb.addEventListener("mousedown", (e) => {
//               setIsDragging(true);
//               e.preventDefault(); // Prevents unwanted text selection
//               document.addEventListener("mousemove", handleDragging);
//               document.addEventListener("mouseup", handleDragEnd);
//             });

//             // **Handle dragging**
//             const handleDragging = (e) => {
//               if (!artPlayerInstanceRef.current) return;
//               const rect = progressBar.getBoundingClientRect();
//               let percentage = (e.clientX - rect.left) / rect.width;

//               if (percentage < 0) percentage = 0;
//               if (percentage > 1) percentage = 1;

//               lastSeekTimeRef.current =
//                 percentage * artPlayerInstanceRef.current.duration;

//               progressFill.style.width = `${percentage * 100}%`;
//               progressThumb.style.left = `${percentage * 100}%`;
//             };

//             // **Handle drag end (seek video)**
//             const handleDragEnd = () => {
//               setIsDragging(false);
//               document.removeEventListener("mousemove", handleDragging);
//               document.removeEventListener("mouseup", handleDragEnd);

//               if (artPlayerInstanceRef.current) {
//                 artPlayerInstanceRef.current.currentTime =
//                   lastSeekTimeRef.current;
//               }
//             };
//           },

//           // mounted: (element) => {
//           //   const progressBar = element.querySelector(".custom-progress-bar");
//           //   const progressFill = element.querySelector(".custom-progress-fill");
//           //   const progressThumb = element.querySelector(
//           //     ".custom-progress-thumb"
//           //   );

//           //   if (!progressBar || !progressFill || !progressThumb) {
//           //     console.error("❌ Custom progress bar elements not found");
//           //     return;
//           //   }

//           //   // **Sync progress bar with video playback**
//           //   artPlayerInstanceRef.current?.on("video:timeupdate", () => {
//           //     if (!isDragging) {
//           //       const currentTime =
//           //         artPlayerInstanceRef.current?.currentTime || 0;
//           //       const duration = artPlayerInstanceRef.current?.duration || 1;
//           //       const newProgress = (currentTime / duration) * 100;
//           //       setProgress(newProgress);
//           //       (progressFill as HTMLElement).style.width = `${newProgress}%`;
//           //       (progressThumb as HTMLElement).style.left = `${newProgress}%`;
//           //     }
//           //   });

//           //   // **Handle click on progress bar**
//           //   progressBar.addEventListener("click", (e) => {
//           //     if (!artPlayerInstanceRef.current) return;
//           //     const rect = progressBar.getBoundingClientRect();
//           //     const percentage =
//           //       ((e as MouseEvent).clientX - rect.left) / rect.width;
//           //     const newTime =
//           //       percentage * artPlayerInstanceRef.current.duration;

//           //     artPlayerInstanceRef.current.currentTime = newTime;
//           //     setProgress(percentage * 100);
//           //     (progressFill as HTMLElement).style.width = `${
//           //       percentage * 100
//           //     }%`;
//           //     (progressThumb as HTMLElement).style.left = `${
//           //       percentage * 100
//           //     }%`;
//           //   });

//           //   // **Handle drag start**
//           //   progressThumb.addEventListener("mousedown", (e) => {
//           //     setIsDragging(true);
//           //     e.preventDefault(); // Prevents unwanted text selection
//           //     document.addEventListener("mousemove", handleDragging);
//           //     document.addEventListener("mouseup", handleDragEnd);
//           //   });

//           //   // **Handle dragging**
//           //   const handleDragging = (e: any) => {
//           //     if (!artPlayerInstanceRef.current) return;
//           //     const rect = progressBar.getBoundingClientRect();
//           //     let percentage = (e.clientX - rect.left) / rect.width;

//           //     if (percentage < 0) percentage = 0;
//           //     if (percentage > 1) percentage = 1;

//           //     lastSeekTimeRef.current =
//           //       percentage * artPlayerInstanceRef.current.duration;

//           //     (progressFill as HTMLElement).style.width = `${
//           //       percentage * 100
//           //     }%`;
//           //     (progressThumb as HTMLElement).style.left = `${
//           //       percentage * 100
//           //     }%`;
//           //   };

//           //   // **Handle drag end (seek video)**
//           //   const handleDragEnd = () => {
//           //     setIsDragging(false);
//           //     document.removeEventListener("mousemove", handleDragging);
//           //     document.removeEventListener("mouseup", handleDragEnd);

//           //     if (artPlayerInstanceRef.current) {
//           //       artPlayerInstanceRef.current.currentTime =
//           //         lastSeekTimeRef.current;
//           //     }
//           //   };
//           // },
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

//     artPlayerInstanceRef.current.on("error", () => {
//       console.error("Error in Artplayer");
//     });
//   };

//   useEffect(() => {
//     const container = playerContainerRef.current;

//     if (!container) return;

//     // Observer for initializing the player
//     const initObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !artPlayerInstanceRef.current) {
//             initializeArtplayer(); // Initialize Artplayer for the current video
//           }
//         });
//       },
//       {
//         rootMargin: "0px", // Start initializing slightly before entering viewport
//         threshold: 0.01, // Trigger when at least 1% of the element is visible
//       }
//     );

//     // Observer for autoplay functionality
//     const autoplayObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             console.log(artPlayerInstanceRef?.current);
//           } else {
//             if (artPlayerInstanceRef.current) {
//               artPlayerInstanceRef.current.video.src = "";
//               artPlayerInstanceRef.current.destroy();
//               artPlayerInstanceRef.current = null;
//             }
//           }
//         });
//       },
//       {
//         rootMargin: "0px", // Trigger exactly at the edge of the viewport
//         threshold: 0.01, // Trigger when 50% of the element is visible
//       }
//     );
//     const autoplayObserver1 = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // Handle ready and play events for dimension updates
//             (artPlayerInstanceRef.current as any)?.on("ready", () => {
//               setWidth(
//                 (artPlayerInstanceRef.current as Artplayer)?.video
//                   ?.videoWidth || 0
//               );
//               setHeight(
//                 (artPlayerInstanceRef.current as Artplayer)?.video
//                   ?.videoHeight || 0
//               );
//             });

//             (artPlayerInstanceRef.current as any)?.on("play", () => {
//               setWidth(
//                 (artPlayerInstanceRef.current as Artplayer)?.video?.videoWidth
//               );
//               setHeight(
//                 (artPlayerInstanceRef.current as Artplayer)?.video?.videoHeight
//               );
//             });
//             (artPlayerInstanceRef.current as any)?.play();
//           } else {
//             if (artPlayerInstanceRef.current) {
//               (artPlayerInstanceRef.current as any)?.pause();
//             }
//           }
//         });
//       },
//       {
//         rootMargin: "200px", // Trigger exactly at the edge of the viewport
//         threshold: 0.5, // Trigger when 50% of the element is visible
//       }
//     );

//     // Observe the player container for both initialization and autoplay
//     initObserver.observe(container);
//     autoplayObserver.observe(container);
//     autoplayObserver1.observe(container);

//     return () => {
//       initObserver.disconnect();
//       autoplayObserver.disconnect();
//       autoplayObserver1.disconnect();

//       if (artPlayerInstanceRef.current) {
//         artPlayerInstanceRef.current.destroy();
//         artPlayerInstanceRef.current = null;
//       }

//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [src]); // Re-run when `src` changes

//   useEffect(() => {
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.muted = mute;
//     }
//   }, [mute]);

//   return <div ref={playerContainerRef} className={`video_player w-full `} />;
// };

// export default Player;
