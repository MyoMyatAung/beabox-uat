import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import level from "../../assets/wallet/level.png";
import "./wallet.css";
import { useNavigate } from "react-router-dom";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
interface HeaderProps {
  title: string;
  lv: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, lv }) => {
  const [pic, setPic] = useState("");
  const { data } = useGetMyProfileQuery("");

  useEffect(() => {
    setPic(data?.data.level);
  }, [data]);

  const navigate = useNavigate();
  // console.log(lv)
  return (
    <div className=" flex px-[10px]">
      <div className=" flex w-full justify-center items-center  py-[12px] relative">
        <ChevronLeft className=" absolute left-0 z-[11]" onClick={() => navigate(-1)} />
        <h1 className={` ${lv ? " col-span-1 text-center" : "col-span-1 text-start"} text-white text-[18px] font-[500]`}>
          {title}
        </h1>
        {/* {lv && (
          <>
            {data?.data && (
              <div className=" flex justify-end">

              <img src={pic} className=" w-[59px] h-[26px]" alt="" />
              </div>
            )}
          </>
        )} */}
      </div>
    </div>
  );
};

export default Header;
