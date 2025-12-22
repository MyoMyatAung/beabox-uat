import { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { decryptImage } from "@/utils/imageDecrypt";
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
  onOverlayClick?: () => void; // Callback when +N overlay is clicked
}

type MediaOrientation = "portrait" | "landscape" | "square";
type MediaSize = "small" | "medium" | "large";

interface MediaWithDimensions extends GossipPostMedia {
  orientation: MediaOrientation;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  size: MediaSize;
}

interface BentoLayout {
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
  order?: number;
}

/**
 * Production-ready Bento Grid for Gossip Media
 * Intelligently arranges media based on aspect ratios to create a visually appealing layout
 */
const ImageGrid = ({
  media,
  onMediaClick,
  videoContainerRef,
  isFirstVideo = false,
  isVideoReady = false,
  isMuted = true,
  onToggleMute,
  showAllMedia = false,
  onOverlayClick,
}: ImageGridProps) => {
  const [mediaWithDimensions, setMediaWithDimensions] = useState<
    MediaWithDimensions[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detect media dimensions and calculate orientation
  useEffect(() => {
    const detectDimensions = async () => {
      const dimensionPromises = media.map(async (item) => {
        try {
          // Get the image URL (thumbnail for videos, url for images)
          const imageUrl = item.thumbnail_url || item.thumbnail || item.url;

          if (!imageUrl) {
            // No image URL, use default dimensions
            return {
              ...item,
              orientation: "portrait" as MediaOrientation,
              width: 1080,
              height: 1350,
              aspectRatio: 0.8,
              size: "small" as MediaSize,
            };
          }

          // Decrypt the image first
          const decryptedUrl = await decryptImage(imageUrl, "");

          // Create image element and load decrypted image
          return new Promise<MediaWithDimensions>((resolve) => {
            const img = new Image();

            img.onload = () => {
              const width = img.width;
              const height = img.height;
              const aspectRatio = width / height;

              // Determine orientation
              let orientation: MediaOrientation;
              if (aspectRatio > 1.1) {
                orientation = "landscape";
              } else if (aspectRatio < 0.9) {
                orientation = "portrait";
              } else {
                orientation = "square";
              }

              // Determine size based on aspect ratio extremes
              let size: MediaSize;
              if (aspectRatio > 2 || aspectRatio < 0.5) {
                size = "large"; // Very wide or very tall
              } else if (aspectRatio > 1.5 || aspectRatio < 0.7) {
                size = "medium"; // Moderately wide or tall
              } else {
                size = "small"; // Normal proportions
              }

              resolve({
                ...item,
                orientation,
                width,
                height,
                aspectRatio,
                size,
              });
            };

            img.onerror = () => {
              // Default to portrait with standard dimensions on error
              resolve({
                ...item,
                orientation: "portrait",
                width: 1080,
                height: 1350,
                aspectRatio: 0.8,
                size: "small",
              });
            };

            // Load the decrypted image
            img.src = decryptedUrl;
          });
        } catch (error) {
          console.error(
            "Error decrypting image for dimension detection:",
            error
          );
          // Default to portrait with standard dimensions on decryption error
          return {
            ...item,
            orientation: "portrait" as MediaOrientation,
            width: 1080,
            height: 1350,
            aspectRatio: 0.8,
            size: "small" as MediaSize,
          };
        }
      });

      const results = await Promise.all(dimensionPromises);
      setMediaWithDimensions(results);
      setIsLoading(false);
    };

    detectDimensions();
  }, [media]);

  /**
   * Calculate Bento grid layout based on media dimensions
   * This creates a balanced, visually appealing grid
   */
  const bentoLayout = useMemo((): BentoLayout[] => {
    if (mediaWithDimensions.length === 0) return [];

    const maxDisplay = showAllMedia
      ? mediaWithDimensions.length
      : Math.min(mediaWithDimensions.length, 5);
    const displayMedia = mediaWithDimensions.slice(0, maxDisplay);

    // Single item - full width
    if (displayMedia.length === 1) {
      return [{ colSpan: 2, rowSpan: 1 }];
    }

    // Two items
    if (displayMedia.length === 2) {
      const [first, second] = displayMedia;

      // Check if either item has greater vertical height (portrait/tall)
      const firstIsVertical = first.aspectRatio < 1; // height > width
      const secondIsVertical = second.aspectRatio < 1; // height > width

      // If either item has greater vertical height, use 2-column grid with row-span
      if (firstIsVertical || secondIsVertical) {
        // Both vertical - side by side, each spanning 2 rows
        if (firstIsVertical && secondIsVertical) {
          return [
            { colSpan: 1, rowSpan: 2 },
            { colSpan: 1, rowSpan: 2 },
          ];
        }

        // First is vertical, second is landscape
        if (firstIsVertical && !secondIsVertical) {
          return [
            { colSpan: 1, rowSpan: 2 }, // Vertical item spans 2 rows
            { colSpan: 1, rowSpan: 1 }, // Landscape item in 1 row
          ];
        }

        // First is landscape, second is vertical
        if (!firstIsVertical && secondIsVertical) {
          return [
            { colSpan: 1, rowSpan: 1 }, // Landscape item in 1 row
            { colSpan: 1, rowSpan: 2 }, // Vertical item spans 2 rows
          ];
        }
      }

      // Both landscape - stack vertically (full width each)
      return [
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
      ];
    }

    // Three items - smart layout
    if (displayMedia.length === 3) {
      // Check if there's exactly one vertical media
      const verticalItems = displayMedia.filter(
        (m) => m.aspectRatio < 1 // height > width
      );

      // If there's exactly one vertical media, place it first with 2 rowSpan
      if (verticalItems.length === 1) {
        const verticalIndex = displayMedia.findIndex((m) => m.aspectRatio < 1);

        // Create layout array matching item order, with order property for visual positioning
        // Vertical item should appear first (left), other two appear after (right column)
        const layouts: BentoLayout[] = [];
        let otherItemOrder = 2; // Start order for non-vertical items

        for (let i = 0; i < 3; i++) {
          if (i === verticalIndex) {
            // Vertical item: left column, spans 2 rows, order 1 (appears first)
            layouts.push({ colSpan: 1, rowSpan: 2, order: 1 });
          } else {
            // Other items: right column, 1 row each, order 2 and 3
            layouts.push({ colSpan: 1, rowSpan: 1, order: otherItemOrder });
            otherItemOrder++;
          }
        }
        return layouts;
      }

      // If no vertical items or multiple vertical items, use default layout
      const [first] = displayMedia;

      // First is landscape - takes full width, other two split below
      if (first.orientation === "landscape" || first.size === "large") {
        return [
          { colSpan: 2, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
        ];
      }

      // Default 3-item layout
      return [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
      ];
    }

    // Four items - balanced 2x2 with smart sizing
    if (displayMedia.length === 4) {
      const hasLandscape = displayMedia.some(
        (m) => m.orientation === "landscape"
      );

      if (hasLandscape) {
        const landscapeIndex = displayMedia.findIndex(
          (m) => m.orientation === "landscape"
        );

        // Landscape takes top row, others fill below
        if (landscapeIndex === 0) {
          return [
            { colSpan: 2, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 2, rowSpan: 1 },
          ];
        }
      }

      // Default 2x2 grid
      return [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
      ];
    }

    // Five items layout
    if (displayMedia.length === 5) {
      // For showAllMedia=true: Use 2+3 layout (handled in renderGrid special case)
      // For showAllMedia=false (feed view): Use smart layout to avoid empty cells
      if (!showAllMedia) {
        // Feed view: Layout to avoid empty cells
        // Strategy: 2+1+2 (Row 1: 2 items, Row 2: 1 wide item, Row 3: 2 items)
        // Or: 1+2+2 (Row 1: 1 wide item, Row 2: 2 items, Row 3: 2 items)

        // Check if we have a wide landscape
        const wideLandscapeIdx = displayMedia.findIndex(
          (m) => m.orientation === "landscape" && m.aspectRatio > 1.5
        );

        if (wideLandscapeIdx !== -1) {
          // Place wide landscape in row 2 (middle)
          const layouts: BentoLayout[] = [];
          for (let i = 0; i < 5; i++) {
            if (i === wideLandscapeIdx) {
              layouts.push({ colSpan: 2, rowSpan: 1 }); // Wide item in row 2
            } else {
              layouts.push({ colSpan: 1, rowSpan: 1 });
            }
          }
          return layouts;
        }

        // No wide landscape: Use 2+1+2 layout (middle item spans 2 columns)
        // This ensures: Row 1 (2 items), Row 2 (1 full-width), Row 3 (2 items) = no empty cells
        return [
          { colSpan: 1, rowSpan: 1 }, // Row 1, col 1
          { colSpan: 1, rowSpan: 1 }, // Row 1, col 2
          { colSpan: 2, rowSpan: 1 }, // Row 2, spans both columns
          { colSpan: 1, rowSpan: 1 }, // Row 3, col 1
          { colSpan: 1, rowSpan: 1 }, // Row 3, col 2
        ];
      }

      // For showAllMedia=true, return default (will be handled by special render case)
      return [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
      ];
    }

    // 6+ items layout
    const layouts: BentoLayout[] = [];

    if (showAllMedia) {
      // For showAllMedia mode: Maximum 2 rows constraint
      // No items should span 2 rows (row-span-2) to ensure we fit in 2 rows max
      displayMedia.forEach((media) => {
        // Wide landscapes span 2 columns (take full width)
        if (media.orientation === "landscape" && media.aspectRatio > 1.5) {
          layouts.push({ colSpan: 2, rowSpan: 1 });
        }
        // Very wide items span 2 columns
        else if (media.size === "large" && media.aspectRatio > 1) {
          layouts.push({ colSpan: 2, rowSpan: 1 });
        }
        // Default: single column, single row (NO row-span-2 allowed)
        else {
          layouts.push({ colSpan: 1, rowSpan: 1 });
        }
      });

      // Balance odd counts by expanding one item to col-span-2
      const totalSpans = layouts.reduce((sum, l) => sum + l.colSpan, 0);
      if (totalSpans % 2 === 1) {
        // Find first landscape that's col-span-1 to expand
        const landscapeIdx = displayMedia.findIndex(
          (m, i) => m.orientation === "landscape" && layouts[i].colSpan === 1
        );
        if (landscapeIdx !== -1) {
          layouts[landscapeIdx].colSpan = 2;
        } else {
          // Find any square to expand
          const squareIdx = displayMedia.findIndex(
            (m, i) => m.orientation === "square" && layouts[i].colSpan === 1
          );
          if (squareIdx !== -1) {
            layouts[squareIdx].colSpan = 2;
          } else {
            // Expand last item as fallback
            layouts[layouts.length - 1].colSpan = 2;
          }
        }
      }
    } else {
      // Feed view (max 5 items): Allow natural spanning for better visual hierarchy
      displayMedia.forEach((media) => {
        // Very tall portraits can span 2 rows in feed view
        if (media.orientation === "portrait" && media.aspectRatio < 0.6) {
          layouts.push({ colSpan: 1, rowSpan: 2 });
        }
        // Wide landscapes span 2 columns
        else if (media.orientation === "landscape" && media.aspectRatio > 1.5) {
          layouts.push({ colSpan: 2, rowSpan: 1 });
        }
        // Large/extreme aspect ratios get priority
        else if (media.size === "large") {
          if (media.aspectRatio > 1) {
            layouts.push({ colSpan: 2, rowSpan: 1 });
          } else {
            layouts.push({ colSpan: 1, rowSpan: 2 });
          }
        }
        // Default sizing
        else {
          layouts.push({ colSpan: 1, rowSpan: 1 });
        }
      });

      // Balance odd counts
      const totalSpans = layouts.reduce((sum, l) => sum + l.colSpan, 0);
      if (totalSpans % 2 === 1) {
        const landscapeIdx = displayMedia.findIndex(
          (m, i) => m.orientation === "landscape" && layouts[i].colSpan === 1
        );
        if (landscapeIdx !== -1) {
          layouts[landscapeIdx].colSpan = 2;
        } else {
          layouts[layouts.length - 1].colSpan = 2;
        }
      }
    }

    return layouts;
  }, [mediaWithDimensions, showAllMedia]);

  const renderMediaItem = (
    item: GossipPostMedia,
    index: number,
    mediaInfo: MediaWithDimensions,
    layout: BentoLayout
  ) => {
    const isVideo = item.type === "video";
    // const isFirstVideoItem = index === 0 && isFirstVideo && isVideo;
    const isFirstVideoItem = false;
    const { colSpan, rowSpan, order } = layout;

    const maxDisplay = showAllMedia ? media.length : Math.min(media.length, 5);

    return (
      <div
        key={item.id || item.url || item.download_url || index}
        onClick={() => onMediaClick(index)}
        className={`bg-gray-900 relative cursor-pointer rounded-sm h-full w-full overflow-hidden
          ${colSpan === 2 ? "col-span-2" : "col-span-1"}
          ${rowSpan === 2 ? "row-span-2" : "row-span-1"}
        `}
        style={{
          aspectRatio:
            colSpan === 2 && rowSpan === 1
              ? "2 / 1" // Wide landscape
              : colSpan === 1 && rowSpan === 2
              ? "1 / 2" // Tall portrait
              : `${mediaInfo.width} / ${mediaInfo.height}`, // Original aspect ratio
          minHeight: rowSpan === 2 ? "200px" : "100px",
          ...(order !== undefined && { order }),
        }}
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
                <img src={indicator} width="25" height="25" alt="Play" />
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
        {!showAllMedia &&
          media.length > maxDisplay &&
          index === maxDisplay - 1 && (
            <div
              className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onOverlayClick) {
                  onOverlayClick();
                }
              }}
            >
              <span className="text-white text-2xl font-semibold">
                +{media.length - maxDisplay}
              </span>
            </div>
          )}
      </div>
    );
  };

  const renderGrid = () => {
    if (isLoading) {
      return (
        <div className="w-full aspect-[4/5] bg-gray-800 rounded-sm animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      );
    }

    if (mediaWithDimensions.length === 0) {
      return null;
    }

    const maxDisplay = showAllMedia
      ? mediaWithDimensions.length
      : Math.min(mediaWithDimensions.length, 5);
    const displayMedia = media.slice(0, maxDisplay);
    const displayDimensions = mediaWithDimensions.slice(0, maxDisplay);

    // Special layout for exactly 5 items: 2 in row 1, 3 in row 2
    if (displayMedia.length === 5 && showAllMedia) {
      return (
        <div className="flex flex-col gap-1">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-2 gap-1">
            {displayMedia.slice(0, 2).map((item, idx) =>
              renderMediaItem(item, idx, displayDimensions[idx], {
                colSpan: 1,
                rowSpan: 1,
              })
            )}
          </div>
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-3 gap-1">
            {displayMedia.slice(2, 5).map((item, idx) =>
              renderMediaItem(item, idx + 2, displayDimensions[idx + 2], {
                colSpan: 1,
                rowSpan: 1,
              })
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className="grid grid-cols-2 gap-1"
        style={{
          ...(showAllMedia
            ? {
                gridTemplateRows: "repeat(1, 1fr)", // Exactly 2 rows
                gridAutoFlow: "dense", // Fill gaps intelligently
                overflow: "hidden", // Hide anything that doesn't fit
              }
            : {
                gridAutoRows: "minmax(100px, auto)",
                gridAutoFlow: "dense",
              }),
        }}
      >
        {displayMedia.map((item, idx) =>
          renderMediaItem(item, idx, displayDimensions[idx], bentoLayout[idx])
        )}
      </div>
    );
  };

  return <div className="px-3 mb-3">{renderGrid()}</div>;
};

export default ImageGrid;
