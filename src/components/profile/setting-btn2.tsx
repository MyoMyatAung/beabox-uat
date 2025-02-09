import {
  Menu,
  Wallet,
  Settings,
  QrCode,
  UserPen,
  UserCog,
  EllipsisVertical,
  Flag,
  Search,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";
import { useState } from "react";
import share from "@/assets/profile/share.svg";

const SettingBtn2 = ({ id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();

  const handleCopy = (text: any) => {
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

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
            {/* <div className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full">
              <Search size={18} />
            </div> */}
            <div
              onClick={() => handleCopy("Copied Link")}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <img src={share} alt="" />
            </div>
            <Link
              to={`/reports/profile/${id}`}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <Flag size={18} />
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingBtn2;
