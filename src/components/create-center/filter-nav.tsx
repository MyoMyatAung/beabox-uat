import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/create-center/drawer";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import { useState } from "react";

const filtertitles = [
  "All Videos",
  "Pending",
  "Publishing",
  "Published",
  "Rejected",
];

const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const FilterNav = () => {
  const [selectedTitle, setSelectedTitle] = useState("All Videos");
  const [isOpen, setIsOpen] = useState(false);

  const selectedHandler = (title: any) => {
    setSelectedTitle(title);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-5">
      <p className="text-[16px]">{selectedTitle}</p>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <SlidersHorizontal size={18} />
        </DrawerTrigger>
        <DrawerContent className="border-0">
          <div className="p-5">
            <div className="flex flex-col">
              {filtertitles?.map((title, index) => (
                <div className="">
                  <div
                    onClick={() => selectedHandler(title)}
                    className="flex justify-between items-center "
                  >
                    <p className="text-[16px]">{title}</p>
                    <Selected />
                  </div>
                  {index == 4 ? (
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
