import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Horin } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import CreatedVideo from "./video/created-video";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultTab2 } from "@/store/slices/persistSlice";
import LikedVideos2 from "./video/like-videos2";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
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
      value={defaultTab2 ? defaultTab2 : "video"}
      onValueChange={handleTabChange}
    >
      <div className="sticky top-[65px] z-[1650] -mx-5 bg-[#15131c]">
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          {defaultTab2 === "video" ? (
            <TabsTrigger
              className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
              value="video"
              asChild
            >
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <span className="dropdown-trigger flex flex-col items-center justify-center gap-3">
                    <div className="h-[3px] w-[52px] bg-transparent"></div>
                    {isOpen ? (
                      <img src={upsort} alt="" className="h-5 w-5" />
                    ) : (
                      <Horin active={defaultTab2 === "video"} />
                    )}
                    <div
                      className={`h-[3px] w-[52px] ${
                        defaultTab2 === "video" ? "bg-white" : "bg-transparent"
                      }`}
                    ></div>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dropdown-content w-[97px] border-0 bg-[#252525EB]">
                  <DropdownMenuItem
                    onClick={() => dispatch(setSort("created_at"))}
                  >
                    <div className="flex w-full items-center justify-between text-white">
                      <p className="text-[14px] text-white">最新</p>
                      {sort === "created_at" && <Check className="h-4 w-4" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => dispatch(setSort("score"))}>
                    <div className="flex w-full items-center justify-between text-white">
                      <p className="text-[14px] text-white">热门</p>
                      {sort === "score" && <Check className="h-4 w-4" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsTrigger>
          ) : (
            <TabsTrigger
              className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
              value="video"
              asChild
            >
              <span className="flex flex-col items-center justify-center gap-3">
                <div className="h-[3px] w-[52px] bg-transparent"></div>
                <Horin active={false} />
                <div className="h-[3px] w-[52px] bg-transparent"></div>
              </span>
            </TabsTrigger>
          )}

          {/* Liked Tab */}
          <TabsTrigger
            className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
            value="liked"
          >
            <span className="flex flex-col items-center justify-center gap-3">
              <div className="h-[3px] w-[52px] bg-transparent"></div>
              <FaHeart />
              <div
                className={`h-[3px] w-[52px] ${
                  defaultTab2 === "liked" ? "bg-white" : "bg-transparent"
                }`}
              ></div>
            </span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-[22px] h-[1px] w-full bg-[#FFFFFF14]"></div>
      </div>

      {/* Tab Content */}
      <TabsContent value="video" className="px-1">
        <CreatedVideo id={id} />
      </TabsContent>

      <TabsContent value="liked" className="px-1">
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
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[14px] py-2 flex items-center gap-2 "
//           value="video"
//           onClick={() => dispatch(setDefaultTab2("video"))}
//         >
//           <span className="flex items-center gap-1">
//             <Play /> Ta的作品
//           </span>
//         </TabsTrigger>
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[14px] py-2 flex items-center gap-2 "
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
