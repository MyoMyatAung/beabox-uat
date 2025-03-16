import { ChevronRight, EarthLock, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/create-center/drawer";
import { useState } from "react";
import { Button } from "../ui/button";

const Privacy = ({ privacy, setPrivacy }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="bg-[#FFFFFF0A] flex justify-between items-center p-3 rounded-[16px] mx-5">
          <div className="flex items-center gap-2">
            <EarthLock size={18} />
            <p className="text-[14px]">谁可以看到你的帖子</p>
          </div>
          <div className="flex items-center gap-1 text-[#777]">
            <p className="text-[14px] ">
              {privacy == "public" ? "公开" : "私密"}
            </p>
            <ChevronRight size={14} />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5">
          <div onClick={() => setIsOpen(false)} className="">
            <X className="ml-auto" size={18} />
          </div>
          <div className="space-y-6 pb-7">
            <h1 className="text-[18px] pt-5 text-center">
              {/* Who can see your Works? */}
              谁可以看到您的作品
            </h1>
            <div className="space-y-2">
              {/* public  */}
              <div
                onClick={() => setPrivacy("public")}
                className="flex items-center justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      privacy == "public" ? "text-white" : "text-[#888]"
                    }`}
                  >
                    {/* Public */}
                    公开
                  </p>
                  <p className="text-[10px] text-[#888]">
                    {/* Your work is visible to everyone on the platform. */}
                    您的作品可以被所有用户观看
                  </p>
                </div>
                <div
                  className={`w-3 h-3 ${
                    privacy == "public" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
              {/* private  */}
              <div
                onClick={() => setPrivacy("onlyme")}
                className="flex items-center justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      privacy == "onlyme" ? "text-white" : "text-[#888]"
                    }`}
                  >
                    {/* Private */}
                    私密
                  </p>
                  <p className="text-[10px] text-[#888]">
                    {/* Only you can see your work. */}
                    除了您，没人可以看到您的作品
                  </p>
                </div>
                <div
                  className={`w-3 h-3 ${
                    privacy == "onlyme" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="bg-[#CD3EFF1F] hover:bg-[#CD3EFF1F] text-[#CD3EFF] w-full"
            >
              保存
              {/* {visibilityLoading ? <SmallLoader /> : "保存"} */}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Privacy;
