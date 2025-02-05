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
            console.log(artPlayerInstanceRef?.current);
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
//   const hlsRef = useRef<Hls | null>(null);
//   const { mute } = useSelector((state: any) => state.muteSlice);

//   const [isDragging, setIsDragging] = useState(false);
//   const [dragPosition, setDragPosition] = useState(0);

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
//         {
//           html: '<div class="drag-progress-layer"></div>',
//           style: {
//             position: "absolute",
//             bottom: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             background: "transparent",
//             zIndex: "100",
//           },
//           mounted: (element) => {
//             let startX = 0;
//             let videoElement = artPlayerInstanceRef.current?.video;
//             element.addEventListener("mousedown", (e) => {
//               console.log("d");
//               startX = e.clientX;
//               setIsDragging(true);
//               element.style.cursor = "pointer"; // Change cursor during drag
//             });

//             document.addEventListener("mousemove", (e) => {
//               console.log("m");
//               if (isDragging && videoElement) {
//                 const dragDistance = e.clientX - startX;
//                 const videoWidth = element.offsetWidth;
//                 const progress = Math.min(
//                   Math.max(dragDistance / videoWidth, 0),
//                   1
//                 );
//                 setDragPosition(progress);
//                 videoElement.currentTime = videoElement.duration * progress;
//               }
//             });

//             document.addEventListener("mouseup", () => {
//               setIsDragging(false);
//               element.style.cursor = "default"; // Reset cursor
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

//     const initObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !artPlayerInstanceRef.current) {
//             initializeArtplayer();
//           }
//         });
//       },
//       {
//         rootMargin: "0px",
//         threshold: 0.01,
//       }
//     );

//     initObserver.observe(container);

//     return () => {
//       initObserver.disconnect();
//       if (artPlayerInstanceRef.current) {
//         artPlayerInstanceRef.current.destroy();
//         artPlayerInstanceRef.current = null;
//       }
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [src]);

//   useEffect(() => {
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.muted = mute;
//     }
//   }, [mute]);

//   return (
//     <div ref={playerContainerRef} className={`video_player w-full`}>
//       <div
//         className="progress-bar"
//         style={{
//           width: `${dragPosition * 100}%`,
//           background: "rgba(255, 255, 255, 0.8)",
//           height: "3px",
//         }}
//       />
//     </div>
//   );
// };

// export default Player;
