import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
const ShareRegion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="text-[14px]">Share Region</p>
          <p className="text-[12px] w-[320px] text-[#888]">
            The region information will not be displayed when this setting is
            turn off.
          </p>
        </div>
        <DrawerTrigger>
          <label className="switch">
            <input
              type="checkbox"
              disabled
              //   defaultChecked={private_profile == "on" ? true : false}
              // onChange={changePrivateProfileStatsHandler}
            />
            <span className="slider round"></span>
          </label>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <h1 className="text-[22px] text-center w-[190px] mx-auto text-white">
            Disable Share Region?
          </h1>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 px-3">
              <p className="text-[15px] text-[#bbb]">
                The region information will not be displayed. Instead it will
                display “Unknown” when this setting is turn off.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-[#F5F5F50A] hover:bg-[#F5F5F50A] w-full"
            >
              Cancel
            </Button>
            <Button className="bg-[#CD3EFF1F] text-[#CD3EFF] hover:bg-[#CD3EFF1F] w-full">
              Turn on
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareRegion;
