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
  const { show } = useSelector((state: any) => state.showSlice);
  const { pathname } = useLocation();
  const { bottomLoader } = useSelector((state: any) => state.loaderSlice);
  const [needsBottomPadding, setNeedsBottomPadding] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.persist.user);
  const dispatch = useDispatch();
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 500) {
        setShowHeader(true);
      } else {
        if (currentY > lastScrollY) {
          // scrolling down
          setShowHeader(false);
        } else if (currentY < lastScrollY) {
          // scrolling up
          setShowHeader(true);
        }
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      style={{
        display:
          location.pathname === "/lucky" || (show && location.pathname === "/")
            ? "none"
            : "flex",
      }}
      className={`flex items-center justify-around p-4 bg-[#191721] backdrop-blur-sm border-t border-white/10  transition-transform duration-300 ease-in-out will-change-transform
 ${bottomLoader && "loading-border"} ${
        needsBottomPadding ? "h-[80px] pb-10" : "h-[76px]"
      }
      
         ${
           location.pathname === "/"
             ? showHeader
               ? "-translate-y-0 opacity-100"
               : "translate-y-full opacity-0"
             : ""
         }
      `}
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
