import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FaAngleLeft } from "react-icons/fa";
import FollowTabs from "./follow-tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultFollowTab,
  setIsDrawerOpen,
} from "@/store/slices/profileSlice";
const OtherStats = ({ followers, following, nickname }: any) => {
  const isDrawerOpen = useSelector((state: any) => state.profile.isDrawerOpen);
  const dispatch = useDispatch();
  return (
    // <Drawer
    //   open={isDrawerOpen}
    //   onOpenChange={() => dispatch(setIsDrawerOpen(true))}
    // >
      <div className="flex justify-between w-full max-w-xs my-4 items-center mx-auto">
        <div className="text-center">
          {/* <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("follower"))}
          > */}
            <div>
              <div className="text-[14px] font-semibold">
                {followers ? followers : 0}
              </div>
              <div className="text-gray-400 text-[14px]">粉丝</div>
            </div>
          {/* </DrawerTrigger> */}
        </div>
        <span className="text-gray-500">|</span>
        <div className="text-center">
          {/* <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("following"))}
          > */}
            <div>
              <div className="text-[14px] font-semibold">
                {following ? following : 0}
              </div>
              <div className="text-gray-400 text-[14px]">已关注</div>
            </div>
          {/* </DrawerTrigger> */}
        </div>
        <span className="text-gray-500">|</span>
        <div className="text-center">
          <div className="text-[14px] font-semibold">0</div>
          <div className="text-gray-400 text-[14px]">点赞</div>
        </div>
      </div>
  );
};

export default OtherStats;
