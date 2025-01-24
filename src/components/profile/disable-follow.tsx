import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import withProfileData from "@/hocs/withProfileData";
import {
  useChangeFollowReqMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import SmallLoader from "../shared/small-loader";

const DisableFollow = () => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { data, refetch, isLoading } = useGetMyProfileQuery("");
  console.log(data, "dafads");
  const [followReq, setFollowReq] = useState("");
  const [checked, setChecked] = useState<any>(null);
  const [changeFollowReq, { data: data1, isLoading: loading1 }] =
    useChangeFollowReqMutation();

  const handler = async () => {
    await changeFollowReq(followReq === "off" ? "on" : "off");
    await refetch();
    closeRef.current?.click();
  };

  useEffect(() => {
    setFollowReq(data?.data?.disallow_follow_request);
    data?.data?.disallow_follow_request == "on"
      ? setChecked(true)
      : setChecked(false);
  }, [data]);
  // useEffect(() => {
  //   setFollowReq(data?.data?.disallow_follow_request);
  // }, [data]);

  // useEffect(() => {
  // }, [followReq]);

  return (
    <Drawer>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="text-[14px]">禁用关注</p>
          <p className="text-[12px] w-[320px] text-[#888]">
            开启后普通用户无法关注你{" "}
          </p>
        </div>
        <DrawerTrigger asChild>
          <label className="switch">
            {/* {followReq == "on" ? (
              <input type="checkbox" disabled defaultChecked={checked} />
            ) : (
              <input type="checkbox" disabled defaultChecked={checked} />
            )} */}
            <input type="checkbox" disabled defaultChecked={checked} />
            <span className="slider round"></span>
          </label>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012] z-[1000]">
        <div className="w-full px-5 py-7">
          <h1 className="text-[22px] text-center w-[190px] mx-auto text-white">
            禁用关注
          </h1>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 px-3">
              <p className="text-[15px] text-[#bbb]">
                普通用户点击关注你的账号时，会提示“无法关注私密账号”
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

export default withProfileData(DisableFollow);
