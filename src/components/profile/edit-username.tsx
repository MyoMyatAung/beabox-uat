import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useChangeUsernameMutation } from "@/store/api/profileApi";
import { useNavigate } from "react-router-dom";

const EditUsername = ({ username }: { username: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [changeUsername, { data, isLoading }] = useChangeUsernameMutation();
  const navigate = useNavigate();
  console.log(data);

  console.log(data);
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    console.log(value);
    await changeUsername({ username: value });
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>User Name</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            {username} <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0">
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={18} />
            </button>
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
            <Button
              type="submit"
              className={`w-full ${
                value.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              } bg-[#FFFFFF0A]   mt-10 rounded-xl`}
            >
              {isLoading ? "loading..." : "Save"}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditUsername;
