import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import {
  useChangeShareRegionMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import SmallLoader from "../shared/small-loader";
const ShareRegion = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, refetch, isLoading } = useGetMyProfileQuery("");
  const [checked, setChecked] = useState<any>(null);
  const [shareRegion, setShareRegion] = useState("");
  const [changeShareRegion, { data: data1, isLoading: loading1 }] =
    useChangeShareRegionMutation();
  const handler = async () => {
    await changeShareRegion(shareRegion === "off" ? "on" : "off");
    await refetch();
    closeRef.current?.click();
  };

  useEffect(() => {
    setShareRegion(data?.data?.share_region);
    data?.data?.share_region == "on" ? setChecked(true) : setChecked(false);
  }, [data]);
  return (
    <Drawer>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="text-[14px]">Share Region</p>
          <p className="text-[12px] w-[320px] text-[#888]">
            The region information will not be displayed when this setting is
            turn off.
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
            <DrawerClose asChild>
              <Button className="bg-[#F5F5F50A] hover:bg-[#F5F5F50A] w-full">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              onClick={handler}
              className="bg-[#CD3EFF1F] text-[#CD3EFF] hover:bg-[#CD3EFF1F] w-full"
            >
              {loading1 ? <SmallLoader /> : "Turn on"}
            </Button>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareRegion;
