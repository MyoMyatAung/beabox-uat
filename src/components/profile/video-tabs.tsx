import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Horin } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import LikedVideos from "./video/liked-videos";
import HistoryVideos from "./video/history-videos";
import { setDefaultTab } from "@/store/slices/persistSlice";
import CreatedVideo2 from "./video/create-video2";
import {
  DropdownMenu,
  DropdownMenuContent,
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
    <Tabs value={defaultTab} onValueChange={handleTabChange}>
      <div className="sticky top-[65px] z-[1650] -mx-5 bg-[#15131c]">
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          {user?.token ? (
            defaultTab === "upload" ? (
              <TabsTrigger
                className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="upload"
                asChild
              >
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild>
                    <span className="dropdown-trigger flex flex-col items-center justify-center gap-3">
                      <div className="h-[3px] w-[52px] bg-transparent"></div>
                      {isOpen ? (
                        <img src={upsort} alt="" className="h-5 w-5" />
                      ) : (
                        <Horin active={defaultTab === "upload"} />
                      )}
                      <div
                        className={`h-[3px] w-[52px] ${
                          defaultTab === "upload"
                            ? "bg-white"
                            : "bg-transparent"
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
                    <DropdownMenuItem
                      onClick={() => dispatch(setSort("score"))}
                    >
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
                value="upload"
                asChild
              >
                <span className="flex flex-col items-center justify-center gap-3">
                  <div className="h-[3px] w-[52px] bg-transparent"></div>
                  <Horin active={false} />
                  <div className="h-[3px] w-[52px] bg-transparent"></div>
                </span>
              </TabsTrigger>
            )
          ) : (
            <TabsTrigger
              className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
              value="upload"
              asChild
            >
              <span className="flex flex-col items-center justify-center gap-3">
                <div className="h-[3px] w-[52px] bg-transparent"></div>
                <Horin active={defaultTab === "upload"} />
                <div
                  className={`h-[3px] w-[52px] ${
                    defaultTab === "upload" ? "bg-white" : "bg-transparent"
                  }`}
                ></div>
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
                  defaultTab === "liked" ? "bg-white" : "bg-transparent"
                }`}
              ></div>
            </span>
          </TabsTrigger>

          {/* History Tab */}
          <TabsTrigger
            className="flex items-center gap-2 rounded-full py-2 text-[17px] text-[#888888] data-[state=active]:bg-transparent data-[state=active]:text-white"
            value="history"
          >
            <span className="flex flex-col items-center justify-center gap-3">
              <div className="h-[3px] w-[52px] bg-transparent"></div>
              <MdWatchLater />
              <div
                className={`h-[3px] w-[52px] ${
                  defaultTab === "history" ? "bg-white" : "bg-transparent"
                }`}
              ></div>
            </span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-[22px] h-[1px] w-full bg-[#FFFFFF14]"></div>
      </div>

      {/* Tab Content */}
      <TabsContent value="upload" className="px-1">
        <CreatedVideo2 id={user?.id} />
      </TabsContent>

      <TabsContent value="liked" className="px-1">
        <LikedVideos id={user?.id} />
      </TabsContent>

      <TabsContent value="history" className="px-1">
        <HistoryVideos />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
