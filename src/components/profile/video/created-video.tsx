import React, { useEffect, useState } from "react";
import { useGetLikedPostQuery, useGetPostsQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import Loader from "@/page/home/vod_loader.gif";
import { NoVideo } from "@/assets/profile";
import InfinitLoad from "@/components/shared/infinit-load";
import VideoCard from "../video-card";
const CreatedVideo = ({ id }: any) => {
  const user = useSelector((state: any) => state.persist.user);
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);

  const { data, isLoading } = useGetPostsQuery({ id, page }, { skip: !user });

  useEffect(() => {
    if (data?.data?.length) {
      // Append new data to the existing videos
      setVideos((prevVideos) => [...prevVideos, ...data.data]);
      setTotalData(data.pagination.total);
    }
  }, [data]);

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
  return (
    <div className="py-5">
      {!user?.token || videos.length <= 0 ? (
        <div>
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">这里空空如也～</p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="grid grid-cols-3 gap-2">
              {videos.map((item: any) => (
                <VideoCard key={item.id} videoData={item} />
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
  );
};

export default CreatedVideo;
