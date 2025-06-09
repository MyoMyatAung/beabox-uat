import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { paths } from "@/routes/paths";
import { setDetails } from "@/store/slices/exploreSlice";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../page/search/search.css";
import { Heart } from "lucide-react";
import LoadingAnimation from "@/page/search/comp/LoadingAnimation";
import Hls from "hls.js";
import Artplayer from "artplayer";
import ImageWithPlaceholder1 from "@/page/explore/comp/ImgPlaceHolder1";
const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};
const VideoCard2 = ({ videoData, loadingVideoId, setLoadingVideoId }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
  const [playingVideos, setPlayingVideos] = useState<{
    [key: string]: boolean;
  }>({});

  const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout>();
  const [loadingDisable, setDisabled] = useState<string | null>(null);

  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details);
  };

  const loadHandler = () => {
    setIsLoad(true);
    setTimeout(() => setIsLoad(false), 1000);
  };

  useEffect(() => {
    loadHandler();
  }, []);
  // console.log(videoData);

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!videoData?.preview_image) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = videoData?.preview_image;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted profile photo source
        setDecryptedPhoto(decryptedStr);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [videoData?.preview_image]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  // const handleLongPress = (card: any) => {
  //   if (playingVideos[card.post_id]) return;
  //   if (!card?.preview?.url) return;

  //   // Pause any currently playing video
  //   if (activeLongPressCard) {
  //     const currentPlayer =
  //       artPlayerInstances.current[activeLongPressCard?.post_id];
  //     if (currentPlayer) {
  //       currentPlayer.muted = true;
  //       currentPlayer.pause();
  //       setPlayingVideos((prev) => ({
  //         ...prev,
  //         [activeLongPressCard.post_id]: false,
  //       }));
  //     }
  //   }

  //   if (card?.preview?.url) {
  //     initializePlayer(card);
  //   }
  //   setLoadingVideoId(card.post_id);
  //   setActiveLongPressCard(card);
  // };

  // const initializePlayer = (card: any) => {
  //   const container = videoPlayerRefs.current[card.post_id];
  //   if (!container) return;

  //   // Destroy previous instance if exists
  //   if (artPlayerInstances.current[card.post_id]) {
  //     artPlayerInstances.current[card.post_id]?.destroy();
  //   }

  //   const isM3u8 = card?.preview?.url?.includes(".m3u8");

  //   const options: Artplayer["Option"] = {
  //     container: container,
  //     url: card.preview.url,
  //     muted: true,
  //     autoplay: true,
  //     loop: true,
  //     isLive: false,
  //     aspectRatio: true,
  //     fullscreen: false,
  //     theme: "#d53ff0",
  //     moreVideoAttr: {
  //       playsInline: true,
  //       preload: "auto" as const,
  //     },
  //     type: isM3u8 ? "m3u8" : "auto",
  //     customType: {
  //       m3u8: (videoElement: HTMLVideoElement, url: string) => {
  //         if (Hls.isSupported()) {
  //           const hls = new Hls();
  //           hls.loadSource(url);
  //           hls.attachMedia(videoElement);
  //         } else if (
  //           videoElement.canPlayType("application/vnd.apple.mpegurl")
  //         ) {
  //           videoElement.src = url;
  //         }
  //       },
  //     },
  //     icons: {
  //       loading: `<div style="display:none"></div>`,
  //       state: `<div style="display:none"></div>`,
  //     },
  //   };

  //   try {
  //     const player = new Artplayer(options);
  //     artPlayerInstances.current[card.post_id] = player;

  //     player.on("ready", () => {
  //       player.play();
  //       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
  //       setLoadingVideoId(null);
  //     });

  //     player.on("play", () => {
  //       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
  //       setLoadingVideoId(null);
  //     });

  //     player.on("pause", () => {
  //       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
  //     });

  //     player.on("video:playing", () => {
  //       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
  //       setLoadingVideoId(null);
  //     });

  //     player.on("video:waiting", () => {
  //       setLoadingVideoId(card.post_id);
  //     });

  //     player.on("error", () => {
  //       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
  //       setLoadingVideoId(null);
  //     });
  //   } catch (error) {
  //     setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
  //     console.error("Error initializing ArtPlayer:", error);
  //     setLoadingVideoId(null);
  //   }
  // };

  // const handleTouchStart = (card: any) => {
  //   if (loadingVideoId === card.post_id) return;
  //   if (playingVideos[card.post_id]) return;

  //   longPressTimer.current = setTimeout(() => {
  //     handleLongPress(card);
  //   }, 500); // 500ms threshold for long press
  // };

  // // Clean up all players when component unmounts
  // useEffect(() => {
  //   return () => {
  //     Object.values(artPlayerInstances.current).forEach((player) => {
  //       player?.destroy();
  //     });
  //     artPlayerInstances.current = {};

  //     if (longPressTimer.current) {
  //       clearTimeout(longPressTimer.current);
  //     }

  //     if (loadingTimerRef.current) {
  //       clearTimeout(loadingTimerRef.current);
  //     }
  //   };
  // }, []);

  const cleanupPlayer = (postId: string) => {
    const player = artPlayerInstances.current[postId];
    if (player) {
      // Clean up video resources
      const video = player.video;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      // Destroy HLS instance if it exists
      if (player?.customType === "m3u8" && player.hls) {
        player.hls.destroy();
      }

      player.destroy();
      delete artPlayerInstances.current[postId];
    }

    // Clean up playing state
    setPlayingVideos((prev) => {
      const newState = { ...prev };
      delete newState[postId];
      return newState;
    });
  };

  const handleLongPress = (card: any) => {
    if (playingVideos[card.post_id]) return;
    if (!card?.preview?.url) return;

    console.log("Touch start on card:", card.post_id);

    if (activeLongPressCard) {
      cleanupPlayer(activeLongPressCard.post_id);
    }

    // Pause any currently playing video
    if (activeLongPressCard) {
      const currentPlayer =
        artPlayerInstances.current[activeLongPressCard?.post_id];
      if (currentPlayer) {
        currentPlayer.muted = true;
        currentPlayer.pause();
        setPlayingVideos((prev) => ({
          ...prev,
          [activeLongPressCard.post_id]: false,
        }));
      }
    }

    if (card?.preview?.url) {
      initializePlayer(card);
    }
    setActiveLongPressCard(card);
  };
  const initializePlayer = (card: any) => {
    const container = videoPlayerRefs.current[card.post_id];
    if (!container) return;

    // Destroy previous instance if exists
    if (artPlayerInstances.current[card.post_id]) {
      cleanupPlayer(card.post_id);
    }

    const isM3u8 = card?.preview?.url?.includes(".m3u8");
    const hlsRef = { current: null as Hls | null };

    const options: Artplayer["Option"] = {
      container: container,
      url: card.preview.url,
      muted: true,
      autoplay: true,
      loop: true,
      isLive: false,
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      moreVideoAttr: {
        playsInline: true,
        preload: "auto" as const,
      },
      type: isM3u8 ? "m3u8" : "auto",
      customType: {
        m3u8: (videoElement: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
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
        loading: `<div style="display:none"></div>`,
        state: `<div style="display:none"></div>`,
      },
    };

    try {
      const player = new Artplayer(options);
      artPlayerInstances.current[card.post_id] = player;

      player.on("ready", () => {
        player.play();
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
        setDisabled(null);
      });

      player.on("play", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
        setDisabled(null);
      });

      player.on("pause", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
      });

      player.on("video:playing", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
        setLoadingVideoId(null);
        setDisabled(null);
      });

      player.on("video:waiting", () => {
        setLoadingVideoId(card.post_id);
        setDisabled(card.post_id);
      });

      player.on("error", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
        setLoadingVideoId(null);
        setDisabled(null);
      });
      artPlayerInstances.current[card.post_id] = player;
      player.hls = hlsRef.current; // Store HLS reference for cleanup

      // ... rest of your event listeners

      // Add cleanup to player instance
      player.on("destroy", () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      });
    } catch (error) {
      setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
      console.error("Error initializing ArtPlayer:", error);
      setLoadingVideoId(null);
      setDisabled(null);
    }
  };

  const handleTouchStart = (card: any) => {
    if (loadingVideoId === card.post_id || card.post_id === loadingDisable)
      return;
    if (playingVideos[card.post_id]) return;
    setDisabled(card.post_id);
    setLoadingVideoId(card.post_id);
    handleLongPress(card);
    // longPressTimer.current = setTimeout(() => {

    // }, 500); // 500ms threshold for long press
  };

  // Clean up all players when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all players
      Object.keys(artPlayerInstances.current).forEach((postId) => {
        cleanupPlayer(postId);
      });
      artPlayerInstances.current = {};

      // Clear timers
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = undefined;
      }
    };
  }, []);
  return (
    <div
      //h-[320px] remove
      className="chinese_photo  max-w-full relative pt-[20px]"
    >
      <div className="w-full h-[2px] relative">
        <LoadingAnimation
          loadingVideoId={loadingVideoId}
          postId={videoData?.post_id}
        />
      </div>

      <div
        // onClick={() => showDetailsVod(videoData)}
        onTouchStart={() => handleTouchStart(videoData)}
        className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
      >
        {/* Video Player */}
        <div
          ref={(el) => (videoPlayerRefs.current[videoData.post_id] = el)}
          className="w-full h-full object-cover rounded-none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: "#000",
            opacity:
              activeLongPressCard?.post_id === videoData.post_id &&
              loadingVideoId !== videoData.post_id
                ? 1
                : 0,
            transition: "opacity 1s ease",
            pointerEvents: "none",
          }}
        />

        {/* Image */}
        <ImageWithPlaceholder
          src={videoData?.preview_image}
          alt={videoData.title || "Video"}
          className="object-cover h-full w-full rounded-none"
          style={{
            opacity:
              activeLongPressCard?.post_id === videoData.post_id &&
              loadingVideoId !== videoData.post_id
                ? 0
                : 1,
            transition: "opacity 1s ease",
          }}
        />
        {/* <ImageWithPlaceholder
          src={videoData?.preview_image}
          alt={videoData.title || "Video"}
          width={"100%"}
          height={calculateHeight(
            videoData?.files[0]?.width,
            videoData?.files[0]?.height
          )}
          className=" object-cover h-full w-full rounded-none"
        /> */}
        {/* <div className="absolute card_style_2 bottom-0 flex justify-between items-center h-[50px] px-3 w-full">
          <div className="flex items-center gap-1">
            <Heart />
            <span className="text-[14px]">{videoData?.like_count}</span>
          </div>
          <FaEarthAmericas size={10} />
        </div> */}
      </div>
      {/* line-clamp-2 */}
      <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
        {videoData.title.length > 50
          ? `${videoData.title.slice(0, 50)}...`
          : videoData.title}
      </h1>
      <div className="px-[6px] flex justify-between items-center w-full my-2">
        <div className="flex items-center gap-1">
          <ImageWithPlaceholder1
            src={videoData?.user?.avatar}
            alt={videoData?.user?.avatar || "Video"}
            width={"20px"}
            height={"20px"}
            className=" object-cover h-full w-full rounded-full"
          />
          <p className="text-[12px] text-[#BBBBBB]">{videoData?.user?.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <Heart size={11} />
          <p className="text-[12px] text-[#BBBBBB]">{videoData?.like_count}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard2;
