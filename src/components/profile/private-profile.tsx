import withProfileData from "@/hocs/withProfileData";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MonitorPlay, UserX, UserX2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const PrivateProfile = ({
  private_profile,
  changePrivateProfileStatsHandler,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(private_profile);

  const handler = async () => {
    await changePrivateProfileStatsHandler(value === "on" ? "off" : "on");
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
            <input
              disabled
              type="checkbox"
              defaultChecked={value == "on" ? true : false}
              // onChange={changePrivateProfileStatsHandler}
            />
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
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-[#F5F5F50A] hover:bg-[#F5F5F50A] w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handler}
              className="bg-[#CD3EFF1F] text-[#CD3EFF] hover:bg-[#CD3EFF1F] w-full"
            >
              Switch
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default withProfileData(PrivateProfile);
