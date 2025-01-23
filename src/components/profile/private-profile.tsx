import withProfileData from "@/hocs/withProfileData";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MonitorPlay, UserX, UserX2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import {
  useChangePrivateProfileStatsMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import SmallLoader from "../shared/small-loader";

const PrivateProfile = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, refetch, isLoading } = useGetMyProfileQuery("");
  const [checked, setChecked] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [changePrivateProfileStats, { data: data1, isLoading: loading1 }] =
    useChangePrivateProfileStatsMutation();
  const handler = async () => {
    await changePrivateProfileStats({
      status: status === "off" ? "on" : "off",
    });
    await refetch();
    closeRef.current?.click();
  };

  useEffect(() => {
    setStatus(data?.data?.private_profile);
    data?.data?.private_profile == "on" ? setChecked(true) : setChecked(false);
  }, [data]);
  return (
    <Drawer>
      <div className="flex justify-between items-start">
        <div className="">
          <p className="text-[14px]">Private Profile</p>
          <p className="text-[12px] w-[320px] text-[#888] mt-1">
            Followers and following list will be invisible and your works will
            also be invisible to followers when this setting turn on.
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
            Switch to Private Account?
          </h1>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 px-3">
              <UserX2 size={18} />
              <p className="text-[15px] text-[#bbb]">
                Followers and following list will be hidden to all users.
              </p>
            </div>
            <div className="flex items-start gap-3 px-3">
              <MonitorPlay size={22} />
              <p className="text-[15px] text-[#bbb]">
                Your works will also be hidden to followers when this setting
                turn on.
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
              {loading1 ? <SmallLoader /> : "Switch"}
            </Button>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PrivateProfile;
