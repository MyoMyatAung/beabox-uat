import { Button } from "@/components/ui/button";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { useState } from "react";

const FollowBtn = ({ id, followBack }: any) => {
  const [follow, setFollow] = useState(followBack ? true : false);
  const [changeFollowStatus, { data, isLoading }] =
    useChangeFollowStatusMutation();
  const handleChangeFollowStatus = async () => {
    await changeFollowStatus({
      follow_user_id: id,
      status: followBack ? "unfollow" : "follow",
    });
    // await refetch();
    setFollow(!follow);
  };
  console.log(data);
  return (
    <Button
      disabled={isLoading}
      onClick={handleChangeFollowStatus}
      className={`w-[88px] ${
        follow
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      }`}
    >
      {follow ? "已关注" : "关注"}
    </Button>
  );
};

export default FollowBtn;
