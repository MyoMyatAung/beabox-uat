import { useEffect, useState } from "react";
import logo from "@/assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { setShowAlert } from "@/store/slices/profileSlice";

const AlertToast = ({ message }: any) => {
  const show = useSelector((state: any) => state.profile.showAlert);
  const alertText = useSelector((state: any) => state.profile.alertText);
  const dispatch = useDispatch();
  const showAlert = () => {
    dispatch(setShowAlert(true));
    setTimeout(() => dispatch(setShowAlert(false)), 4000);
  };

  useEffect(() => {
    if (show) showAlert();
  }, [show]);
  return (
    <>
      {show ? (
        <div className="w-full max-h-screen flex justify-center relative bg-transparent z-[5000]">
          <p className="absolute bottom-32 flex gap-2 text-[14px] bg-[#191721] px-4 py-2 rounded-lg text-center justify-center items-center">
            <img src={logo} className="w-5" alt="" /> <span>{alertText}</span>
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AlertToast;
