import React, { useEffect, useState } from "react";
import { useGetLikedPostQuery, useGetPostsQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import Loader from "@/page/home/vod_loader.gif";
import { NoVideo } from "@/assets/profile";
import InfinitLoad from "@/components/shared/infinit-load";
import VideoCard from "../video-card";
import { useSearchParams } from "react-router-dom";
import VideoFeed from "@/page/home/components/VideoFeed";
import NoVideoCard from "@/components/shared/no-video-card";
const CreatedVideo = ({ id }: any) => {
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);
  const user = useSelector((state: any) => state?.persist?.user);
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const sort = useSelector((state: any) => state.profile.sort);

  const { data, isLoading, refetch, isFetching } = useGetPostsQuery({
    id,
    page,
    sort,
  });

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setTotalData(0);
    refetch();
  }, [refetch, id]);

  useEffect(() => {
    setPage(1);
    setVideos([]);
    setHasMore(true);
  }, [sort]);

  // useEffect(() => {
  //   if (data?.data?.length) {
  //     // Append new data to the existing videos
  //     setVideos((prevVideos) => [...prevVideos, ...data.data]);
  //     setTotalData(data.pagination.total);
  //   }
  // }, [data]);

  useEffect(() => {
    if (totalData <= videos.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, videos]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setVideos(data.data); // Replace ranking list when filter changes
      } else {
        setVideos((prev: any) => [...prev, ...data.data]); // Append new results for infinite scroll
      }
      setTotalData(data?.pagination?.total);
    }
  }, [data]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if ((isLoading && page === 1) || (isFetching && page === 1)) {
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
            setVideos={setVideos}
            videos={videos}
            currentActiveId={selectedMovieId}
            setShowVideoFeed={setShowVideoFeed}
            query={query}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="pb-5">
        {videos?.length <= 0 ? (
          <NoVideoCard />
        ) : (
          <>
            <div>
              <div className="grid grid-cols-2 gap-">
                {videos?.map((item: any) => (
                  <div
                    key={item.post_id}
                    onClick={() => {
                      // console.log(item);
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
              <InfinitLoad
                data={videos}
                fetchData={fetchMoreData}
                hasMore={hasMore}
              />
              <div className="py-[38px]"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreatedVideo;
