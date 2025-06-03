import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeSVG from "@/assets/icons/Home.svg";
import Home1SVG from "@/assets/icons/Home1.svg";
import ExploreSVG from "@/assets/icons/Explore.svg";
import AppSVG from "@/assets/icons/App.svg";
import PlusSVG from "@/assets/icons/Plus.svg";
import ProfileSVG from "@/assets/icons/Profile.svg";
import Profile1SVG from "@/assets/icons/Profile1.svg";
import addImg from "@/assets/icons/add.svg";
import App1SVG from "@/assets/icons/App1.svg";
import ranksvg from "@/assets/icons/rank.svg";
import selectedrank from "@/assets/icons/selecteRank.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

const navItems = [
  { name: "首页", selectedIcon: Home1SVG, icon: HomeSVG, href: "/" },
  {
    name: "应用推荐",
    selectedIcon: App1SVG,
    icon: AppSVG,
    href: "/application",
  },
  {
    name: "创作",
    selectedIcon: addImg,
    icon: addImg,
    href: "/creator/upload/video",
  },
  {
    name: "名人堂",
    selectedIcon: selectedrank,
    icon: ranksvg,
    href: "/ranking",
  },
  {
    name: "个人中心",
    selectedIcon: Profile1SVG,
    icon: ProfileSVG,
    href: "/profile",
  },
];

// Helper function to detect iOS WebView/WebClip
const isIOSWebViewOrWebClip = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isStandalone = window.navigator.standalone === true;
  // const isWebView = ua.includes('wkwebview') || ua.includes('safari') === false;

  return isIOS && isStandalone;
};

export function BottomNav() {
  const { pathname } = useLocation();
  const { bottomLoader } = useSelector((state: any) => state.loaderSlice);
  const [needsBottomPadding, setNeedsBottomPadding] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.persist.user);
  const dispatch = useDispatch();
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);

  useEffect(() => {
    setNeedsBottomPadding(isIOSWebViewOrWebClip());
  }, []);

  const handleRoute = (route: string) => {
    if (route === "/creator/upload/video" && !user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }
    navigate(route);
  };

  return (
    <nav
      style={{ display: hideBar ? "none" : "flex" }}
      className={`flex items-center justify-around p-4 bg-[#191721] backdrop-blur-sm border-t border-white/10 ${
        bottomLoader && "loading-border"
      } ${needsBottomPadding ? "h-[80px] pb-10" : "h-[76px]"}`}
    >
      {" "}
      {navItems.map((item) => (
        <div
          key={item.name}
          onClick={() => handleRoute(item.href)}
          // to={item.href}
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === item.href ? "text-white" : "text-white/60"
          )}
        >
          <img
            src={pathname === item.href ? item?.selectedIcon : item?.icon}
            alt=""
          />
          <span className="text-[10px]">{item.name}</span>
        </div>
      ))}
    </nav>
  );
}
