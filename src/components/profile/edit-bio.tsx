import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { useChangeBioMutation } from "@/store/api/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { setBio } from "@/store/slices/persistSlice";
import SubmitButton from "../shared/submit-button";
import Loader from "../shared/loader";

const EditBio = ({ bio, refetchHandler }: any) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  // const [text, setText] = useState("");
  const maxLength = 100;
  const [changeBio, { data, isLoading }] = useChangeBioMutation();
  const dispatch = useDispatch();
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    dispatch(setBio(value));
    await changeBio({ bio: value });
    await refetchHandler();
    setIsOpen(false);
    closeRef.current?.click();
  };
  return (
    <Drawer>
      <div className="text-[14px] flex items-center justify-between">
        <h1>个性签名</h1>
        <DrawerTrigger asChild>
          <p className="flex items-start gap-1 text-[#888]">
            <span className="max-w-[200px] ml-auto">{bio ? bio : ""}</span>
            <FaAngleRight className="mt-1" />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0">
        {isLoading ? <Loader /> : <></>}
        <div className="w-full h-screen px-5 bg-[#16131C]">
          <div className="flex justify-between items-center py-5">
            <DrawerClose asChild>
              <button>
                <FaAngleLeft size={18} />
              </button>
            </DrawerClose>
            <p className="text-[16px]">个性签名</p>
            <div></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="" className="text-[14px] text-[#888] pt-10">
              个人简介
            </label>
            <div className="relative">
              <div className="relative">
                <textarea
                  value={value}
                  onChange={(e: any) => setValue(e.target.value)}
                  placeholder="请输入您的个性签名"
                  className="min-h-[100px] w-full resize-none  bg-transparent p-3 text-white placeholder:text-gray-400  border-b border-[#888] focus:outline-none focus:ring-0 focus:border-[#888]"
                />
                <span className="absolute bottom-2 right-2 text-sm text-gray-400">
                  {value.length}/{maxLength}
                </span>
              </div>
              {/* <textarea
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                className={`
                w-full px-0 py-2 bg-transparent
                border-b border-[#888]
                focus:outline-none focus:ring-0 focus:border-[#888]
                resize-none
                `}
                placeholder="Enter your profile bio"
              /> */}
            </div>
            <SubmitButton
              isLoading={isLoading}
              condition={value.length > 1}
              text="保存"
            />
            {/* <Button
              type="submit"
              className={`w-full ${
                value.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              } bg-[#FFFFFF0A]  mt-10 rounded-xl`}
            >
              {isLoading ? "loading..." : "Save"}
            </Button> */}
          </form>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditBio;
