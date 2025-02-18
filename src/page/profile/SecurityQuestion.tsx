import SubmitButton from "@/components/shared/submit-button";
import { paths } from "@/routes/paths";
import { useStoreSecurityQuesMutation } from "@/store/api/authApi";
import { setSecurityQues } from "@/store/slices/persistSlice";
import { RootState } from "@reduxjs/toolkit/query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../assets/backButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SecurityQuestion = () => {
  const [showQues, setShowQues] = useState(true);
  const [showAns, setShowAns] = useState(true);
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerUser = useSelector((state: any) => state?.persist?.registerUser);
  const user = useSelector((state: any) => state?.persist?.user);

  const [storeSecurityQues, { isLoading }] = useStoreSecurityQuesMutation();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const { data } = await storeSecurityQues({
      security_question: ques,
      answer: ans,
      rtoken: registerUser?.token,
    });
    if (data?.status) {
      dispatch(
        setSecurityQues({
          ques: data?.data?.security_question,
          ans: data?.datat?.answer,
        })
      );
    }
    user?.token ? navigate(paths.settings) : navigate(paths.login);
  };

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.settings}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">安全问题</p>
        <div></div>
      </div>
      <div className="">
        <p className="text-[14px]">
          创建自定义安全问题来验证您的身份并根据需要重置密码。
        </p>
        <form onSubmit={onSubmitHandler}>
          <div className="relative my-8">
            <label htmlFor="" className="text-[#888] text-[14px]">
            问题
            </label>
            <input
              type={showQues ? "text" : "password"}
              onChange={(e) => setQues(e.target.value)}
              className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
              placeholder="请提出问题"
            />
            <button
              className=" absolute right-0 bottom-2"
              onClick={(e) => {
                e.preventDefault();
                setShowQues(!showQues);
              }}
            >
              {showQues ? (
                <Eye className="w-[18px]" />
              ) : (
                <EyeOff className="w-[18px]" />
              )}
            </button>
            <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
          </div>
          <div className="relative">
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
          <p className="text-[14px] text-[#888] mt-3">
          避免对安全问题使用简单的答案，因为这会增加帐户被盗的风险！
          </p>
          <>
            <SubmitButton
              text="确认"
              isLoading={isLoading}
              condition={ans.length > 1 && ques?.length > 1}
            />
          </>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestion;
