import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useChangeUsernameMutation } from "@/store/api/profileApi";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../shared/submit-button";
import Loader from "../shared/loader";

const EditUsername = ({
  username,
  refetchHandler,
}: {
  username: string;
  refetchHandler: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [changeUsername, { data, isLoading }] = useChangeUsernameMutation();
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    await changeUsername({ username: value });
    await refetchHandler();
    setIsOpen(false);
    closeRef.current?.click();
  };

  return (
    <Drawer>
      <div className="text-[14px] flex items-center justify-between">
        <h1>用户名</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            {username} <FaAngleRight />
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
            <p className="text-[16px]">User Name</p>
            <div></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="Enter user name"
                onChange={(e: any) => setValue(e.target.value)}
                value={value}
              />
              <div className="bg-[#FFFFFF1F] w-5 h-5 flex justify-center items-center rounded-full absolute right-0 bottom-5">
                <X className="w-2" />
              </div>
            </div>
            {/* <Button
              type="submit"
              className={`w-full ${
                value.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              } bg-[#FFFFFF0A]   mt-10 rounded-xl`}
            >
              {isLoading ? "loading..." : "Save"}
            </Button> */}
            <SubmitButton
              isLoading={isLoading}
              condition={value.length > 1}
              text="Save"
            />
          </form>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditUsername;
