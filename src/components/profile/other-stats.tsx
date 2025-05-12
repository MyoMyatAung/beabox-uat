import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaAngleLeft } from "react-icons/fa";
import FollowTabs2 from "./follow/follow-tab2";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
}
const OtherStats = ({ followers, followings, likes, nickname, id }: any) => {
  const [defaultFollowTab, setDefaultFollowTab] = useState("follower");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [vh, setVh] = useState("100vh");
  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [id, isOpen]);
  useEffect(() => {
    // setVh(isMobile ? "95vh" : "100vh");
    setVh(isWebView() ? "100vh" : "100dvh");
  }, []);
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="z-[1900] px-5 flex justify-between w-full max-w-xs my-4 items-center mx-auto">
        <DrawerTrigger asChild onClick={() => setDefaultFollowTab("follower")}>
          <div className="flex flex-col items-center">
            <div className="z-[1900] text-[14px] font-semibold">
              {/* {followers?.length ? followers?.length : 0} */}
              {followers ? followers : "0"}
            </div>
            <div className="z-[1900] text-gray-400 text-[16px]">粉丝</div>
          </div>
        </DrawerTrigger>
        <span className="z-[1900] w-[1px] h-[12px] line-bg"></span>
        <div className="z-[1900] text-center">
          <DrawerTrigger
            asChild
            onClick={() => setDefaultFollowTab("following")}
          >
            <div>
              <div className="z-[1900] text-[14px] font-semibold">
                {/* {following?.length ? following?.length : 0} */}
                {followings ? followings : "0"}
              </div>
              <div className="z-[1900] text-gray-400 text-[16px]">已关注</div>
            </div>
          </DrawerTrigger>
        </div>
        <span className="z-[1900] w-[1px] h-[12px] line-bg"></span>
        <div className="z-[1900] text-center">
          <div className="z-[1900] text-[14px] font-semibold">
            {likes ? likes : "0"}
          </div>
          <div className="z-[1900] text-gray-400 text-[16px]">点赞</div>
        </div>
      </div>
      <DrawerContent className="z-[2300] border-0" style={{ height: vh }}>
        <div className="z-[1200] overflow-y-scroll hide-sb overflow-x-hidden bg-[#16131C]">
          <div className="px-5">
            <div className="z-[1200] sticky -top-1 bg-[#16131C] w-full flex justify-between items-center h-[50px]">
              <DrawerClose asChild>
                <button onClick={() => setIsDrawerOpen(false)}>
                  <FaAngleLeft size={18} />
                </button>
              </DrawerClose>
              <p className="z-[1200] text-[16px]">{nickname}</p>
              <div></div>
            </div>
            <div className="">
              <FollowTabs2
                id={id}
                defaultFollowTab={defaultFollowTab}
                closeTab={setIsDrawerOpen}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OtherStats;
