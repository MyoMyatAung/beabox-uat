import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { GossipPostMedia } from "../services/gossipSlice";
import indicator from "@/assets/indicator.webp";

interface ImageGridProps {
  media: GossipPostMedia[];
  onMediaClick: (index: number) => void;
  videoContainerRef?: React.RefObject<HTMLDivElement>;
  isFirstVideo?: boolean;
  isVideoReady?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

type MediaOrientation = "horizontal" | "vertical";

interface MediaWithOrientation extends GossipPostMedia {
  orientation: MediaOrientation;
}

const ImageGrid = ({
  media,
  onMediaClick,
  videoContainerRef,
  isFirstVideo = false,
  isVideoReady = false,
  isMuted = true,
  onToggleMute,
}: ImageGridProps) => {
  const [mediaWithOrientations, setMediaWithOrientations] = useState<
    MediaWithOrientation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detect image orientations
  useEffect(() => {
    const detectOrientations = async () => {
      const orientationPromises = media.map((item) => {
        return new Promise<MediaWithOrientation>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const orientation: MediaOrientation =
              img.width > img.height ? "horizontal" : "vertical";
            resolve({ ...item, orientation });
          };
          img.onerror = () => {
            // Default to vertical on error
            resolve({ ...item, orientation: "vertical" });
          };
          // Use thumbnail for videos, url for images
          img.src = item.thumbnail_url || item.thumbnail || item.url;
        });
      });

      const results = await Promise.all(orientationPromises);
      setMediaWithOrientations(results);
      setIsLoading(false);
    };

