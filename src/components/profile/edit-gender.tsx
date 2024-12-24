import { FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGender } from "@/store/slices/persistSlice";
import { useChangeGenderMutation } from "@/store/api/profileApi";

const EditGender = () => {
  const gender = useSelector((state: any) => state.persist.gender);
  console.log(gender);
  const dispatch = useDispatch();
  // const [gender, setGender] = useState("Other");
  const [isOpen, setIsOpen] = useState(false);
  const [changeGender, { data }] = useChangeGenderMutation();
  console.log(data);

  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>Gender</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            {gender} <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        <div className="w-full px-5 py-7">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Other"));
                  setIsOpen(false);
                  await changeGender({ gender: "Other" });
                }}
                className={`${
                  gender == "Other" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Other
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Other" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Male"));
                  setIsOpen(false);
                  await changeGender({ gender: "Male" });
                }}
                className={`${
                  gender == "Male" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Male
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Male" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <div className="flex items-center gap-2">
              <h1
                onClick={async () => {
                  dispatch(setGender("Female"));
                  setIsOpen(false);
                  await changeGender({ gender: "Female" });
                }}
                className={`${
                  gender == "Female" ? "text-white" : "text-[#999]"
                } text-[16px]`}
              >
                Female
              </h1>
              <span
                className={`w-[6px] h-[6px] rounded-full gradient-bg ${
                  gender == "Female" ? "block" : "hidden"
                }`}
              ></span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditGender;
