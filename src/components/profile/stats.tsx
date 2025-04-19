/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaAngleLeft } from "react-icons/fa";
import FollowTabs from "./follow-tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultFollowTab,
  setIsDrawerOpen,
} from "@/store/slices/profileSlice";
import { useEffect, useState } from "react";
import { useGetFollowingListQuery } from "@/store/api/profileApi";
function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
}
const Stats = ({ followers, followings, likes, nickname }: any) => {
  const [vh, setVh] = useState("100vh");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.persist?.user);

  const user_code = useSelector((state: any) => state.persist?.user?.id);

  const { data, isLoading, isFetching, refetch } = useGetFollowingListQuery({
    user_id: user_code,
    // search: searchTerm,
    page: 1,
  });

  useEffect(() => {
    // setVh(isMobile ? "95vh" : "100vh");
    setVh(isWebView() ? "100vh" : "100dvh");
  }, []);

  useEffect(() => {
    refetch();
  }, [isOpen, refetch]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="z-[1900] px-5 flex justify-between w-full max-w-xs items-center mx-auto">
        <div className="z-[1900] text-center">
          {user?.token ? (
            <DrawerTrigger
              asChild
              onClick={() => dispatch(setDefaultFollowTab("follower"))}
            >
              <div>
                <div className="z-[1900] text-[14px] font-semibold">
                  {/* {followers?.length ? followers?.length : 0} */}
                  {followers ? followers : "0"}
                </div>
                <div className="z-[1900] text-gray-400 text-[14px]">粉丝</div>
              </div>
            </DrawerTrigger>
          ) : (
            <div>
              <div className="z-[1900] text-[14px] font-semibold">
                {/* {followers?.length ? followers?.length : 0} */}
                {followers ? followers : "0"}
              </div>
              <div className="z-[1900] text-gray-400 text-[14px]">粉丝</div>
            </div>
          )}
        </div>
        <span className="z-[1900] w-[1px] h-[12px] line-bg"></span>
        <div className="z-[1900] text-center">
          {user?.token ? (
            <DrawerTrigger
              asChild
              onClick={() => dispatch(setDefaultFollowTab("following"))}
            >
              <div>
                <div className="z-[1900] text-[14px] font-semibold">
                  {/* {following?.length ? following?.length : 0} */}
                  {followings ? followings : "0"}
                </div>
                <div className="z-[1900] text-gray-400 text-[14px]">已关注</div>
              </div>
            </DrawerTrigger>
          ) : (
            <div>
              <div className="z-[1900] text-[14px] font-semibold">
                {/* {following?.length ? following?.length : 0} */}
                {followings ? followings : "0"}
              </div>
              <div className="z-[1900] text-gray-400 text-[14px]">已关注</div>
            </div>
          )}
        </div>
        <span className="z-[1900] w-[1px] h-[12px] line-bg"></span>
        <div className="z-[1900] text-center">
          <div className="z-[1900] text-[14px] font-semibold">
            {likes ? likes : "0"}
          </div>
          <div className="z-[1900] text-gray-400 text-[14px]">点赞</div>
        </div>
      </div>
      <DrawerContent className="z-[1900] border-0" style={{ height: vh }}>
        <div className="z-[1900] overflow-y-scroll hide-sb overflow-x-hidden bg-[#16131C]">
          <div className="px-5">
            <div className="z-[1900] sticky -top-1 bg-[#16131C] w-full flex justify-between items-center h-[50px]">
              <DrawerClose asChild>
                <button onClick={() => dispatch(setIsDrawerOpen(false))}>
                  <FaAngleLeft size={22} />
                </button>
              </DrawerClose>
              <p className="z-[1900] text-[16px]">{nickname}</p>
              <div></div>
            </div>
            <div className="">
              <FollowTabs />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Stats;
