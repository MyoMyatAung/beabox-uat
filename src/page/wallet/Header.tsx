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
    <div className=" flex px-[10px] relative pb-[20px]">
      <div className=" fixed flex w-full justify-center items-center  py-[14px] bg-[#16131C]">
        <ChevronLeft
          className=" absolute left-0 z-[11]"
          onClick={() => navigate(-1)}
        />
        <h1
          className={` ${
            lv ? " col-span-1 text-center" : "col-span-1 text-start"
          } text-white text-[18px] font-[500]`}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Header;