    detectOrientations();
  }, [media]);

  const mediaCount = media.length;

  // Get layout pattern based on count and orientations
  const getLayoutPattern = () => {
    if (isLoading || mediaWithOrientations.length === 0) {
      return "loading";
    }

    const orientations = mediaWithOrientations.map((m) => m.orientation);

    switch (mediaCount) {
      case 1:
        return orientations[0] === "horizontal" ? "1h" : "1v";

      case 2: {
        if (orientations[0] === "vertical" && orientations[1] === "vertical") {
          return "2v";
        } else if (
          orientations[0] === "horizontal" &&
          orientations[1] === "horizontal"
        ) {
          return "2h";
        } else if (
          orientations[0] === "horizontal" &&
          orientations[1] === "vertical"
        ) {
          return "1h1v";
        } else {
          return "1v1h";
        }
      }

      case 3: {
        const verticalCount3 = orientations.filter(
          (o) => o === "vertical"
        ).length;
        if (verticalCount3 === 3) return "3v";
        if (verticalCount3 === 0) return "3h";
        if (verticalCount3 === 2) {
          return orientations[0] === "horizontal" ? "1h2v" : "2v1h";
        } else {
          return orientations[0] === "vertical" ? "1v2h" : "2h1v";
        }
      }

      case 4: {
        const verticalCount4 = orientations.filter(
          (o) => o === "vertical"
        ).length;
        if (verticalCount4 === 4) return "4v";
        if (verticalCount4 === 0) return "4h";
        if (verticalCount4 === 3) return "3v1h";
        if (verticalCount4 === 1) return "1v3h";
        return "4mixed";
      }

      case 5:
        return "5mixed";

      case 6:
        return "6mixed";

      default:
        return "default";
    }
  };

  const layoutPattern = getLayoutPattern();

  const renderMediaItem = (
    item: GossipPostMedia,
    index: number,
    className: string
  ) => {
    const isVideo = item.type === "video";
    const isFirstVideoItem = index === 0 && isFirstVideo && isVideo;

    return (
      <div
        key={item.id || item.url || item.download_url || index}
        onClick={() => onMediaClick(index)}
        className={`${className} bg-gray-900 relative cursor-pointer rounded-sm overflow-hidden`}
      >
        {isVideo && isFirstVideoItem ? (
          <div className="relative w-full h-full">
            <div
              ref={videoContainerRef}
              className="w-full h-full"
              style={{ pointerEvents: "none" }}
            />
            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {onToggleMute && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute();
                }}
                className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-white" />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )}
              </button>
            )}
          </div>
        ) : isVideo ? (
          <div className="relative w-full h-full">
            {item.thumbnail_url || item.thumbnail ? (
              <AsyncDecryptedImage
                imageUrl={item.thumbnail_url || item.thumbnail || ""}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-[#00000052] rounded-full flex items-center justify-center">
                <img src={indicator} width="25" height="25" alt="Play"></img>
              </div>
            </div>
          </div>
        ) : (
          <AsyncDecryptedImage
            imageUrl={item.url}
            alt=""
            className="w-full h-full object-cover"
          />
        )}

        {/* +N overlay for extra items */}
        {mediaCount > 5 && index === 4 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">
              +{mediaCount - 5}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderLayout = () => {
    if (isLoading) {
      return (
        <div className="w-full aspect-[4/5] bg-gray-800 rounded-sm animate-pulse" />
      );
    }

    const displayMedia = media.slice(0, Math.min(mediaCount, 5));

    switch (layoutPattern) {
      // 1 media
      case "1v":
        return (
          <div className="w-full">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[4/5]")}
          </div>
        );

      case "1h":
        return (
          <div className="w-full">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[16/9]")}
          </div>
        );

      // 2 media
      case "2v":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[4/5]")
            )}
          </div>
        );

      case "2h":
        return (
          <div className="flex flex-col gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[16/9]")
            )}
          </div>
        );

      case "1h1v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[16/9]")}
            {renderMediaItem(displayMedia[1], 1, "w-full aspect-[16/9]")}
          </div>
        );

      case "1v1h":
        return (
          <div className="grid grid-cols-2 gap-1">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[4/5]")}
            {renderMediaItem(displayMedia[1], 1, "w-full aspect-[4/5]")}
          </div>
        );

      // 3 media
      case "3v":
        return (
          <div className="grid grid-cols-3 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[4/5]")
            )}
          </div>
        );

      case "3h":
        return (
          <div className="flex flex-col gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[16/9]")
            )}
          </div>
        );

      case "1h2v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[16/9]")}
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[4/5]")}
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-[4/5]")}
            </div>
          </div>
        );

      case "2v1h":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[0], 0, "w-full aspect-[4/5]")}
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[4/5]")}
            </div>
            {renderMediaItem(displayMedia[2], 2, "w-full aspect-[16/9]")}
          </div>
        );

      case "1v2h":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className="row-span-2">
              {renderMediaItem(displayMedia[0], 0, "w-full h-full")}
            </div>
            <div className="flex flex-col gap-1">
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[16/9]")}
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-[16/9]")}
            </div>
          </div>
        );

      case "2h1v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(displayMedia[0], 0, "w-full aspect-[16/9]")}
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[16/9]")}
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-[4/5]")}
            </div>
          </div>
        );

      // 4 media
      case "4v":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[4/5]")
            )}
          </div>
        );

      case "4h":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-[16/9]")
            )}
          </div>
        );

      case "3v1h":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[0], 0, "w-full aspect-[4/5]")}
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[4/5]")}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-[4/5]")}
              {renderMediaItem(displayMedia[3], 3, "w-full aspect-[16/9]")}
            </div>
          </div>
        );

      case "1v3h":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className="row-span-2">
              {renderMediaItem(displayMedia[0], 0, "w-full h-full")}
            </div>
            <div className="flex flex-col gap-1">
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-[16/9]")}
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-[16/9]")}
            </div>
            {renderMediaItem(
              displayMedia[3],
              3,
              "w-full aspect-[16/9] col-span-2"
            )}
          </div>
        );

      case "4mixed":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, "w-full aspect-square")
            )}
          </div>
        );

      // 5 media - show all 5 in grid layout (2x2 + 1)
      case "5mixed":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[0], 0, "w-full aspect-square")}
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-square")}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-square")}
              {renderMediaItem(displayMedia[3], 3, "w-full aspect-square")}
              {renderMediaItem(displayMedia[4], 4, "w-full aspect-square")}
            </div>
          </div>
        );

      // 6+ media - show first 5 with +N overlay on the last one
      case "6mixed":
      default:
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(displayMedia[0], 0, "w-full aspect-square")}
              {renderMediaItem(displayMedia[1], 1, "w-full aspect-square")}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {renderMediaItem(displayMedia[2], 2, "w-full aspect-square")}
              {renderMediaItem(displayMedia[3], 3, "w-full aspect-square")}
              {renderMediaItem(displayMedia[4], 4, "w-full aspect-square")}
            </div>
          </div>
        );
    }
  };

  return <div className="px-3 mb-3">{renderLayout()}</div>;
};

export default ImageGrid;
