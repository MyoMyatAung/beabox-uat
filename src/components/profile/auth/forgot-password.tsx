import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState } from "react";
import SubmitButton from "@/components/shared/submit-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetCaptchaMutation } from "@/store/api/authApi";
import SmallLoader from "@/components/shared/small-loader";
import { useCheckUsernameMutation } from "@/store/api/profileApi";
import { useDispatch } from "react-redux";
import { setForgotData } from "@/store/slices/persistSlice";
const ForgotPassword = () => {
  const [value, setValue] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getCaptcha, { data: captchaData, isLoading: captchaLoading }] =
    useGetCaptchaMutation();
  const [checkUsername, { isLoading, data }] = useCheckUsernameMutation();

  const showHandler = async () => {
    const { data } = await getCaptcha("");
    setShowVerification(true);
  };

  const handleVerify = async () => {
    const { data } = await checkUsername({
      username: value,
      captcha,
      captcha_key: captchaData?.data?.captcha_key,
    });
    if (!data?.status) {
      setError("出了点问题");
      setShowVerification(false);
    }
    dispatch(setForgotData(data?.data));
    navigate(paths.check_answer);
  };

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between bg-[#16131C]">
      <div className="w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">
            {/* {user?.token ? "Setting & Privacy" : "Setting"} */}
            Forgot Password
          </p>
          <div></div>
        </div>
        <div>
          <label htmlFor="" className="text-[14px] text-[#888888] my-3">
            Name
          </label>
          <div className="relative">
            <input
              value={value}
              className="block w-full px-3 py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
              placeholder="Enter User Name"
              onChange={(e) => setValue(e.target.value)}
              //   {...field}
            />

            <div
              onClick={() => setValue("")}
              className={`w-6 h-6 rounded-full ${
                value?.length ? "flex" : "hidden"
              } justify-center items-center bg-[#FFFFFF1F] absolute right-0 bottom-2`}
            >
              <X size={9} />
            </div>

            <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
          </div>
          <h1 className="mt-4 text-red-500 text-sm">{error}</h1>
          <Button
            disabled={captchaLoading}
            type="submit"
            onClick={showHandler}
            className={`w-full ${
              value?.length
                ? "gradient-bg hover:gradient-bg"
                : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
            }  bg-[#FFFFFF0A] mt-10 rounded-xl`}
          >
            {captchaLoading ? <SmallLoader /> : "Continue"}
          </Button>
        </div>
      </div>
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        {showVerification ? (
          <DialogContent className="bg-[#16131C] border-0 shadow-lg rounded-lg max-w-[290px]">
            <DialogHeader>
              <DialogTitle className="text-white text-[16px]">
                Verification
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex justify-center items-center gap-1 h-[36px]">
                <input
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Type Captcha"
                  className="bg-[#2D2738] w-[70%] px-[10px] h-full outline-none"
                />

                <img
                  src={captchaData?.data?.img}
                  className="w-[30%]  h-full  object-center outline-none border-gray-400"
                  alt=""
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={isLoading}
                type="submit"
                className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
              >
                {isLoading ? <SmallLoader /> : "Verify"}
              </Button>
            </div>
          </DialogContent>
        ) : (
          <></>
        )}
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
