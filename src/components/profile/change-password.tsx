import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "@/store/api/profileApi";
import Loader from "../shared/loader";
import loader from "@/page/home/vod_loader.gif";
import SubmitButton from "../shared/submit-button";

const ChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [changePassword, { data, isLoading }] = useChangePasswordMutation();

  const changePassWordHandler = async (e: any) => {
    e.preventDefault();
    if (current_password?.length && new_password?.length) {
      await changePassword({ current_password, new_password });
    }
    setIsOpen(false);
  };
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
        {isLoading ? <Loader /> : <></>}
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={18} />
            </button>
            <p className="text-[16px]">Change Password</p>
            <div></div>
          </div>
          <form onSubmit={changePassWordHandler}>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="Enter your current password"
                onChange={(e: any) => setCurrentPassword(e.target.value)}
                value={current_password}
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
            <div className="relative mt-5">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="Enter your current password"
                onChange={(e: any) => setNewPassword(e.target.value)}
                value={new_password}
                type={show2 ? "text" : "password"}
              />
              <div className="absolute right-0 bottom-3">
                {show2 ? (
                  <Eye onClick={() => setShow2(false)} className="w-[18px]" />
                ) : (
                  <EyeOff onClick={() => setShow2(true)} className="w-[18px]" />
                )}
              </div>
            </div>
            {/* <Button
              type="submit"
              disabled={isLoading ? true : false}
              className={`w-full ${
                current_password.length > 1 && new_password?.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              }  bg-[#FFFFFF0A] mt-10 rounded-xl`}
            >
              Continue
            </Button> */}
            <SubmitButton
              isLoading={isLoading}
              condition={
                current_password.length > 1 && new_password?.length > 1
              }
              text="Continue"
            />
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangePassword;
