import { ChevronRight } from "lucide-react";
import yourvideo from "@/assets/createcenter/yourvideo.png";
import Divider from "./divider";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";

const YourVideos = () => {
  return (
    <section className="bg-[#24222C] p-5 rounded-[20px] mx-5">
      <div className="flex items-center gap-2 ">
        <img src={yourvideo} className="w-9" alt="" />
        <Link to={paths.your_videos} className="text-[14px]">
          Your Videos
        </Link>
        <Link to={paths.your_videos}>
          <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex justify-between items-center pt-5">
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>12</p>
          <p className="text-[#888888]">Published</p>
        </div>
        <Divider />
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>12</p>
          <p className="text-[#888888]">Pending</p>
        </div>
        <Divider />
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>12</p>
          <p className="text-[#888888]">Rejected</p>
        </div>
      </div>
    </section>
  );
};

export default YourVideos;
