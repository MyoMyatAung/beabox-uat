import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
const ChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>Change Password</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0">
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={18} />
            </button>
            <p className="text-[16px]">Change Password</p>
            <div></div>
          </div>
          <form>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="Enter your current password"
                onChange={(e: any) => setValue(e.target.value)}
                value={value}
                type={show ? "text" : "password"}
              />
              <div className="absolute right-0 bottom-3">
                {show ? (
                  <Eye onClick={() => setShow(false)} className="w-[18px]" />
                ) : (
                  <EyeOff onClick={() => setShow(true)} className="w-[18px]" />
                )}
              </div>
            </div>
            <Button
              className={`w-full ${
                value.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              }  bg-[#FFFFFF0A] mt-10 rounded-xl`}
            >
              Continue
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangePassword;
