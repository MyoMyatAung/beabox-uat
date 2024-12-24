import { ChevronLeft } from "lucide-react";
import React from "react";
import level from "../../assets/wallet/level.png";
import "./wallet.css";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  title: string;
  lv: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, lv }) => {

  const navigate = useNavigate()
  return (
    <div className=" flex px-[10px]">
      <div className=" grid grid-cols-3 w-full justify-end items-end  py-[12px]">
        <ChevronLeft onClick={() => navigate(-1)} />
        <h1 className=" text-center text-white text-[18px] font-[500]">
          {title}
        </h1>
        {lv && (
          <div className=" flex justify-end xl:justify-evenly">
            <div className=" flex items-center justify-end gap-[8px] level_box  w-[50px] h-[18px] relative">
              <img className=" absolute left-[-10px] top-[-5px] w-[30px] h-[26px]" src={level} alt="" />
              <span className=" p-[4px] text-[#625386] text-[12px] font-[800] leading-[16px]">
                Lv{"1"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
