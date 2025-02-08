import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingBtn2 from "./setting-btn2";
const OscrollHeader = ({ photo, name, id }: any) => {
  const navigate = useNavigate();
  return (
    <div className="z-[1500] sticky top-0 px-5 flex justify-between items-center w-full py-5">
      <div className="flex items-center gap-3">
        <img
          className="w-[58px] z-[1500] h-[58px] rounded-full object-cover object-center"
          src={photo}
          alt=""
        />
        <p className="z-[1500]">{name}</p>
      </div>
      <div className="flex gap-3 z-[1500] items-center">
        {/* <div
          onClick={() => navigate(`/reports/profile/${id}`)}
          className="z-[1500] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          <EllipsisVertical />
        </div> */}
        <SettingBtn2 id={id} />
      </div>
    </div>
  );
};

export default OscrollHeader;
