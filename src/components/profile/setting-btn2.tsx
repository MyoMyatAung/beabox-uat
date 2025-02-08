import {
  Menu,
  Wallet,
  Settings,
  QrCode,
  UserPen,
  UserCog,
  EllipsisVertical,
  Flag,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";
import { useState } from "react";
import Divider from "../shared/divider";
import UserStar from "@/assets/user-star.png";

const SettingBtn2 = ({ id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const data = [
    {
      title: "举报",
      icon: <Flag size={20} />,
      link: `/reports/profile/${id}`,
    },
  ];
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center">
          <EllipsisVertical />
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1500]">
        <div className="w-full px-5 py-7">
          <div className="space-x-3">
            {data?.map((item) => (
              <div
                key={item?.title}
                onClick={() => navigate(item?.link)}
                className="flex flex-col items-start justify-start gap-1"
              >
                <div className="bg-[#FFFFFF1F] p-2 rounded-full">
                  {item?.icon}
                </div>
                <span className="text-[14px]">{item?.title}</span>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingBtn2;
