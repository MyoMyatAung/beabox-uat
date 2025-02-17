import logo from "@/assets/logo.svg";
import { useEffect, useState } from "react";

const AuthError = ({ message }: any) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  }, [message]);

  return (
    <>
      {show ? (
        <div className="fixed z-[5000] mx-auto left-0 right-0 bottom-[150px] flex items-center justify-center">
          <div className="text-[8px] w-fit bg-[#191721] py-3 flex items-center justify-center px-5 gap-1 rounded-full toast  text-white text-center">
            <img src={logo} alt="" className="w-5 h-5" />
            <p className=" ml-1 text-[13px]">{message}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AuthError;
