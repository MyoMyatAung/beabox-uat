// import { FaAngleLeft } from "react-icons/fa";
import { useRef, useState } from "react";
import { useChangeBioMutation } from "@/store/api/profileApi";
import { useDispatch } from "react-redux";
import { setBio } from "@/store/slices/persistSlice";
import SubmitButton from "../shared/submit-button";
import Loader from "../shared/loader";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { ChevronLeft } from "lucide-react";
import SmallLoader from "../shared/small-loader";
const AddBio = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const maxLength = 100;
  const [changeBio, { data, isLoading }] = useChangeBioMutation();
  const dispatch = useDispatch();
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    dispatch(setBio(value));
    await changeBio({ bio: value });
    navigate(paths.profile);
  };

  const setValueHandler = (e: any) => {
    const inputValue = e.target.value;

    // Only update the state if the text length is less than 100
    if (inputValue.length <= 100) {
      setValue(inputValue);
    }
  };

  return (
    <div className="w-full h-screen px-5 bg-[#16131C]">
      <div className="flex justify-between items-center py-5">
        <ChevronLeft
          onClick={() => navigate(paths.profile)}
          size={18}
          className="z-50"
        />

        <p className="text-[16px]">个性签名</p>
        <div></div>
      </div>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="" className="text-[14px] text-[#888] pt-10">
          个人简介
        </label>
        <div className="relative">
          <div className="relative">
            <textarea
              value={value}
              onChange={setValueHandler}
              placeholder="请输入您的个性签名"
              className="w-full resize-none  bg-transparent p-3 text-white placeholder:text-gray-400  border-b border-[#888] focus:outline-none focus:ring-0 focus:border-[#888]"
            />
            <span className="absolute bottom-2 right-2 text-sm text-gray-400">
              {value?.length}/{maxLength}
            </span>
          </div>
        </div>
        <SubmitButton
          isLoading={isLoading}
          condition={value?.length > 1}
          text={isLoading ? <SmallLoader /> : "保存"}
        />
      </form>
    </div>
  );
};

export default AddBio;
