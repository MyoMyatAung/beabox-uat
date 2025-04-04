import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Horin, Play } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import LikedVideos from "./video/liked-videos";
import HistoryVideos from "./video/history-videos";
import { LuTally3 } from "react-icons/lu";
import { setDefaultTab } from "@/store/slices/persistSlice";
import CreatedVideo2 from "./video/create-video2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { setSort } from "@/store/slices/profileSlice";
import { Check } from "lucide-react";
import upsort from "@/assets/upsort.svg";

const VideoTabs = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const sort = useSelector((state: any) => state.profile.sort);
  const [isOpen, setIsOpen] = useState(false);

  const defaultTab = useSelector((state: any) => state?.persist?.defaultTab);
  const dispatch = useDispatch();

  const handleTabChange = (value: string) => {
    // console.log("Current tab value:", value);
    dispatch(setDefaultTab(value));
  };
  return (
    <Tabs
      defaultValue={user?.token ? defaultTab : "liked"}
      className="py-5"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px]">
        {user?.token ? (
          defaultTab == "upload" ? (
            <TabsTrigger
              className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
              // onClick={() => dispatch(setDefaultTab("upload"))}
              value="upload"
              asChild
            >
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <span className="flex items-center gap-2 flex-col justify-center">
                    <div className="w-[52px] h-[3px] bg-transparent"></div>

                    {isOpen ? (
                      <img src={upsort} alt="" />
                    ) : (
                      <Horin active={defaultTab == "upload" ? true : false} />
                    )}
                    {/*  */}

                    <div
                      className={`w-[52px] h-[3px] ${
                        defaultTab == "upload" && "bg-white"
                      }`}
                    ></div>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[97px] bg-[#252525EB] border-0">
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
              // onClick={() => dispatch(setDefaultTab("upload"))}
              value="upload"
              asChild
            >
              <span className="flex items-center gap-2 flex-col justify-center">
                <div className="w-[52px] h-[3px] bg-transparent"></div>
                <Horin active={defaultTab == "upload" ? true : false} />
                <div
                  className={`w-[52px] h-[3px] ${
                    defaultTab == "upload" && "bg-white"
                  }`}
                ></div>
              </span>
            </TabsTrigger>
          )
        ) : (
          <></>
        )}
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
          value="liked"
          // onClick={() => dispatch(setDefaultTab("liked"))}
        >
          <span className="flex items-center gap-2 flex-col justify-center">
            <div className={`w-[52px] h-[3px] bg-transparent`}></div>
            <FaHeart />
            <div
              className={`w-[52px] h-[3px] ${
                defaultTab == "liked" && "bg-white"
              }`}
            ></div>
            {/* 已点赞视频 */}
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
          value="history"
          // onClick={() => dispatch(setDefaultTab("history"))}
        >
          <span className="flex items-center gap-2 flex-col justify-center">
            <div className={`w-[52px] h-[3px] bg-transparent`}></div>
            <MdWatchLater />
            {/* 观看历史 */}
            <div
              className={`w-[52px] h-[3px] ${
                defaultTab == "history" && "bg-white"
              }`}
            ></div>
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="liked">
        <LikedVideos id={user?.id} />
      </TabsContent>
      <TabsContent value="history">
        <HistoryVideos />
      </TabsContent>
      <TabsContent value="upload">
        <CreatedVideo2 id={user?.id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Play } from "@/assets/profile";
// import { FaHeart } from "react-icons/fa";
// import { MdWatchLater } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import LikedVideos from "./video/liked-videos";
// import HistoryVideos from "./video/history-videos";
// import CreatedVideo from "./video/created-video";
// import { setDefaultTab } from "@/store/slices/persistSlice";
// import CreatedVideo2 from "./video/create-video2";

// const VideoTabs = () => {
//   const user = useSelector((state: any) => state?.persist?.user);
//   const defaultTab = useSelector((state: any) => state?.persist?.defaultTab);
//   const dispatch = useDispatch();
//   // console.log(defaultTab, "defaultab");
//   return (
//     <Tabs defaultValue={defaultTab ? defaultTab : "liked"} className="py-5">
//       <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
//         {/* {user?.token ? (
//           <TabsTrigger
//             className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
//             onClick={() => dispatch(setDefaultTab ? defaultTab : "liked"("upload"))}
//             value="upload"
//           >
//             <span className="flex items-center gap-1">
//               <Play /> 我的作品
//             </span>
//           </TabsTrigger>
//         ) : (
//           <></>
//         )} */}
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
//           value="liked"
//           onClick={() => dispatch(setDefaultTab("liked"))}
//         >
//           <span className="flex items-center gap-1">
//             <FaHeart /> 已点赞视频
//           </span>
//         </TabsTrigger>
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
//           value="history"
//           onClick={() => dispatch(setDefaultTab("history"))}
//         >
//           <span className="flex items-center gap-1">
//             <MdWatchLater /> 观看历史
//           </span>
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="liked">
//         <LikedVideos id={user?.id} />
//       </TabsContent>
//       <TabsContent value="history">
//         <HistoryVideos />
//       </TabsContent>
//       <TabsContent value="upload">
//         <CreatedVideo2 id={user?.id} />
//       </TabsContent>
//     </Tabs>
//   );
// };

// export default VideoTabs;
