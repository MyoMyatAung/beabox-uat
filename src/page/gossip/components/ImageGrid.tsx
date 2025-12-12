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
  showAllMedia?: boolean; // If true, show all media without limit
}

type MediaOrientation = "horizontal" | "vertical";

interface MediaWithOrientation extends GossipPostMedia {
  orientation: MediaOrientation;
  width: number;
  height: number;
  aspectRatio: number; // width / height
}

const ImageGrid = ({
  media,
  onMediaClick,
  videoContainerRef,
  isFirstVideo = false,
  isVideoReady = false,
  isMuted = true,
  onToggleMute,
  showAllMedia = false,
}: ImageGridProps) => {
  const [mediaWithOrientations, setMediaWithOrientations] = useState<
    MediaWithOrientation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detect image orientations and dimensions
  useEffect(() => {
    const detectOrientations = async () => {
      const orientationPromises = media.map((item) => {
        return new Promise<MediaWithOrientation>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;
            const orientation: MediaOrientation =
              width > height ? "horizontal" : "vertical";
            resolve({ ...item, orientation, width, height, aspectRatio });
          };
          img.onerror = () => {
            // Default to vertical on error with standard aspect ratio
            resolve({
              ...item,
              orientation: "vertical",
              width: 1080,
              height: 1350,
              aspectRatio: 0.8,
            });
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

  // Helper function to calculate row span based on aspect ratio
  const getRowSpan = (index: number): number => {
    const mediaItem = mediaWithOrientations[index];
    if (!mediaItem) return 1;

    const ratio = mediaItem.aspectRatio;

    // Very tall images (portrait) - span 2 rows
    if (ratio < 0.6) return 2;
    // Tall images - span 2 rows
    if (ratio < 0.8) return 2;
    // Normal vertical - span 1 row
    if (ratio < 1) return 1;
    // Horizontal images - span 1 row
    return 1;
  };

  // Helper function to calculate column span based on aspect ratio
  const getColSpan = (index: number): number => {
    const mediaItem = mediaWithOrientations[index];
    if (!mediaItem) return 1;

    const ratio = mediaItem.aspectRatio;

    // Very wide images (panoramic) - span 2 columns
    if (ratio > 1.5) return 2;
    // Wide images - span 2 columns
    if (ratio > 1.2) return 2;
    // Normal images - span 1 column
    return 1;
  };

  // Helper function to get aspect ratio style based on actual dimensions
  const getAspectRatioStyle = (index: number): string => {
    const mediaItem = mediaWithOrientations[index];
    if (!mediaItem) return "aspect-square";

    const ratio = mediaItem.aspectRatio;

    // For very wide images (panoramic)
    if (ratio > 2) return "aspect-[21/9]";
    // For wide images
    if (ratio > 1.5) return "aspect-[16/9]";
    // For slightly wide images
    if (ratio > 1.1) return "aspect-[4/3]";
    // For square-ish images
    if (ratio >= 0.9 && ratio <= 1.1) return "aspect-square";
    // For slightly tall images
    if (ratio > 0.7) return "aspect-[4/5]";
    // For tall/portrait images
    if (ratio > 0.5) return "aspect-[3/4]";
    // For very tall images
    return "aspect-[9/16]";
  };

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
        {!showAllMedia && mediaCount > 5 && index === 4 && (
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

    const maxDisplay = showAllMedia ? mediaCount : Math.min(mediaCount, 5);
    const displayMedia = media.slice(0, maxDisplay);

    switch (layoutPattern) {
      // 1 media - use actual aspect ratio
      case "1v":
        return (
          <div className="w-full">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
          </div>
        );

      case "1h":
        return (
          <div className="w-full">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
          </div>
        );

      // 2 media - use actual aspect ratios
      case "2v":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "2h":
        return (
          <div className="flex flex-col gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "1h1v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
            {renderMediaItem(
              displayMedia[1],
              1,
              `w-full ${getAspectRatioStyle(1)}`
            )}
          </div>
        );

      case "1v1h":
        return (
          <div className="grid grid-cols-2 gap-1">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
            {renderMediaItem(
              displayMedia[1],
              1,
              `w-full ${getAspectRatioStyle(1)}`
            )}
          </div>
        );

      // 3 media - use actual aspect ratios
      case "3v":
        return (
          <div className="grid grid-cols-3 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "3h":
        return (
          <div className="flex flex-col gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "1h2v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
            </div>
          </div>
        );

      case "2v1h":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[0],
                0,
                `w-full ${getAspectRatioStyle(0)}`
              )}
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
            </div>
            {renderMediaItem(
              displayMedia[2],
              2,
              `w-full ${getAspectRatioStyle(2)}`
            )}
          </div>
        );

      case "1v2h":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className="row-span-2">
              {renderMediaItem(displayMedia[0], 0, "w-full h-full")}
            </div>
            <div className="flex flex-col gap-1">
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
            </div>
          </div>
        );

      case "2h1v":
        return (
          <div className="flex flex-col gap-1">
            {renderMediaItem(
              displayMedia[0],
              0,
              `w-full ${getAspectRatioStyle(0)}`
            )}
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
            </div>
          </div>
        );

      // 4 media - use actual aspect ratios
      case "4v":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "4h":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      case "3v1h":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[0],
                0,
                `w-full ${getAspectRatioStyle(0)}`
              )}
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
              {renderMediaItem(
                displayMedia[3],
                3,
                `w-full ${getAspectRatioStyle(3)}`
              )}
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
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
            </div>
            {renderMediaItem(
              displayMedia[3],
              3,
              `w-full ${getAspectRatioStyle(3)} col-span-2`
            )}
          </div>
        );

      case "4mixed":
        return (
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.map((item, idx) =>
              renderMediaItem(item, idx, `w-full ${getAspectRatioStyle(idx)}`)
            )}
          </div>
        );

      // 5 media - show all 5 in grid layout (2x2 + 3)
      case "5mixed":
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[0],
                0,
                `w-full ${getAspectRatioStyle(0)}`
              )}
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
              {renderMediaItem(
                displayMedia[3],
                3,
                `w-full ${getAspectRatioStyle(3)}`
              )}
              {renderMediaItem(
                displayMedia[4],
                4,
                `w-full ${getAspectRatioStyle(4)}`
              )}
            </div>
          </div>
        );

      // 6+ media - show first 5 with +N overlay (or all if showAllMedia is true)
      case "6mixed":
      default: {
        // If showAllMedia is true and we have more than 5, show all in an optimized masonry-style grid
        if (showAllMedia && displayMedia.length > 5) {
          return (
            <div className="grid grid-cols-2 gap-1 auto-rows-[minmax(100px,auto)] grid-flow-dense">
              {displayMedia.map((item, idx) => {
                const colSpan = getColSpan(idx);
                const rowSpan = getRowSpan(idx);
                const colSpanClass =
                  colSpan === 2 ? "col-span-2" : "col-span-1";
                const rowSpanClass =
                  rowSpan === 2 ? "row-span-2" : "row-span-1";

                return (
                  <div
                    key={item.id || item.url || idx}
                    className={`${colSpanClass} ${rowSpanClass}`}
                  >
                    {renderMediaItem(
                      item,
                      idx,
                      `w-full ${getAspectRatioStyle(idx)}`
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        // Otherwise show 2x2 + 3 layout (first 5 only)
        return (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              {renderMediaItem(
                displayMedia[0],
                0,
                `w-full ${getAspectRatioStyle(0)}`
              )}
              {renderMediaItem(
                displayMedia[1],
                1,
                `w-full ${getAspectRatioStyle(1)}`
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {renderMediaItem(
                displayMedia[2],
                2,
                `w-full ${getAspectRatioStyle(2)}`
              )}
              {renderMediaItem(
                displayMedia[3],
                3,
                `w-full ${getAspectRatioStyle(3)}`
              )}
              {displayMedia[4] &&
                renderMediaItem(
                  displayMedia[4],
                  4,
                  `w-full ${getAspectRatioStyle(4)}`
                )}
            </div>
          </div>
        );
      }
    }
  };

  return <div className="px-3 mb-3">{renderLayout()}</div>;
};

export default ImageGrid;
