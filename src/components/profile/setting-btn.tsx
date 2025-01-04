import { Menu, Wallet, Settings, QrCode, UserPen } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";

const SettingBtn = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.persist.user);

  const data = [
    {
      title: "Balance",
      icon: <Wallet size={14} />,
      link: paths.wallet,
    },
    {
      title: "Creator Centre",
      icon: <UserPen size={14} />,
      link: paths.settings,
    },
    {
      title: "Edit Profile",
      icon: <UserPen size={14} />,
      link: paths.profileDetail,
    },
    {
      title: "Invitation QR",
      icon: <QrCode size={14} />,
      link: paths.wallet_invite,
    },
    {
      title: "Setting & Privacy",
      icon: <Settings size={14} />,
      link: paths.settings,
    },
  ];
  const data2 = [
    {
      title: "Balance",
      icon: <Wallet size={14} />,
      link: paths.wallet,
    },
    {
      title: "Creator Centre",
      icon: <UserPen size={14} />,
      link: paths.settings,
    },
    {
      title: "Setting & Privacy",
      icon: <Settings size={14} />,
      link: paths.settings,
    },
  ];
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center">
          <Menu />
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <div className="space-y-6">
            {(user?.token ? data : data2)?.map(({ title, icon, link }: any) => (
              <div key={title} onClick={() => navigate(link)}>
                <p className="text-[14px] flex items-center gap-2">
                  {icon}
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingBtn;
