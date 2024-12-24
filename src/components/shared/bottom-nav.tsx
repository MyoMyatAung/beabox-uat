import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import HomeSVG from "@/assets/icons/Home.svg";
import Home1SVG from "@/assets/icons/Home1.svg";
import ExploreSVG from "@/assets/icons/Explore.svg";
import AppSVG from "@/assets/icons/App.svg";
import PlusSVG from "@/assets/icons/Plus.svg";
import ProfileSVG from "@/assets/icons/Profile.svg";
import Profile1SVG from "@/assets/icons/Profile1.svg";
import Explore1SVG from "@/assets/icons/Explore1.svg";
import App1SVG from "@/assets/icons/App1.svg";

const navItems = [
  { name: "Home", selectedIcon: Home1SVG, icon: HomeSVG, href: "/" },
  {
    name: "Explore",
    selectedIcon: Explore1SVG,
    icon: ExploreSVG,
    href: "/explore",
  },
  { name: "", selectedIcon: PlusSVG, icon: PlusSVG, href: "/profile" },
  {
    name: "Application",
    selectedIcon: App1SVG,
    icon: AppSVG,
    href: "/application",
  },
  {
    name: "Profile",
    selectedIcon: Profile1SVG,
    icon: ProfileSVG,
    href: "/profile",
  },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="h-[76px] flex items-center justify-around p-4 bg-[#191721] backdrop-blur-sm border-t border-white/10">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
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
        </Link>
      ))}
    </nav>
  );
}
