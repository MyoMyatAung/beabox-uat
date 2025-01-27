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
import withFollowData from "@/hocs/withFollowData";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
const Stats = ({ followers, following, nickname, likeCount }: any) => {
  const isDrawerOpen = useSelector((state: any) => state.profile.isDrawerOpen);
  const user = useSelector((state: any) => state.persist.user);
  // console.log(user);

  const { data } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data?.data);
  const dispatch = useDispatch();
  return (
    <Drawer
    // open={isDrawerOpen}
    // onOpenChange={() => dispatch(setIsDrawerOpen(true))}
    >
      <div className="z-[1200] flex justify-between w-full max-w-xs my-4 items-center mx-auto">
        <div className="z-[1200] text-center">
          {user?.token ? (
            <DrawerTrigger
              asChild
              onClick={() => dispatch(setDefaultFollowTab("follower"))}
            >
              <div>
                <div className="z-[1200] text-[14px] font-semibold">
                  {/* {followers?.length ? followers?.length : 0} */}
                  {data?.data?.followers_count
                    ? data?.data?.followers_count
                    : "0"}
                </div>
                <div className="z-[1200] text-gray-400 text-[14px]">粉丝</div>
              </div>
            </DrawerTrigger>
          ) : (
            <div>
              <div className="z-[1200] text-[14px] font-semibold">
                {/* {followers?.length ? followers?.length : 0} */}
                {data?.data?.followers_count
                  ? data?.data?.followers_count
                  : "0"}
              </div>
              <div className="z-[1200] text-gray-400 text-[14px]">粉丝</div>
            </div>
          )}
        </div>
        <span className="z-[1200] text-gray-500">|</span>
        <div className="z-[1200] text-center">
          {user?.token ? (
            <DrawerTrigger
              asChild
              onClick={() => dispatch(setDefaultFollowTab("following"))}
            >
              <div>
                <div className="z-[1200] text-[14px] font-semibold">
                  {/* {following?.length ? following?.length : 0} */}
                  {data?.data?.following_count
                    ? data?.data?.following_count
                    : "0"}
                </div>
                <div className="z-[1200] text-gray-400 text-[14px]">已关注</div>
              </div>
            </DrawerTrigger>
          ) : (
            <div>
              <div className="z-[1200] text-[14px] font-semibold">
                {/* {following?.length ? following?.length : 0} */}
                {data?.data?.following_count
                  ? data?.data?.following_count
                  : "0"}
              </div>
              <div className="z-[1200] text-gray-400 text-[14px]">已关注</div>
            </div>
          )}
        </div>
        <span className="z-[1200] text-gray-500">|</span>
        <div className="z-[1200] text-center">
          <div className="z-[1200] text-[14px] font-semibold">
            {data?.data?.likes_sum_count ? data?.data?.likes_sum_count : "0"}
          </div>
          <div className="z-[1200] text-gray-400 text-[14px]">点赞</div>
        </div>
      </div>
      <DrawerContent className="z-[1300] border-0">
        <div className="z-[1200] c-height w-full px-5 bg-[#16131C]">
          <div className="z-[1200] flex justify-between items-center py-5">
            <DrawerClose asChild>
              <button onClick={() => dispatch(setIsDrawerOpen(false))}>
                <FaAngleLeft size={18} />
              </button>
            </DrawerClose>
            <p className="z-[1200] text-[16px]">{nickname}</p>
            <div></div>
          </div>

          <FollowTabs />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default withFollowData(Stats);
