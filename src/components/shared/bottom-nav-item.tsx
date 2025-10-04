import { cn } from "@/lib/utils";

type Props = {
  item: {
    name: string;
    selectedIcon: string;
    icon: string;
    href: string;
  };
  handleRoute: (route: string) => void;
  pathname: string;
  isShowRedDot?: boolean;
};

const BottomNavItem = ({
  item,
  handleRoute,
  pathname,
  isShowRedDot = true,
}: Props) => {
  return (
    <div
      key={item.name}
      onClick={() => handleRoute(item.href)}
      // to={item.href}
      className={cn(
        "flex flex-col items-center gap-1 relative",
        pathname === item.href ? "text-white" : "text-white/60"
      )}
    >
      <img
        src={pathname === item.href ? item?.selectedIcon : item?.icon}
        alt=""
      />
      {/* {item.href === "/profile" && (
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF0004]"></div>
            )} */}
      <span className="text-[10px]">{item.name}</span>
      {item.href === "/profile" && isShowRedDot && (
        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#FF0004]"></div>
      )}
    </div>
  );
};

export default BottomNavItem;
