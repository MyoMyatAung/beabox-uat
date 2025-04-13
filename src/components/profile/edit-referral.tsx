import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useChangeReferralCodeMutation } from "@/store/api/profileApi";
import Loader from "../shared/loader";
const EditReferral = ({
  referral_code,
  showAlertHandler,
  refetchHandler,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [value, setValue] = useState("");
  const user = useSelector((state: any) => state?.persist?.user);
  const [changeRerralCode, { data, isLoading }] =
    useChangeReferralCodeMutation();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    await changeRerralCode({ referral_code: value });
    await refetchHandler();
    setIsOpen(false);
  };

  useEffect(() => {
    setValue(referral_code);
  }, [isOpen]);
  // console.log(referral_code, "referral code data");
  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(true)}>
      {referral_code ? (
        <div
          onClick={showAlertHandler}
          className="text-[14px] flex items-center justify-between"
        >
          <h1>邀请码</h1>
          <p className="flex items-center gap-1 text-[#888]">
            {referral_code}
            <FaAngleRight />
          </p>
        </div>
      ) : (
        <DrawerTrigger asChild>
          <div className="text-[14px] flex items-center justify-between">
            <h1>邀请码</h1>
            <p className="flex items-center gap-1 text-[#888]">
              {referral_code}
              <FaAngleRight />
            </p>
          </div>
        </DrawerTrigger>
      )}
      <DrawerContent className="border-0">
        {isLoading ? <Loader /> : <></>}

        <div className="w-full h-screen px-5">
          <div className="flex justify-between items-center py-5">
            <button onClick={() => setIsOpen(false)}>
              <FaAngleLeft size={22} />
            </button>
            <p className="text-[16px]">我的推广达人</p>
            <div></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="" className="text-[14px] text-[#888] pt-10">
              我的推广达人
            </label>
            <div className="relative">
              <input
                className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888]"
                placeholder="输入邀请码"
                onChange={(e: any) => setValue(e.target.value)}
                value={value}
                // defaultValue={referral_code}
              />
              <div
                onClick={() => setValue("")}
                className="bg-[#FFFFFF1F] w-5 h-5 flex justify-center items-center rounded-full absolute right-0 bottom-5"
              >
                <X className="w-2" />
              </div>
            </div>
            <Button
              type="submit"
              className={`w-full ${
                value?.length > 1
                  ? "gradient-bg hover:gradient-bg"
                  : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              } bg-[#FFFFFF0A]   mt-10 rounded-xl`}
            >
              保存
              {/* {isLoading ? "loading..." : "Save"} */}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditReferral;
