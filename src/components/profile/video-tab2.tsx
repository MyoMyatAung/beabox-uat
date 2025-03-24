// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Horin, Play } from "@/assets/profile";
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
//       <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
//           value="video"
//           onClick={() => dispatch(setDefaultTab2("video"))}
//         >
//           <span className="flex items-center gap-2 flex-col justify-center">
//             <div className="w-[52px] h-[3px] bg-transparent"></div>
//             <Horin active={defaultTab2 == "video" ? true : false} />
//             {/* <div className="flex flex-col items-center justify-center">
//                           <LuTally3 size={12} />
//                           <LuTally3 size={12} />
//                         </div> */}
//             {/* 我的作品 */}
//             <div
//               className={`w-[52px] h-[3px] ${
//                 defaultTab2 == "video" && "bg-white"
//               }`}
//             ></div>
//           </span>
//           {/* <span className="flex items-center gap-1">
//             <Play /> 的作品
//           </span> */}
//         </TabsTrigger>
//         <TabsTrigger
//           className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
//           value="liked"
//           onClick={() => dispatch(setDefaultTab2("liked"))}
//         >
//           <span className="flex items-center gap-2 flex-col justify-center">
//             <div className={`w-[52px] h-[3px] bg-transparent`}></div>
//             <FaHeart />
//             <div
//               className={`w-[52px] h-[3px] ${
//                 defaultTab2 == "liked" && "bg-white"
//               }`}
//             ></div>
//             {/* 已点赞视频 */}
//           </span>
//           {/* <span className="flex items-center gap-1">
//             <FaHeart /> 已点赞视频
//           </span> */}
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import CreatedVideo from "./video/created-video";
import LikedVideos from "./video/liked-videos";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultTab2 } from "@/store/slices/persistSlice";
import LikedVideos2 from "./video/like-videos2";

const VideoTab2 = ({ id, visibility, showHeader }: any) => {
  const defaultTab2 = useSelector((state: any) => state.persist.defaultTab2);
  const dispatch = useDispatch();
  return (
    <Tabs defaultValue={defaultTab2 ? defaultTab2 : "video"} className="my-5">
      {/* <Tabs defaultValue={"liked"} className="my-5"> */}
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
          value="video"
          onClick={() => dispatch(setDefaultTab2("video"))}
        >
          <span className="flex items-center gap-1">
            <Play /> Ta的作品
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2 "
          value="liked"
          onClick={() => dispatch(setDefaultTab2("liked"))}
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
        <LikedVideos2 id={id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTab2;
