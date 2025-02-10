import { Menu, Wallet, Settings, QrCode, UserPen, UserCog } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSelector } from "react-redux";
import { useState } from "react";
import Divider from "../shared/divider";
import UserStar from "@/assets/user-star.png";

const SettingBtn = ({ setShow }: any) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.persist.user);
  const [isOpen, setIsOpen] = useState(false);

  const data = [
    // {
    //   title: "Balance",
    //   icon: <Wallet size={14} />,
    //   link: paths.wallet,
    // },
    {
      title: "创作者中心",
      icon: <img src={UserStar} className="w-3.5" />,
      // link: paths.settings,
    },
    {
      title: "编辑资料",
      icon: <UserPen size={14} />,
      link: paths.profileDetail,
    },
    {
      title: "邀请码",
      icon: <QrCode size={14} />,
      link: paths.wallet_invite,
    },
    {
      title: "设置和隐私",
      icon: <Settings size={14} />,
      link: paths.settings,
    },
  ];
  const data2 = [
    {
      title: "创作者中心",
      icon: <img src={UserStar} className="w-3.5" />,
      // link: paths.settings,
    },
    // {
    //   title: "创作者中心",
    //   icon: <UserPen size={14} />,
    //   link: paths.settings,
    // },
    {
      title: "设置和隐私",
      icon: <Settings size={14} />,
      link: paths.settings,
    },
  ];
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center">
          <Menu />
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1600]">
        <div className="w-full px-5 py-7">
          <div className="space-y-3">
            {(user?.token ? data : data2)?.map(
              ({ title, icon, link }, index: any) => (
                <>
                  <div
                    key={title}
                    onClick={() => {
                      if (title === "创作者中心") {
                        setIsOpen(false);
                        setShow(true);
                      } else {
                        navigate(link);
                      }
                    }}
                  >
                    <p className="text-[14px] flex items-center gap-2">
                      {icon}
                      {title}
                    </p>
                  </div>
                  {index ===
                  (user?.token ? data?.length : data2?.length) - 1 ? (
                    <></>
                  ) : (
                    <Divider show={true} />
                  )}
                </>
              )
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingBtn;
