import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "../ui/button";

const ContentVisibility = ({
  changeVisibilityHandler,
  liked_video_visibility,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(liked_video_visibility);

  const handler = async (sdata: any) => {
    await changeVisibilityHandler(sdata);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="flex items-center gap-1 text-[14px]">
            Content Visibility
          </p>
          <p className="text-[14px] text-[#888888] w-[300px] mt-1">
            Control who can view your content. Choose between Public, Private or
            Follower
          </p>
        </div>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[14px]">
            {status == "on" ? "Public" : "Private"}{" "}
            <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <div className="space-y-6">
            <h1 className="text-[18px]">Who can see your Works?</h1>
            <div className="space-y-2">
              {/* public  */}
              <div
                onClick={() => setStatus("on")}
                className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      status == "on" ? "text-white" : "text-[#888]"
                    }`}
                  >
                    Public
                  </p>
                  <p className="text-[10px] text-[#888]">
                    Your work is visible to everyone on the platform.
                  </p>
                </div>
                <div
                  className={`w-3 h-3 ${
                    status == "on" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
              {/* private  */}
              <div
                onClick={() => setStatus("off")}
                className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      status == "off" ? "text-white" : "text-[#888]"
                    }`}
                  >
                    Private
                  </p>
                  <p className="text-[10px] text-[#888]">
                    Only you can see your work.
                  </p>
                </div>
                <div
                  className={`w-3 h-3 ${
                    status == "off" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
              {/* follower  */}
              <div className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl">
                <div className="">
                  <p className="text-[14px] text-[#888]">Follower</p>
                  <p className="text-[10px] text-[#888]">
                    Only people followed you on the platform can see your work.
                  </p>
                </div>
                <div className="w-3 h-3 bg-[#FFFFFF52] rounded-full"></div>
              </div>
            </div>

            <Button
              onClick={() => handler(status)}
              className="bg-[#CD3EFF1F] hover:bg-[#CD3EFF1F] text-[#CD3EFF] w-full"
            >
              Save
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ContentVisibility;
