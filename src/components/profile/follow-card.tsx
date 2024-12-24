import { AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";

const FollowCard = ({ following }: { following?: boolean }) => {
  return (
    <div className="w-full flex justify-between items-center py-1">
      <div className="flex items-center gap-4">
        <Avatar className="border-2">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
        <div className="text-[14px] space-y-2">
          <h1>Ken</h1>
          <h1 className="text-[#888]">ID : kim2003</h1>
        </div>
      </div>
      <Button
        className={`${following ? "bg-[#FFFFFF17]" : "gradient-bg"} w-[88px]`}
        size={"sm"}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowCard;
