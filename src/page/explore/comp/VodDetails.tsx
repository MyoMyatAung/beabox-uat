import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Player from "@/page/home/components/Player";
import "../../home/home.css";
import { ChevronLeft } from "lucide-react";
import search from "../../../assets/explore/search.svg";
import cmt from "../../../assets/explore/cmt.svg";

interface VodDetailsProps {
  setshow: (value: boolean) => void;
}

const VodDetails: React.FC<VodDetailsProps> = ({ setshow }) => {
  const { files } = useSelector((state: any) => state.explore);
  const [showFullTitle, setShowFullTitle] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleToggleTitle = () => {
    setShowFullTitle((prev) => !prev);
  };

  return (
    <div className="fixed top-0 inset-0 z-[97919] bg-black">
      {/* Header */}
      <div className="absolute top-0 z-[979191] flex gap-[6px] py-[30px] px-[20px] w-full">
        <button className="text-white" onClick={() => setshow(false)}>
          <ChevronLeft />
        </button>
        <div className="bg-white/10 rounded-[100px] w-full flex justify-centr py-[8px] px-[15px] items-center gap-[12px]">
          <img className="w-[22px] h-[22px]" src={search} alt="" />
          <span className="text-[14px] font-[400] text-white/40">
            {files.tag[0]}
          </span>
        </div>
      </div>

      {/* Video Player */}
      <div className="app__videos h-fit">
        <Player
          thumbnail={files.files[0].thumbnail}
          src={files.files[0].resourceURL}
        />

        {/* Footer */}
        <div className="absolute bottom-[50px] z-[979191] flex flex-col pl-[20px] pr-[40px] text-white">
          <span className="font-bold">{files.user.name}</span>
          <span>
            {showFullTitle ? (
              <>
                {files.title}{" "}
                <button className="text-white/70 " onClick={handleToggleTitle}>
                  see less
                </button>
              </>
            ) : (
              <>
                {files.title.length > 80
                  ? `${files.title.slice(0, 80)}... `
                  : files.title}{" "}
                {files.title.length > 80 && (
                  <button className="text-white/70" onClick={handleToggleTitle}>
                    see more
                  </button>
                )}
              </>
            )}
          </span>
        </div>
        <div className=" mx-[10px] bg-white/20 flex gap-[10px] rounded-[12px] px-[20px] py-[6px]">
          <input className=" my-[10px] w-full bg-transparent focus:outline-none" type="text" />
          <img src={cmt} alt="" />
        </div>
      </div>
      {/* cmt */}
    </div>
  );
};

export default VodDetails;
