import { dateForamtter } from "@/lib/utils";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import creator from '@/assets/creator.png'

const OtherNoti = ({ item }: any) => {
  return (
    <>
      <div className="flex items-start gap-2">
        <AsyncDecryptedImage
          className="w-10 h-10 object-cover rounded-full"
          imageUrl={item?.icon || item?.metadata?.image || creator}
          alt="avatar"
        />
        <div className="w-full">
          <div className="flex items-center text-[14px] justify-between">
            <p>{item.title}</p>
            {item?.is_read ? (
              <></>
            ) : (
              <div className="w-2 h-2 rounded-full bg-[#FF0004]"></div>
            )}
          </div>
          <div className="flex items-end justify-between w-full ">
            <p className="text-[12px] w-[80%] text-[#888]">{item.message}</p>
            <p className="text-[10px] text-[#888]">
              {item.time_ago}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherNoti;
