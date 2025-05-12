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
import { useEffect, useState } from "react";
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
  // console.log(user, "user data");

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
      defaultValue={defaultTab}
      className="py-5"
      onValueChange={handleTabChange}
    >
      <TabsList
        className={`grid w-full grid-cols-3  z-[1600] bg-transparent sticky top-[100px]`}
      >
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
                  <span className="flex items-center gap-2 flex-col justify-center dropdown-trigger">
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
                <DropdownMenuContent className="dropdown-content w-[97px] bg-[#252525EB] border-0">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <div
                        className="w-full flex items-center justify-between text-white"
                        onClick={() => dispatch(setSort("created_at"))}
                      >
                        <p className="text-white text-[14px]">最新</p>
                        {sort == "created_at" ? <Check /> : <></>}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        className="w-full flex items-center justify-between text-white"
                        onClick={() => dispatch(setSort("score"))}
                      >
                        <p className="text-white text-[14px]">热门</p>
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
        )}

        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
          value="liked"
        >
          <span className="flex items-center gap-2 flex-col justify-center">
            <div className={`w-[52px] h-[3px] bg-transparent`}></div>
            <FaHeart />
            <div
              className={`w-[52px] h-[3px] ${
                defaultTab == "liked" && "bg-white"
              }`}
            ></div>
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-full text-[17px] py-2 flex items-center gap-2"
          value="history"
        >
          <span className="flex items-center gap-2 flex-col justify-center">
            <div className={`w-[52px] h-[3px] bg-transparent`}></div>
            <MdWatchLater />
            <div
              className={`w-[52px] h-[3px] ${
                defaultTab == "history" && "bg-white"
              }`}
            ></div>
          </span>
        </TabsTrigger>
      </TabsList>
      <div className="h-[1px] bg-[#FFFFFF14] w-full mt-3.5"></div>
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
