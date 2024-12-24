import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { useChangeBioMutation } from "@/store/api/profileApi";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";

const EditBio = ({ bio }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [value, setValue] = useState("");
  const [changeBio, { data, isLoading }] = useChangeBioMutation();
  console.log(data);
  const navigate = useNavigate();
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    await changeBio({ bio: value });
    setIsOpen(false);
  };
  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>Bio</h1>
        <DrawerTrigger asChild>
          <p className="flex items-start gap-1 text-[#888]">
            <span className="max-w-[200px] ml-auto">{bio ? bio : ""}</span>
            <FaAngleRight className="mt-1" />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0">
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={18} />
            </button>
            <p className="text-[16px]">Bio</p>
            <div></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="relative">
              <textarea
                // name="bio"
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                className={`
                w-full px-0 py-2 bg-transparent
                border-b border-[#888]
                focus:outline-none focus:ring-0 focus:border-[#888]
                resize-none
                `}
                placeholder="Enter your profile bio"
              />
            </div>
            <Button
              type="submit"
              className={`w-full ${
                value.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              } bg-[#FFFFFF0A]  mt-10 rounded-xl`}
            >
              {isLoading ? "loading..." : "Save"}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditBio;
