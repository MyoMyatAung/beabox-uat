import { Button } from "@/components/ui/button";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import loader from "@/page/home/vod_loader.gif";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

const FollowStatusBtn = ({ userData, id, refetch, userLoading }: any) => {
  const token = useSelector((state: any) => state?.persist?.user?.token);
  const dispatch = useDispatch();
  const [follow, setFollow] = useState(
    userData?.data?.is_following ? true : false
  );
  const [changeFollowStatus, { data, isLoading }] =
    useChangeFollowStatusMutation();
  const handleChangeFollowStatus = async () => {
    await changeFollowStatus({
      follow_user_id: id,
      status: userData?.data?.is_following ? "unfollow" : "follow",
    });
    await refetch();
    setFollow(!follow);
  };

  const drawerHandler = async () => {
    dispatch(setIsDrawerOpen(true));
  };

  const refetchHandler = async () => {
    if (token?.length) await refetch();
  };

  useEffect(() => {
    refetchHandler();
  }, [token]);

  return (
    <Button
      disabled={isLoading || userLoading}
      onClick={token ? handleChangeFollowStatus : drawerHandler}
      className={`w-full ${
        userData?.data?.is_following
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      } rounded-[12px] z-[1200]`}
    >
      {isLoading ? (
        <img src={loader} alt="" className="w-12" />
      ) : follow ? (
        "已关注"
      ) : (
        "关注"
      )}
    </Button>
  );
};

export default FollowStatusBtn;
