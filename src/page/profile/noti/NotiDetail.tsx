import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const NotiDetail = () => {
  const state = useLocation();
  console.log(state.state);
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-black z-50">
          <Link to={paths.noti}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Details</p>
          <div></div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10"
              src={state.state.data.metadata.image}
              alt=""
            />

            <div className="">
              <p className="text-[12px]">{state.state.main}</p>
              <p className="text-[#777777] text-[12px]">
                {state.state.data.created_at}
              </p>
            </div>
          </div>
          <div className="">
            <p className="text-[16px]">{state.state.data.title}</p>
            <p className="text-[#777777] text-[14px]">
              {state.state.data.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotiDetail;
