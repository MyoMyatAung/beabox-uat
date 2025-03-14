import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import {
  useChangeHideBioMutation,
  useChangePrivateProfileStatsMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import SmallLoader from "../shared/small-loader";
const HideMe = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [hideMe, sethideMe] = useState("");
  const { data, refetch, isLoading } = useGetMyProfileQuery("");
  console.log(data?.data?.private, "test");
  const [checked, setChecked] = useState<any>(null);
  const [changePrivateProfileStats, { data: data1, isLoading: loading1 }] =
    useChangePrivateProfileStatsMutation();
  const handler = async () => {
    await changePrivateProfileStats(hideMe === "off" ? "on" : "off");
    await refetch();
    closeRef.current?.click();
  };

  useEffect(() => {
    sethideMe(data?.data?.private);
    data?.data?.private == "on" ? setChecked(true) : setChecked(false);
  }, [data]);

  return (
    <Drawer>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="text-[14px]">隐藏生物</p>
          <p className="text-[12px] w-[320px] text-[#888]">
            启用此设置后，您的个人简介将对所有用户隐藏。
          </p>
        </div>
        <DrawerTrigger asChild>
          <label className="switch">
            <input type="checkbox" disabled defaultChecked={checked} />
            <span className="slider round"></span>
          </label>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <h1 className="text-[22px] text-center w-[190px] mx-auto text-white">
            隐藏你的个人简介
          </h1>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 px-3">
              <p className="text-[15px] text-[#bbb]">
                开启此设置后，平台上的所有用户都看不到您的个人简介
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button className="bg-[#F5F5F50A] hover:bg-[#F5F5F50A] w-full">
                我再想想
              </Button>
            </DrawerClose>
            <Button
              onClick={handler}
              className="bg-[#CD3EFF1F] text-[#CD3EFF] hover:bg-[#CD3EFF1F] w-full"
            >
              {loading1 ? <SmallLoader /> : "确认"}
            </Button>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HideMe;
