// import { useEffect, useRef } from "react";
// import Artplayer from "artplayer";
// import Hls from "hls.js"; // Import HLS.js for handling m3u8 streams
// import lozad from "lozad"; // Import lozad library for lazy loading
// import indicator from "../indicator.svg";
// import vod_loader from "../vod_loader.gif";
// import { useSelector } from "react-redux";

// const Player = ({
//   src,
//   thumbnail,
//   onPlay,
//   setWidth,
//   setHeight,
//   handleLike,
// }: {
//   src: any;
//   thumbnail: any;
//   onPlay?: () => void; // Add an optional onPlay callback
//   setHeight: any;
//   setWidth: any;

//   handleLike: any;
// }) => {
//   const playerContainerRef = useRef(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const hlsRef = useRef<Hls | null>(null); // Store the Hls instance
//   const { mute } = useSelector((state: any) => state.muteSlice);

//   useEffect(() => {
//     if (playerContainerRef.current) {
//       let observer = lozad(playerContainerRef.current, {
//         rootMargin: "200px 0px", // Adjust rootMargin as needed
//         threshold: 0.01, // Adjust threshold as needed
//         loaded: function (el: any) {
//           console.log("loaded");
//           console.log(artPlayerInstanceRef.current);
//           if (!artPlayerInstanceRef.current) {
//             // Initialize Artplayer with m3u8 support

//             Artplayer.DBCLICK_FULLSCREEN = false;
//             Artplayer.MOBILE_DBCLICK_PLAY = false;
//             Artplayer.MOBILE_CLICK_PLAY = true;
//             artPlayerInstanceRef.current = new Artplayer({
//               autoOrientation: true,
//               container: el,
//               url: src,
//               volume: 0.5,
//               muted: mute,
//               autoplay: true,
//               fullscreenWeb: true,
//               moreVideoAttr: {
//                 playsInline: true,
//                 preload: "metadata",
//               },
//               flip: true,
//               aspectRatio: true,
//               fullscreen: false,
//               theme: "#d53ff0",
//               customType: {
//                 m3u8: (videoElement, url) => {
//                   if (Hls.isSupported()) {
//                     const hls = new Hls({
//                       maxBufferLength: 30, // Limit buffer to 30 seconds of video
//                       // maxBufferSize: 30 * 1000 * 1000, // Limit buffer size to 60 MB
//                     });
//                     hls.loadSource(url);
//                     hls.attachMedia(videoElement);
//                     hlsRef.current = hls; // Store the Hls instance
//                   } else if (
//                     videoElement.canPlayType("application/vnd.apple.mpegurl")
//                   ) {
//                     videoElement.src = url;
//                   }
//                 },
//               },
//               icons: {
//                 loading: `<img width="100" height="100" src=${vod_loader}>`,
//                 state: `<img width="50" height="50" src=${indicator}>`,
//               },
//             });

//             artPlayerInstanceRef.current.on("dblclick", (event) => {
//               handleLike(); // Custom double-click action
//             });

//             artPlayerInstanceRef.current.on("error", () => {
//               console.log("error video");
//             });
//           }
//         },
//       });

//       // Start observing for lazy loading
//       observer.observe();

//       // Handle visibility and autoplay using IntersectionObserver
//       const handleIntersection = (entries: any) => {
//         entries.forEach((entry: any) => {
// if (entry.isIntersecting) {
//   artPlayerInstanceRef?.current?.on("ready", () => {
//     setWidth(artPlayerInstanceRef?.current?.video?.videoWidth);
//     setHeight(artPlayerInstanceRef?.current?.video?.videoHeight);
//   });
//   artPlayerInstanceRef?.current?.on("play", () => {
//     setWidth(artPlayerInstanceRef?.current?.video?.videoWidth);
//     setHeight(artPlayerInstanceRef?.current?.video?.videoHeight);
//   });

//   artPlayerInstanceRef.current?.play();
// } else {
//   artPlayerInstanceRef.current?.pause();
// }
//         });
//       };

//       const intersectionObserver = new IntersectionObserver(
//         handleIntersection,
//         {
//           rootMargin: "200px 0px",
//           threshold: 0.1,
//         }
//       );

//       intersectionObserver.observe(playerContainerRef.current);

//       return () => {
//         // Clean up the Hls instance
//         if (hlsRef.current) {
//           hlsRef.current.destroy();
//           hlsRef.current = null;
//         }
//         // Clean up the Artplayer instance and observers
//         if (artPlayerInstanceRef.current) {
//           artPlayerInstanceRef.current.destroy();
//           artPlayerInstanceRef.current = null;
//         }
//         // Safely clean up IntersectionObserver
//         if (intersectionObserver) intersectionObserver.disconnect();

//         // // Safely clean up lozad observer
//         // if (observer && observer.observe) {
//         //   observer.disconnect();
//         // }
//         // Use lozad's custom API for cleanup
//         if (observer) {
//           observer = null; // Safely nullify; lozad has no explicit `disconnect`
//         }
//       };
//     }
//   }, [src, thumbnail]);

//   useEffect(() => {
//     // Update the mute state if the prop changes
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.muted = mute;
//     }
//   }, [mute]); // This effect runs whenever `mute` changes

//   return <div ref={playerContainerRef} className="video_player w-full" />;
// };

// export default Player;

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

  const clickHandlerRef = useRef({
    timestamp: 0,
    timeoutId: null as NodeJS.Timeout | null,
  });

  const handleSingleClick = () => {
    artPlayerInstanceRef.current?.toggle(); // Play or pause
  };

  const handleClick = () => {
    const now = Date.now();
    const { timestamp, timeoutId } = clickHandlerRef.current;

    if (now - timestamp <= 500) {
      // Double-click detected
      clearTimeout(timeoutId as NodeJS.Timeout); // Cancel the single-click action
      clickHandlerRef.current.timeoutId = null;
      handleLike(); // Call the double-click function
    } else {
      // Start single-click timer
      clickHandlerRef.current.timestamp = now;
      clickHandlerRef.current.timeoutId = setTimeout(() => {
        handleSingleClick(); // Call single-click action after 1 second
      }, 700); // Wait for 1 second to execute single-click
    }
  };

  // Initialize Artplayer for the current video
  const initializeArtplayer = () => {
    if (!playerContainerRef.current || artPlayerInstanceRef.current) return;

    Artplayer.DBCLICK_FULLSCREEN = false;
    Artplayer.MOBILE_DBCLICK_PLAY = false;
    Artplayer.MOBILE_CLICK_PLAY = false;

    artPlayerInstanceRef.current = new Artplayer({
      // autoOrientation: true,
      container: playerContainerRef.current,
      url: src,
      volume: 0.5,
      muted: mute,
      autoplay: false,
      // fullscreenWeb: true,
      moreVideoAttr: {
        playsInline: true,
        preload: "metadata",
      },
      flip: true,
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
    });

    artPlayerInstanceRef?.current?.on("click", handleClick);

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
            (artPlayerInstanceRef.current as any)?.pause();
          }
        });
      },
      {
        rootMargin: "200px 0px", // Trigger exactly at the edge of the viewport
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    // Observe the player container for both initialization and autoplay
    initObserver.observe(container);
    autoplayObserver.observe(container);

    return () => {
      initObserver.disconnect();
      autoplayObserver.disconnect();

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

  return <div ref={playerContainerRef} className="video_player w-full" />;
};

export default Player;
