import SmallLoader from "@/components/shared/small-loader";
import SubmitButton from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { useStoreSecurityQuesMutation } from "@/store/api/authApi";
import {
  useGetMyProfileQuery,
  useRemoveSecurityQuestionMutation,
} from "@/store/api/profileApi";
import { setSecurityQues } from "@/store/slices/persistSlice";
import { RootState } from "@reduxjs/toolkit/query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Manage = () => {
  const { data, isLoading } = useGetMyProfileQuery("");
  const [showQues, setShowQues] = useState(true);
  const [showAns, setShowAns] = useState(true);
  const [ques, setQues] = useState(
    data?.data?.security_question?.security_question || ""
  );
  const [storeSecurityQues, { isLoading: isLoading1 }] =
    useStoreSecurityQuesMutation();
  const [removeSecurityQuestion, { isLoading: isLoading2 }] =
    useRemoveSecurityQuestionMutation();
  const sanswer = useSelector((state: any) => state.persist.sanswer);
  const [ans, setAns] = useState(sanswer || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerUser = useSelector((state: any) => state.persist.registerUser);


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
    navigate(paths.settings);
  };

  const removeHandler = async () => {
    const { data } = await removeSecurityQuestion("");
    // console.log(data);
    if (data?.status) dispatch(setSecurityQues(null));

    navigate(paths.settings);
  };

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.check_answer2}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">管理安全</p>
        <div></div>
      </div>
      <div className="">
        <p className="text-[14px]">
          创建自定义安全问题来验证您的身份并在需要时重置您的密码。
        </p>
        {isLoading ? (
          <></>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <div className="relative my-8">
              <label htmlFor="" className="text-[#888] text-[14px]">
                问题
              </label>
              <input
                defaultValue={data?.data?.security_question?.security_question}
                type={showQues ? "text" : "password"}
                onChange={(e) => setQues(e.target.value)}
                className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
                placeholder="Please set up a questiontion"
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
                defaultValue={sanswer}
                onChange={(e) => setAns(e.target.value)}
                type={showAns ? "text" : "password"}
                className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none mt-2"
                placeholder="Please Enter Your Answer"
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
              避免使用简单的答案作为安全问题，因为这会增加帐户被盗的风险！
            </p>
            <>
              <SubmitButton
                text={isLoading1 ? <SmallLoader /> : "节省"}
                isLoading={isLoading1}
                condition={ans.length > 1 && ques?.length > 1}
              />
              <Button
                onClick={removeHandler}
                className="w-full rounded-xl bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A] mt-5"
              >
                {isLoading2 ? <SmallLoader /> : "消除"}
                {/* Remove */}
              </Button>
            </>
          </form>
        )}
      </div>
    </div>
  );
};

export default Manage;
