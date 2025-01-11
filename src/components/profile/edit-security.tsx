import { paths } from "@/routes/paths";
import { useGetSecurityQuestionsMutation } from "@/store/api/profileApi";
import { ShieldAlert } from "lucide-react";
import React, { useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EditSecurity = () => {
  const securityQues = useSelector((state: any) => state.persist.securityQues);
  const [getSecurityQuestions, { data }] = useGetSecurityQuestionsMutation();
  const navigate = useNavigate();
  useEffect(() => {
    getSecurityQuestions('');
  }, []);
  console.log(data, securityQues, "sq");
  return (
    <div>
      <div
        className={`text-[14px] flex items-start justify-between ${
          !securityQues &&
          "bg-[#C2303314] p-3 border border-[#C2303329] rounded-[4px]"
        }`}
      >
        <div className="flex flex-col w-[70%] gap-2">
          <h1
            className={`flex items-center gap-1 ${
              !securityQues && "text-[#C23033]"
            }`}
          >
            {!securityQues && <ShieldAlert size={18} />}
            Security Question
          </h1>
          <p
            className={`text-[10px]  ${
              !securityQues ? "text-[#C23033]" : "text-[#888]"
            }`}
          >
            Set up security to protect your account from theft and lost
            passwords, and verify your identity for recovery.
          </p>
        </div>
        <p
          className={`flex items-center gap-1 ${
            !securityQues ? "text-[#C23033]" : "text-[#888]"
          }  ml-auto`}
          onClick={() =>
            !securityQues ? navigate(paths.security_questions) : navigate(paths.manage)
          }
        >
          {!securityQues ? "Set Now" : "Manage"} <FaAngleRight />
        </p>
      </div>
    </div>
  );
};

export default EditSecurity;
