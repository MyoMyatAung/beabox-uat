import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { paths } from "@/routes/paths";
import upload from "@/assets/createcenter/upload.svg";

interface Tab {
  id: string;
  label: string;
}

interface GossipTopNavbarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const GossipTopNavbar = ({
  tabs,
  activeTab,
  onTabClick,
}: GossipTopNavbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);

  return (
    <AnimatePresence>
      {!hideBar && !hideNew && (
        <motion.div
          className="px-5 pt-5 z-[9999] max-w-[480px] mx-auto"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          <div className="flex gap-2 items-center justify-center text-white mx-auto min-h-14">
            {tabs.map((tab) => (
              <div
                onClick={() => onTabClick(tab.id)}
                key={tab.id}
                className="flex flex-col items-center cursor-pointer min-w-24"
              >
                <div className="w-[24px] h-[3px] bg-transparent rounded-full transition-all duration-300"></div>
                <p
                  className={`transition-all duration-300 ease-in-out ${
                    activeTab === tab.id
                      ? "text-2xl opacity-100 font-semibold home-normal-text-shadow"
                      : "home-normal-text"
                  }`}
                >
                  {tab.label}
                </p>
                {activeTab === tab.id ? (
                  <div className="w-[24px] h-[3px] bg-white rounded-full"></div>
                ) : (
                  <div className="w-[24px] h-[3px] bg-transparent rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GossipTopNavbar;
