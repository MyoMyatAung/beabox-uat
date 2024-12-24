/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";

const MenuCard = ({ Icon, title }: any) => {
  const navigate = useNavigate();
  return (
    <Card onClick={()=>navigate('/wallet')} className="bg-[#181818] border-0 h-[76px] flex justify-center items-center flex-col gap-2 shadow-lg">
      <div className="">
        <Icon />
      </div>
      <p className="text-white text-[12px]">{title}</p>
    </Card>
  );
};

export default MenuCard;
