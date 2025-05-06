import { NoVideo } from "@/assets/profile";

const NoVideoCard = ({ from = 'default' }: { from?: string }) => {
  return (
    <div className="pb-16">
      <div className="flex flex-col justify-center items-center w-full mt-[80px]">
        <NoVideo />
        { from === 'upload' &&
        <>
        <p className="text-[12px] text-white pt-3 pb-1">您还没有发布任何视频</p>
        <p className="text-[10px] text-[#888]">开始发布并成为顶尖创作者吧！</p>
        </>
        }
        { from === 'liked' &&
        <>
        <p className="text-[12px] text-white pt-3 pb-1">您还没有喜欢任何视频</p>
        <p className="text-[10px] text-[#888]">去发现更多精彩内容吧!</p>
        </>
        }
        { from === 'history' &&
        <>
        <p className="text-[12px] text-white pt-3 pb-1">您还没有观看记录</p>
        <p className="text-[10px] text-[#888]">快去看看感兴趣的视频吧!</p>
        </>
        }
        { from === 'default' && 
                <p className="text-[12px] text-white pt-3 pb-1">
                这里空空如也～
                </p>
        }
        
      </div>
    </div>
  );
};

export default NoVideoCard;
