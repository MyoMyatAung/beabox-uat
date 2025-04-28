import { Menu, Wallet, Settings, QrCode, UserPen, UserCog } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Divider from "../shared/divider";
import UserStar from "@/assets/user-star.png";
import {
  setAlertText,
  setIsDrawerOpen,
  setShowAlert,
} from "@/store/slices/profileSlice";
import { TbBrandTelegram } from "react-icons/tb";
import { useGetInviteQuery } from "@/store/api/wallet/walletApi";

const SettingBtn = ({ setShow }: any) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.persist?.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { data: config } = useGetInviteQuery("");
  const tgLink = config?.data.support_telegram_link;
  console.log(tgLink);

  const data = [
    {
      title: "我的钱包",
      icon: <Wallet size={24} />,
      link: paths.wallet,
    },
    {
      title: "创作者中心",
      icon: <img src={UserStar} className="w-6" />,
      link: paths.create_center,
    },
    {
      title: "编辑资料",
      icon: <UserPen size={24} />,
      link: paths.profileDetail,
    },
    {
      title: "联系客服",
      icon: <TbBrandTelegram size={24} />,
      link: tgLink,
    },

    {
      title: "邀请码",
      icon: <QrCode size={24} />,
      link: paths.wallet_invite,
    },
    {
      title: "设置和隐私",
      icon: <Settings size={24} />,
      link: paths.settings,
    },
  ];
  const data2 = [
    {
      title: "创作者中心",
      icon: <img src={UserStar} className="w-6" />,
      // link: paths.settings,
    },
    {
      title: "联系客服",
      icon: <TbBrandTelegram size={24} />,
      link: tgLink,
    },
    // {
    //   title: "创作者中心",
    //   icon: <UserPen size={24} />,
    //   link: paths.settings,
    // },
    {
      title: "设置和隐私",
      icon: <Settings size={24} />,
      link: paths.settings,
    },
  ];
  // dispatch(setIsDrawerOpen(true))
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center">
          <Menu />
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[3600]">
        <div className="w-full px-5 py-7">
          <div className="space-y-3">
            {(user?.token ? data : data2)?.map(
              ({ title, icon, link }, index: any) => (
                <>
                  <div
                    key={title}
                    onClick={() => {
                      if (title === "创作者中心") {
                        if (!user?.token) {
                          console.log("this is mf");
                          setIsOpen(false);
                          dispatch(setIsDrawerOpen(true));
                        } else {
                          navigate(link);
                          // dispatch(setShowAlert(true));
                          // dispatch(setAlertText("功能正在开发中"));
                        }
                      } else if (title === "联系客服") {
                        if (tgLink) {
                          const a = document.createElement('a');
                          a.href = tgLink;
                          a.target = '_blank';
                          a.rel = 'noopener noreferrer';
                          a.click();
                        } else {
                          console.warn("Telegram link not available");
                        }
                      } else {
                        navigate(link);
                      }
                    }}
                    className="pt-4"
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
