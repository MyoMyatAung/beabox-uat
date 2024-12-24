import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronRight, Globe } from "lucide-react";
import { useState } from "react";

const EditLanguage = () => {
  const [lang, setLang] = useState("English");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer>
      <div className="flex justify-between items-center">
        <p className="flex items-center gap-1 text-[14px]">
          <Globe size={20} /> Language
        </p>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[14px] text-[#777777]">
            {lang} <ChevronRight size={15} />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        <div className="w-full px-5 py-7 space-y-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1
                onClick={() => setLang("English")}
                className={`${
                  lang == "English" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                English
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  lang == "English" ? "block" : "hidden"
                }`}
              ></span>
            </div>
          </div>
          <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1
                onClick={() => setLang("Chinese")}
                className={`${
                  lang == "Chinese" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Chinese
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  lang == "Chinese" ? "block" : "hidden"
                }`}
              ></span>
            </div>
          </div>
          <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <DrawerClose asChild>
                <button className={` text-[#999] text-[16px]`}>Cancel</button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditLanguage;
