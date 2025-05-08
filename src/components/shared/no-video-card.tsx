import { NoVideo } from "@/assets/profile";

const NoVideoCard = ({ from = 'default' }: { from?: string }) => {
  return (
    <div className="pb-16">
      <div className="flex flex-col justify-center items-center w-full mt-[80px]">
        <NoVideo />
        { (from === 'upload' || from === 'liked' || from === 'history') &&
        <>
        <p className="text-[14px] text-white pt-3 pb-1">暂无视频内容</p>
        </>
        }
        { from === 'default' && 
                <p className="text-[14px] text-white pt-3 pb-1">
                暂无视频内容
                </p>
        }
        
      </div>
    </div>
  );
};

export default NoVideoCard;
