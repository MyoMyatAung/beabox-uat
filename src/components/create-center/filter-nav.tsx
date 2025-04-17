import { SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/create-center/drawer";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import { useEffect, useState } from "react";

const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  // Add other post properties as needed
}

interface FilterNavProps {
  config: Array<{
    title: string;
    keyword: string;
    text_color_code?: string;
  }>;
  setIsActive: (value: string) => void;
  isActive: string;
  setPage: (value: number) => void;
  setPosts: (value: Post[] | ((prev: Post[]) => Post[])) => void;
  setHasMore: (value: boolean) => void;
  refetch: () => Promise<unknown>;
}

const FilterNav = ({
  config,
  setIsActive,
  isActive,
  setPage,
  setPosts,
  setHasMore,
  refetch,
}: FilterNavProps) => {
  const [selectedTitle, setSelectedTitle] = useState("所有帖子");
  const [isOpen, setIsOpen] = useState(false);
  
  // Update selectedTitle when config or isActive changes
  useEffect(() => {
    if (config && isActive) {
      const currentFilter = config.find(item => item.keyword === isActive);
      if (currentFilter) {
        setSelectedTitle(currentFilter.title);
      }
    }
  }, [config, isActive]);
  
  const selectedColor = config?.find(
    (item) => item?.title === selectedTitle && item?.text_color_code
  );
  
  const selectedHandler = (title: string) => {
    setIsActive(title);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    refetch();
    setIsOpen(false);
  };

  const xHandler = () => {
    // Reset to "all" filter
    setIsActive("all");
    setPage(1);
    setPosts([]);
    setHasMore(true);
    refetch();
    setIsOpen(false);
  };

  if (!config || config.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-5">
      <p
        className={`text-[16px] flex items-center gap-2 text-[${selectedColor?.text_color_code}]`}
      >
        {selectedTitle}
        {isActive === "all" ? (
          <></>
        ) : (
          <button
            onClick={xHandler}
            className="w-[18px] h-[18px] bg-[#505050] rounded-full text-white flex justify-center items-center"
          >
            <X size={14} />
          </button>
        )}
      </p>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <SlidersHorizontal size={18} />
        </DrawerTrigger>
        <DrawerContent className="border-0">
          <div className="p-5">
            <div className="flex flex-col">
              {config?.map((item, index) => (
                <div key={item?.title} className="">
                  <div
                    onClick={() => {
                      selectedHandler(item?.keyword);
                    }}
                    className="flex justify-between items-center "
                  >
                    <p className={`text-[16px]`}>{item?.title}</p>
                    {isActive === item?.keyword ? <Selected /> : <Unselected />}
                  </div>
                  {index === config?.length - 1 ? (
                    <></>
                  ) : (
                    <div className="bg-[#222222] h-[0.3px] my-5"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FilterNav;
