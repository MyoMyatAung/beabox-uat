import { Card } from "../ui/card";

const MenuCard = ({ Icon, title }: any) => {
  return (
    <Card className="bg-[#181818] border-0 h-[76px] flex justify-center items-center flex-col gap-2 shadow-lg">
      <div className="">
        <Icon />
      </div>
      <p className="text-white text-[12px]">{title}</p>
    </Card>
  );
};

export default MenuCard;
