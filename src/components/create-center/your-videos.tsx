import { ChevronRight } from "lucide-react";
import yourvideo from "@/assets/createcenter/yourvideo.png";
import Divider from "./divider";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyPostStatusCountQuery } from "@/store/api/createCenterApi";
import { useEffect } from "react";

const YourVideos = () => {
  const { data, refetch } = useGetMyPostStatusCountQuery("");
  const navigate = useNavigate();

  const published = data?.data?.published || 0;
  const review = data?.data?.review || 0;
  const declined = data?.data?.declined || 0;
  useEffect(() => {
    refetch();
  }, []);
//   to={paths.your_videos}
// to={paths.your_videos}
  return (
    <section onClick={() => navigate(paths.your_videos)} className="bg-[#24222C] p-5 rounded-[20px] mx-5">
      <div className="flex items-center gap-2 ">
        <img src={yourvideo} className="w-9" alt="" />
        <div className="text-[14px]">你的视频</div>
        <div>
          <ChevronRight size={14} />
        </div>
      </div>
      <div className="flex justify-between items-center pt-5">
        <div className="text-[14px] flex flex-col items-center justify-center">
          <p>{published}</p>
          <p className="text-[#888888]">已发布</p>
        </div>
        <Divider />
        <div className="text-[14px] flex flex-col items-center justify-center">
          <p>{review}</p>
          <p className="text-[#888888]">待处理</p>
        </div>
        <Divider />
        <div className="text-[14px] flex flex-col items-center justify-center">
          <p>{declined}</p>
          <p className="text-[#888888]">已拒绝</p>
        </div>
      </div>
    </section>
  );
};

export default YourVideos;
