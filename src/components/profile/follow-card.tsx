import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { AvatarImage, Avatar } from "../ui/avatar";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import FollowBtn from "./follow-btn";

const FollowCard = ({ data }: { data: any }) => {
  const [changeFollowStatus, { data: statusData, isLoading }] =
    useChangeFollowStatusMutation();
  const changeFollowStatusHandler = async () => {
    try {
      await changeFollowStatus({
        follow_user_id: data?.user_code,
        status: data?.follows_back === true ? "unfollow" : "follow",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center py-1">
      <Link
        to={paths.getUserProfileId(data?.id)}
        className="flex items-center gap-4"
      >
        <Avatar className="border-2">
          <AvatarImage src={data?.photo} alt="@shadcn" />
        </Avatar>
        <div className="text-[14px] space-y-2">
          <h1>{data?.nickname}</h1>
          <h1 className="text-[#888]">ID : {data?.user_code}</h1>
        </div>
      </Link>
      <FollowBtn id={data?.id} followBack={data?.follows_back} />
      {/* <Button
        onClick={() => changeFollowStatusHandler(data?.user_code)}
        className={`${
          data?.follows_back ? "bg-[#FFFFFF17]" : "gradient-bg"
        } w-[88px]`}
        size={"sm"}
      >
        {data?.follows_back ? "Following" : "Follow"}
      </Button> */}
    </div>
  );
};

export default FollowCard;
