import SmallLoader from "@/components/shared/small-loader";
import SubmitButton from "@/components/shared/submit-button";
import { paths } from "@/routes/paths";
import {
  useCheckAnswerMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import { setForgotToken } from "@/store/slices/persistSlice";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const Question = () => {
  const [showAns, setShowAns] = useState(true);
  const [error, setError] = useState("");
  const forgotData = useSelector((state: any) => state.persist.forgotData);
  const [ans, setAns] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkAnswer, { isLoading }] = useCheckAnswerMutation();
  // console.log(forgotData);
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const { data } = await checkAnswer({
      token: forgotData?.token,
      answer: ans,
    });
    if (data) {
      dispatch(setForgotToken(data?.data?.token));
      navigate(paths.reset_password);
    } else {
      setError("答案错误");
    }
    // if (!data?.status)
  };
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.forgot_password}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">安全问题</p>
        <div></div>
      </div>

      <div className="w-full">
        <p className="text-[18px] my-5">
          {forgotData?.question?.security_question}
        </p>
        <form onSubmit={onSubmitHandler} className="w-full">
          <div className="relative w-full">
            <label htmlFor="" className="text-[#888] text-[14px]">
              回答
            </label>
            <input
              onChange={(e) => setAns(e.target.value)}
              type={showAns ? "text" : "password"}
              className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
              placeholder="请输入您的答案"
            />
            <button
              className=" absolute right-0 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setShowAns(!showAns);
              }}
            >
              {showAns ? (
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
              text={isLoading ? <SmallLoader /> : "继续"}
              isLoading={isLoading}
              condition={ans.length > 1}
            />
          </>
        </form>
      </div>
    </div>
  );
};

export default Question;
