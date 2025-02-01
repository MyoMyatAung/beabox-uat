import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "../ui/button";
import SmallLoader from "../shared/small-loader";
import { useSelector } from "react-redux";

const ContentVisibility = ({
  changeVisibilityHandler,
  liked_video_visibility,
  visibilityLoading,
  content_visibility,
}: any) => {
  const test = useSelector((state: any) => state.persist.content_visibility);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(test);

  const handler = async (sdata: any) => {
    await changeVisibilityHandler(sdata);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="flex justify-between items-start w-full">
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">
              {/* Content Visibility */}
              内容可见
            </p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              {/* Control who can view your content. Choose between Public, Private or
            Follower */}
              设置谁可以查看您的内容，公开/私密/仅粉丝可见
            </p>
          </div>
          <div className=" flex-1">
            <p className="flex items-center justify-end gap-1 text-[14px] capitalize">
              {status == "public" ? "公开" : "私密"}
              <ChevronRight size={15} className="text-[#777777]" />
            </p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <div className="space-y-6">
            <h1 className="text-[18px]">
              {/* Who can see your Works? */}
              谁可以看到您的作品
            </h1>
            <div className="space-y-2">
              {/* public  */}
              <div
                onClick={() => setStatus("public")}
                className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      status == "public" ? "text-white" : "text-[#888]"
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
                    status == "public" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
              {/* private  */}
              <div
                onClick={() => setStatus("private")}
                className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      status == "private" ? "text-white" : "text-[#888]"
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
                    status == "private" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div>
              {/* follower  */}
              {/* <div
                onClick={() => setStatus("follower")}
                className="flex items-start justify-between bg-[#FFFFFF0A] p-3 rounded-xl"
              >
                <div className="">
                  <p
                    className={`text-[14px] ${
                      status == "follower" ? "text-white" : "text-[#888]"
                    }`}
                  >
                    Follower
                  </p>
                  <p className="text-[10px] text-[#888]">
                    Only people followed you on the platform can see your work.
                  </p>
                </div>
                <div
                  className={`w-3 h-3 ${
                    status == "follower" ? "bg-[#CD3EFF]" : "bg-[#FFFFFF52]"
                  } rounded-full`}
                ></div>
              </div> */}
            </div>

            <Button
              onClick={() => handler(status)}
              className="bg-[#CD3EFF1F] hover:bg-[#CD3EFF1F] text-[#CD3EFF] w-full"
            >
              {visibilityLoading ? <SmallLoader /> : "保存"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ContentVisibility;
