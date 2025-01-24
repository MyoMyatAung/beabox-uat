import { Button } from "@/components/ui/button";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import loader from "@/page/home/vod_loader.gif";
import { useEffect, useState } from "react";

const FollowStatusBtn = ({ userData, id, refetch, userLoading }: any) => {
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
  return (
    <Button
      disabled={isLoading || userLoading}
      onClick={handleChangeFollowStatus}
      className={`w-full ${
        userData?.data?.is_following
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      } rounded-[12px]`}
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
