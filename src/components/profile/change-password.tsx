import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
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
  const [error, setError] = useState(false);
  const [changePassword, { data, isLoading }] = useChangePasswordMutation();
  const closeRef = useRef<HTMLButtonElement>(null);

  // const profileErr = localStorage.getItem("profile-error") || "当前密码错误";

  const changePassWordHandler = async (e: any) => {
    e.preventDefault();
    if (current_password?.length && new_password?.length) {
      const { data } = await changePassword({ current_password, new_password });
      if (data?.status) {
        setIsOpen(false);
        setError(false);
        closeRef.current?.click();
      } else {
        setError(true);
      }
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="text-[14px] flex items-center justify-between">
          <h1>更改密码</h1>
          <p className="flex items-center gap-1 text-[#888]">
            <FaAngleRight />
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0">
        {isLoading ? <Loader /> : <></>}
        <div className="w-full c-height px-5 bg-[#16131C]">
          <div className="flex justify-between items-center py-5">
            <DrawerClose className="z-[1200]">
              <button onClick={() => setIsOpen(false)}>
                <FaAngleLeft size={22} />
              </button>
            </DrawerClose>
            <p className="text-[16px]">更改密码</p>
            <div></div>
          </div>
          <form onSubmit={changePassWordHandler}>
            <label htmlFor="" className="text-[14px] text-[#888] pt-10">
              当前密码
            </label>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                placeholder="输入您当前的密码"
                onChange={(e: any) => setCurrentPassword(e.target.value)}
                value={current_password}
                type={show ? "text" : "password"}
                minLength={6}
                maxLength={25}
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
              <label htmlFor="" className="text-[14px] text-[#888] pt-10">
                新密码
              </label>
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                placeholder="输入您的新密码"
                onChange={(e: any) => setNewPassword(e.target.value)}
                value={new_password}
                type={show2 ? "text" : "password"}
                minLength={6}
                maxLength={25}
              />
              <div className="absolute right-0 bottom-3">
                {show2 ? (
                  <Eye onClick={() => setShow2(false)} className="w-[18px]" />
                ) : (
                  <EyeOff onClick={() => setShow2(true)} className="w-[18px]" />
                )}
              </div>
            </div>
            <h1 className="mt-5 text-red-500 text-sm">
              {error ? "当前密码错误" : ""}
            </h1>
            <SubmitButton
              isLoading={isLoading}
              condition={
                current_password.length >= 6 &&
                new_password?.length >= 6 &&
                current_password?.length === new_password?.length
              }
              text="设置新密码"
            />
          </form>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangePassword;
