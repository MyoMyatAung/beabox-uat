import { useState, useCallback, useRef, useEffect } from "react";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import Loader from "@/page/home/vod_loader.gif";
import VideoCard from "../video-card";
import VideoFeed from "@/page/home/components/VideoFeed";
import { useSearchParams } from "react-router-dom";
import NoVideoCard from "@/components/shared/no-video-card";
import LoadingSpinner from "@/page/gossip/components/LoadingSpinner";

const LikedVideos = ({ id }: any) => {
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);
  const user = useSelector((state: any) => state?.persist?.user);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetLikedPostQuery(
    { user_id: id, page },
    { skip: !user }
  );

  // Get videos from merged cache
  const videos = data?.data ?? [];
  const totalData = data?.pagination?.total ?? 0;
  const hasMore = videos.length < totalData;

  const fetchMoreData = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  // IntersectionObserver for loading more when spinner is in viewport
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          fetchMoreData();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, fetchMoreData]);

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center w-full py-[200px]">
        <div>
          <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
        </div>
      </div>
    );
  }

  return (
    <>
      {showVideoFeed && selectedMovieId ? (
        <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
          <VideoFeed
            setPage={setPage}
            setVideos={() => {}} // Videos are managed by RTK Query cache
            videos={videos}
            currentActiveId={selectedMovieId}
            setShowVideoFeed={setShowVideoFeed}
            query={query}
            search={false}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="pb-5">
        {!user?.token || videos.length <= 0 ? (
          <NoVideoCard from="liked" />
        ) : (
          <>
            <div>
              <div className="grid grid-cols-2 gap-1">
                {videos.map((item: any) => (
                  <div
                    key={item.post_id}
                    onClick={() => {
                      setSelectedMovieId(item?.post_id);
                      setShowVideoFeed(true);
                    }}
                  >
                    <VideoCard
                      videoData={item}
                      loadingVideoId={loadingVideoId}
                      setLoadingVideoId={setLoadingVideoId}
                    />
                  </div>
                ))}
              </div>
              {/* Loading spinner - triggers load more when in viewport */}
              <div ref={loadMoreRef}>
                {hasMore && <LoadingSpinner />}
              </div>
              <div className="py-[38px]"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LikedVideos;
