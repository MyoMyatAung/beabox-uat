import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FaAngleLeft } from "react-icons/fa";
import FollowTabs from "./follow-tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultFollowTab,
  setIsDrawerOpen,
} from "@/store/slices/profileSlice";
const Stats = ({
  follower,
  following,
  like,
}: {
  follower: number;
  following: number;
  like: number;
}) => {
  const isDrawerOpen = useSelector((state: any) => state.profile.isDrawerOpen);
  const dispatch = useDispatch();
  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={() => dispatch(setIsDrawerOpen(true))}
    >
      <div className="flex justify-between w-full max-w-xs my-4 items-center mx-auto">
        <div className="text-center">
          <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("follower"))}
          >
            <div>
              <div className="text-[14px] font-semibold">{follower}</div>
              <div className="text-gray-400 text-[14px]">Follower</div>
            </div>
          </DrawerTrigger>
        </div>
        <span className="text-gray-500">|</span>
        <div className="text-center">
          <DrawerTrigger
            asChild
            onClick={() => dispatch(setDefaultFollowTab("following"))}
          >
            <div>
              <div className="text-[14px] font-semibold">{following}</div>
              <div className="text-gray-400 text-[14px]">Following</div>
            </div>
          </DrawerTrigger>
        </div>
        <span className="text-gray-500">|</span>
        <div className="text-center">
          <div className="text-[14px] font-semibold">{like}</div>
          <div className="text-gray-400 text-[14px]">Like</div>
        </div>
      </div>
      <DrawerContent className="border-0">
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => dispatch(setIsDrawerOpen(false))}>
              <FaAngleLeft size={18} />
            </button>
            <p className="text-[16px]">Kimmy</p>
            <div></div>
          </div>

          <FollowTabs />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Stats;
