import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import { useState } from "react";
  import { FaCaretDown } from "react-icons/fa";
  
  interface TypePickProps {}
  
  const TypePick: React.FC<TypePickProps> = ({}) => {
    const types = [
      "Transition type01",
      "Transition type02",
      "Transition type03",
    ];
  
    // Set the initial selected type index to 0 (e.g., "Transition type01")
    const [selectedType, setSelectedType] = useState<number>(0);
  
    return (
      <Drawer>
        <div className="flex justify-between items-center">
          <DrawerTrigger asChild>
            <div className="types_all px-[16px] my-[10px] py-[8px] flex justify-center items-center gap-[4px]">
              <h1 className="text-white text-[14px] font-[500] leading-[20px]">
                {types[selectedType]} {/* Show the currently selected type */}
              </h1>
              <FaCaretDown />
            </div>
          </DrawerTrigger>
        </div>
        <DrawerContent className="border-0 bg-[#121012]">
          <div className="w-full flex flex-col justify-between px-5 py-7 h-[320px] overflow-hidden">
            <div className="flex flex-col items-center">
              {types.map((type, index) => (
                <div
                  key={index}
                  className="flex flex-col py-[16px]"
                  onClick={() => setSelectedType(index)}
                >
                  <div className="flex justify-center items-center gap-[10px] cursor-pointer">
                    <h1 className={`${selectedType === index ? " text-white" : "text-[#888]"} text-[16px] font-[500] leading-[20px]`}>
                      {type}
                    </h1>
                    {selectedType === index && (
                      <p className="w-[6px] h-[6px] rounded-full bg-gradient-to-tl from-[#CD3EFF] to-[#FFB2E0]"></p>
                    )}
                  </div>
                </div>
              ))}
  
              <div className="flex w-full pt-[16px] items-center gap-[20px]">
                <DrawerClose asChild>
                  <button
                    className="w-full text-[#888] text-[16px] draw_canccel_btn p-[16px]"
                  >
                    Cancel
                  </button>
                </DrawerClose>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default TypePick;
  