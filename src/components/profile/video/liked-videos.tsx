import React, { useEffect, useState } from "react";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import Loader from "@/page/home/vod_loader.gif";
import { NoVideo } from "@/assets/profile";
import InfinitLoad from "@/components/shared/infinit-load";
import VideoCard from "../video-card";
import VideoFeed from "@/page/home/components/VideoFeed";
import { useSearchParams } from "react-router-dom";
import NoVideoCard from "@/components/shared/no-video-card";

const LikedVideos = ({ id }: any) => {
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

  const { data, isLoading } = useGetLikedPostQuery(
    { user_id: id, page },
    { skip: !user }
  );

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

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center w-full py-[200px]">
        <div>
          <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
        </div>
      </div>
    );
  }
  console.log(showVideoFeed, selectedMovieId);
  return (
    <>
      {showVideoFeed && selectedMovieId ? (
        <div className="z-[9900] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
          <VideoFeed
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
        {!user?.token || videos.length <= 0 ? (
          <NoVideoCard from="liked" />
        ) : (
          <>
            <div>
              <div className="grid grid-cols-3 gap-1">
                {videos.map((item: any) => (
                  <div
                    key={item.post_id}
                    onClick={() => {
                      // console.log(item);
                      setSelectedMovieId(item?.post_id);
                      setShowVideoFeed(true);
                    }}
                  >
                    <VideoCard videoData={item} />
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

export default LikedVideos;
