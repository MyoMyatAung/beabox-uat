import { FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGender } from "@/store/slices/persistSlice";
import { useChangeGenderMutation } from "@/store/api/profileApi";
import Loader from "../shared/loader";

const EditGender = ({ gender }: any) => {
  // const gender = useSelector((state: any) => state.persist.gender);

  const dispatch = useDispatch();
  const [cgender, setcGender] = useState(gender);
  const [isOpen, setIsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [changeGender, { data, isLoading }] = useChangeGenderMutation();

  // console.log(gender);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="text-[14px] flex items-center justify-between">
          <h1>性别</h1>
          <p className="flex items-center gap-1 text-[#888]">
            {(cgender === "Other" && "不方便透露") ||
              (cgender == "Male" && "男性") ||
              (cgender == "Female" && "女性")}
            <FaAngleRight />
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012]">
        {/* {isLoading ? <Loader /> : <></>} */}
        <div className="w-full px-5 py-7">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  setcGender("Other");
                  dispatch(setGender("Other"));
                  closeRef.current?.click();
                  await changeGender({ gender: "Other" });
                }}
                className={`${
                  cgender == "Other" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                不方便透露
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  cgender == "Other" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  setcGender("Male");
                  dispatch(setGender("Male"));
                  closeRef.current?.click();
                  await changeGender({ gender: "Male" });
                }}
                className={`${
                  cgender == "Male" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                男性
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  cgender == "Male" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  setcGender("Female");
                  dispatch(setGender("Female"));
                  closeRef.current?.click();
                  await changeGender({ gender: "Female" });
                }}
                className={`${
                  cgender == "Female" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                女性
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  cgender == "Female" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <DrawerClose asChild>
              <Button className="w-full rounded-lg bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]">
                取消
              </Button>
            </DrawerClose>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditGender;
