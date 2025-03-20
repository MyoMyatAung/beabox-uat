import { SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/create-center/drawer";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import { useState } from "react";

const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const FilterNav = ({
  config,
  setIsActive,
  isActive,
  setPage,
  setPosts,
  setHasMore,
  refetch,
}: any) => {
  const [selectedTitle, setSelectedTitle] = useState("所有帖子");
  const [isOpen, setIsOpen] = useState(false);
  const selectedColor = config?.find(
    (item: any) => item?.title == selectedTitle && item?.text_color_code
  );
  console.log(selectedColor, "sc");
  const selectedHandler = (title: any) => {
    setIsActive(title);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    refetch();
    setIsOpen(false);
  };

  const xHandler = () => {
    if (config) {
      setIsActive(config[0]?.keyword);
      setSelectedTitle(config[0]?.title);
      setPage(1);
      setPosts([]);
      setHasMore(true);
      refetch();
      setIsOpen(false);
    }
  };

  return (
    <div className="flex justify-between items-center px-5">
      <p
        className={`text-[16px] flex items-center gap-2 text-[${selectedColor?.text_color_code}]`}
      >
        {selectedTitle}
        {isActive === config[0]?.keyword ? (
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
              {config?.map((item: any, index: any) => (
                <div key={item?.title} className="">
                  <div
                    onClick={() => {
                      setSelectedTitle(item?.title);
                      selectedHandler(item?.keyword);
                    }}
                    className="flex justify-between items-center "
                  >
                    <p className={`text-[16px]`}>{item?.title}</p>
                    {isActive == item?.keyword ? <Selected /> : <Unselected />}
                  </div>
                  {index == config?.length - 1 ? (
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
