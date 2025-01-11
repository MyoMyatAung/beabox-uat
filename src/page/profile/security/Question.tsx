import SubmitButton from "@/components/shared/submit-button";
import { paths } from "@/routes/paths";
import { useStoreSecurityQuesMutation } from "@/store/api/authApi";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { setSecurityQues } from "@/store/slices/persistSlice";
import { RootState } from "@reduxjs/toolkit/query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const Question = () => {
  const { data, isLoading } = useGetMyProfileQuery("");

  const [showAns, setShowAns] = useState(true);
  const [ans, setAns] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    navigate(paths.settings);
  };
  console.log(data);
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.settings}>
          <FaAngleLeft size={18} />
        </Link>
        <p className="text-[16px]">Security Question</p>
        <div></div>
      </div>
      {isLoading ? (
        <></>
      ) : (
        <div className="w-full">
          <p className="text-[14px] my-5">
            {data?.data?.security_question?.security_question}
          </p>
          <form onSubmit={onSubmitHandler} className="w-full">
            <div className="relative w-full">
              <label htmlFor="" className="text-[#888] text-[14px]">
                Answer
              </label>
              <input
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
            <>
              <SubmitButton
                text="Confirm"
                isLoading={false}
                condition={ans.length > 1}
              />
            </>
          </form>
        </div>
      )}
    </div>
  );
};

export default Question;
