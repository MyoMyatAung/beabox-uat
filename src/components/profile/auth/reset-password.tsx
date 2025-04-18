import SmallLoader from "@/components/shared/small-loader";
import SubmitButton from "@/components/shared/submit-button";
import { paths } from "@/routes/paths";
import { useSetPasswordMutation } from "@/store/api/profileApi";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [password, setPassword1] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);
  const [error, setError] = useState("");
  const forgotToken = useSelector((state: any) => state.persist.forgotToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [setPassword, { isLoading }] = useSetPasswordMutation();
  // console.log(forgotToken);
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const { data } = await setPassword({
      token: forgotToken,
      password,
    });
    if (!data?.status) setError("Something went wrong");
    navigate(paths.profile);
  };
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.check_answer}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">重置密码</p>
        <div></div>
      </div>

      <div className="w-full">
        <form onSubmit={onSubmitHandler} className="w-full">
          <div className="relative w-full">
            <label htmlFor="" className="text-[#888] text-[14px]">
              密码
            </label>
            <input
              onChange={(e) => setPassword1(e.target.value)}
              type={show1 ? "text" : "password"}
              className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
              placeholder="密码必须为8-25个字符"
              maxLength={25}
            />
            <button
              className=" absolute right-0 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setShow1(!show1);
              }}
            >
              {show1 ? (
                <Eye className="w-[18px]" />
              ) : (
                <EyeOff className="w-[18px]" />
              )}
            </button>
            <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
          </div>

          <div className="relative w-full mt-5">
            <label htmlFor="" className="text-[#888] text-[14px]">
              重新输入密码
            </label>
            <input
              onChange={(e) => setRetypePassword(e.target.value)}
              type={show2 ? "text" : "password"}
              className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
              placeholder="再次确认您的新秘密"
              maxLength={25}
            />
            <button
              className=" absolute right-0 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setShow2(!show2);
              }}
            >
              {show2 ? (
                <Eye className="w-[18px]" />
              ) : (
                <EyeOff className="w-[18px]" />
              )}
            </button>
            <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
          </div>
          <h1 className="mt-4 text-red-500 text-sm">{error}</h1>

          <>
            <SubmitButton
              text={isLoading ? <SmallLoader /> : "确认"}
              isLoading={
                (password === retypePassword ? false : true) || isLoading
              }
              condition={password.length > 1 && retypePassword?.length > 1}
            />
          </>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
