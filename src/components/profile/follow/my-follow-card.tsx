import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";

const MyFollowCard = ({ data }: { data: any }) => {
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

      <div className=""></div>
    </div>
  );
};

export default MyFollowCard;
