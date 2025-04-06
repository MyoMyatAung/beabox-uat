import { NoVideo } from "@/assets/profile";

const NoVideoCard = () => {
  return (
    <div className="pb-16">
      <div className="flex flex-col justify-center items-center w-full mt-[150px]">
        <NoVideo />
        <p className="text-[12px] text-white pt-3 pb-1">您还没有发布任何视频</p>
        <p className="text-[10px] text-[#888]">开始发布并成为顶尖创作者吧！</p>
      </div>
    </div>
  );
};

export default NoVideoCard;
