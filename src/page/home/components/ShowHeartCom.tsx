import heart from "../heart.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ShowHeartCom = ({
  countNumber,
  nickname,
  photo,
}: {
  countNumber: any;
  nickname: any;
  photo: any;
}) => {
  return (
    <div className="absolute bottom-[180px] left-[10px]  z-[99]">
      <div className="">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {photo ? (
              <Avatar className="w-[35.25px] h-[35.25px] ">
                <AvatarImage src={photo} />
              </Avatar>
            ) : (
              <Avatar className="w-[35.25px] h-[35.25px] ">
                <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
              </Avatar>
            )}

            <span className="like_user">{nickname}</span>
          </div>
          <div className="flex items-end">
            <img src={heart} width={42} height={42} alt="" />
            <span className="count_x">x {countNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowHeartCom;
