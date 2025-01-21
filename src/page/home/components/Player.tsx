import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js"; // Import HLS.js for handling m3u8 streams
import indicator from "../indicator.svg";
import vod_loader from "../vod_loader.gif";

const Player = ({
  src,
  thumbnail,
  onPlay,
  mute,
}: {
  src: any;
  thumbnail: any;
  onPlay?: () => void; // Add an optional onPlay callback
  mute: any;
}) => {
  const playerContainerRef = useRef(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (playerContainerRef.current) {
      // Initialize Artplayer directly without using lozad (no lazy load)
      if (!artPlayerInstanceRef.current) {
        Artplayer.MOBILE_DBCLICK_PLAY = false;
        Artplayer.MOBILE_CLICK_PLAY = true;
        artPlayerInstanceRef.current = new Artplayer({
          container: playerContainerRef.current,
          url: src,
          volume: 0.5,
          muted: mute,
          autoplay: true,
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
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(videoElement);
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

        // Trigger the onPlay callback when playback starts
        artPlayerInstanceRef.current.on("play", () => {
          if (onPlay) onPlay();
        });
      }

      // Handle visibility and autoplay using IntersectionObserver
      const handleIntersection = (entries: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            artPlayerInstanceRef.current?.play();
          } else {
            artPlayerInstanceRef.current?.pause();
          }
        });
      };

      const intersectionObserver = new IntersectionObserver(
        handleIntersection,
        {
          rootMargin: "200px 0px",
          threshold: 0.1,
        }
      );

      intersectionObserver.observe(playerContainerRef.current);

      return () => {
        // Clean up the Artplayer instance and observers
        if (artPlayerInstanceRef.current) {
          artPlayerInstanceRef.current.destroy();
          artPlayerInstanceRef.current = null;
        }
        if (intersectionObserver) intersectionObserver.disconnect();
      };
    }
  }, [src, thumbnail, onPlay]);
  useEffect(() => {
    // Update the mute state if the prop changes
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.muted = mute;
    }
  }, [mute]); // This effect runs whenever `mute` changes

  return <div ref={playerContainerRef} className="video_player w-full" />;
};

export default Player;
