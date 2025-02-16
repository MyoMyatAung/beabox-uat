import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoVideo, PersonLock, Play } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { useGetLikedPostQuery, useGetPostsQuery } from "@/store/api/profileApi";
import Loader from "../../page/home/vod_loader.gif";
import { useEffect, useState } from "react";
import { BsPersonLock } from "react-icons/bs";
import CreatedVideo from "./video/created-video";
import LikedVideos from "./video/liked-videos";

const VideoTab2 = ({ id, visibility, showHeader }: any) => {
  return (
    <Tabs defaultValue="video" className="my-5">
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px]">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
          value="video"
        >
          <span className="flex items-center gap-1">
            <Play /> 他的作品
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
          value="liked"
        >
          <span className="flex items-center gap-1">
            <FaHeart /> 已点赞视频
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="video">
        <CreatedVideo id={id} />
      </TabsContent>
      <TabsContent value="liked">
        <LikedVideos id={id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTab2;
