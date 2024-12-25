import heart from "../heart.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ShowHeart = ({ countNumber }: { countNumber: any }) => {
  return (
    <div className="absolute bottom-[180px] left-[10px]  z-[99]">
      <div className="">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-[35.25px] h-[35.25px] border-2 border-white ">
              <AvatarImage src="https://i.pinimg.com/236x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <span className="like_user">Tesing Name</span>
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

export default ShowHeart;
