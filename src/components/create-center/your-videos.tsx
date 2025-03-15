import { ChevronRight } from "lucide-react";
import yourvideo from "@/assets/createcenter/yourvideo.png";
import Divider from "./divider";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyPostStatusCountQuery } from "@/store/api/createCenterApi";

const YourVideos = () => {
  const { data } = useGetMyPostStatusCountQuery("");
  let published = data?.data?.published || 0;
  let review = data?.data?.published || 0;
  let declined = data?.data?.declined || 0;
  console.log(data, "post status");
  return (
    <section className="bg-[#24222C] p-5 rounded-[20px] mx-5">
      <div className="flex items-center gap-2 ">
        <img src={yourvideo} className="w-9" alt="" />
        <Link to={paths.your_videos} className="text-[14px]">
        你的视频
        </Link>
        <Link to={paths.your_videos}>
          <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex justify-between items-center pt-5">
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>{published}</p>
          <p className="text-[#888888]">已发布</p>
        </div>
        <Divider />
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>{review}</p>
          <p className="text-[#888888]">待处理</p>
        </div>
        <Divider />
        <div className="text-[12px] flex flex-col items-center justify-center">
          <p>{declined}</p>
          <p className="text-[#888888]">已拒绝</p>
        </div>
      </div>
    </section>
  );
};

export default YourVideos;
