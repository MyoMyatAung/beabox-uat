import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useChangeReferralCodeMutation } from "@/store/api/profileApi";
const EditReferral = ({ referral_code }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const user = useSelector((state: any) => state.persist.user);
  const [changeRerralCode, { data, isLoading }] =
    useChangeReferralCodeMutation();
  console.log(data);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    console.log(value);
    await changeRerralCode({ referral_code: value });
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>Referral Code</h1>
        <DrawerTrigger asChild>
          <p className="flex items-center gap-1 text-[#888]">
            {referral_code} <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0">
        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={18} />
            </button>
            <p className="text-[16px]">Referral Code</p>
            <div></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="Referral Code"
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

export default EditReferral;
