import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Horin, Play } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import CreatedVideo from "./video/created-video";
import LikedVideos from "./video/liked-videos";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultTab2 } from "@/store/slices/persistSlice";
import LikedVideos2 from "./video/like-videos2";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import upsort from "@/assets/upsort.svg";
import { setSort } from "@/store/slices/profileSlice";
import { Check } from "lucide-react";

const VideoTab2 = ({ id, visibility, showHeader }: any) => {
  const defaultTab2 = useSelector((state: any) => state.persist.defaultTab2);
  const [isOpen, setIsOpen] = useState(false);
  const sort = useSelector((state: any) => state.profile.sort);

  const dispatch = useDispatch();
  const handleTabChange = (value: string) => {
    // console.log("Current tab value:", value);
    dispatch(setDefaultTab2(value));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;

      // Check if click is outside dropdown content and trigger
      const content = document.querySelector(".dropdown-content");
      const trigger = document.querySelector(".dropdown-trigger");

      const isInsideContent = content?.contains(event.target as Node) || false;
      const isInsideTrigger = trigger?.contains(event.target as Node) || false;

      if (!isInsideContent && !isInsideTrigger) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <Tabs
      defaultValue={defaultTab2 ? defaultTab2 : "video"}
      className="my-5"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
        {defaultTab2 == "video" ? (
          <TabsTrigger
            className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
            // onClick={() => dispatch(setDefaultTab("upload"))}
            value="video"
            asChild
          >
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <span className="flex items-center gap-2 flex-col justify-center dropdown-trigger">
                  <div className="w-[52px] h-[3px] bg-transparent"></div>

                  {isOpen ? (
                    <img src={upsort} alt="" />
                  ) : (
                    <Horin active={defaultTab2 == "video" ? true : false} />
                  )}
                  {/*  */}

                  <div
                    className={`w-[52px] h-[3px] ${
                      defaultTab2 == "video" && "bg-white"
                    }`}
                  ></div>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-content w-[97px] bg-[#252525EB] border-0">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div
                      className="w-full flex items-center justify-between text-white"
                      onClick={() => dispatch(setSort("created_at"))}
                    >
                      <p className="text-white text-[12px]">最新</p>
                      {sort == "created_at" ? <Check /> : <></>}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div
                      className="w-full flex items-center justify-between text-white"
                      onClick={() => dispatch(setSort("score"))}
                    >
                      <p className="text-white text-[12px]">热门</p>
                      {sort == "score" ? <Check /> : <></>}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsTrigger>
        ) : (
          <TabsTrigger
            className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
            value="video"
            // onClick={() => dispatch(setDefaultTab2("video"))}
          >
            <span className="flex items-center gap-2 flex-col justify-center">
              <div className="w-[52px] h-[3px] bg-transparent"></div>
              <Horin active={defaultTab2 == "video" ? true : false} />
              <div
                className={`w-[52px] h-[3px] ${
                  defaultTab2 == "video" && "bg-white"
                }`}
              ></div>
            </span>
          </TabsTrigger>
        )}

        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
          value="liked"
          // onClick={() => dispatch(setDefaultTab2("liked"))}
        >
          <span className="flex items-center gap-2 flex-col justify-center">
            <div className={`w-[52px] h-[3px] bg-transparent`}></div>
            <FaHeart />
            <div
              className={`w-[52px] h-[3px] ${
                defaultTab2 == "liked" && "bg-white"
              }`}
            ></div>
            {/* 已点赞视频 */}
          </span>
          {/* <span className="flex items-center gap-1">
            <FaHeart /> 已点赞视频
          </span> */}
        </TabsTrigger>
      </TabsList>
      <div className="h-[1px] bg-[#FFFFFF14] w-full mt-3.5"></div>
      <TabsContent value="video">
        <CreatedVideo id={id} />
      </TabsContent>
      <TabsContent value="liked">
        <LikedVideos2 id={id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTab2;

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Play } from "@/assets/profile";
// import { FaHeart } from "react-icons/fa";
// import CreatedVideo from "./video/created-video";
// import LikedVideos from "./video/liked-videos";
// import { useDispatch, useSelector } from "react-redux";
// import { setDefaultTab2 } from "@/store/slices/persistSlice";
// import LikedVideos2 from "./video/like-videos2";

// const VideoTab2 = ({ id, visibility, showHeader }: any) => {
//   const defaultTab2 = useSelector((state: any) => state.persist.defaultTab2);
//   const dispatch = useDispatch();
//   return (
//     <Tabs defaultValue={defaultTab2 ? defaultTab2 : "video"} className="my-5">
//       {/* <Tabs defaultValue={"liked"} className="my-5"> */}
//       <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
//           value="video"
//           onClick={() => dispatch(setDefaultTab2("video"))}
//         >
//           <span className="flex items-center gap-1">
//             <Play /> Ta的作品
//           </span>
//         </TabsTrigger>
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
//           value="liked"
//           onClick={() => dispatch(setDefaultTab2("liked"))}
//         >
//           <span className="flex items-center gap-1">
//             <FaHeart /> 已点赞视频
//           </span>
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="video">
//         <CreatedVideo id={id} />
//       </TabsContent>
//       <TabsContent value="liked">
//         <LikedVideos2 id={id} />
//       </TabsContent>
//     </Tabs>
//   );
// };

// export default VideoTab2;
