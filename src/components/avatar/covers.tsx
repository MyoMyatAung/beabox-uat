import { useGetCoverListQuery } from "@/store/api/createCenterApi";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import AvatarImage from "./avatar-image";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { useCoverUploadMutation } from "@/store/api/profileApi";
import TranLoader from "../shared/tran-loader";
import { MdLock } from "react-icons/md";

const Covers = ({ setShowCovers }: any) => {
  const [selectedCovers, setSelectedCovers] = useState<any>({});
  const [activeId, setActiveId] = useState("");
  const { data } = useGetCoverListQuery("");
  const [coverUpload, { data: coverUploadData, isLoading }] =
    useCoverUploadMutation();
  const uploadHandler = async () => {
    const { data } = await coverUpload({ id: activeId });
    if (data?.status) setShowCovers(false);
  };
  useEffect(() => {
    if (data) setSelectedCovers(data?.data[0]);
  }, [data]);

  return (
    <div className="bg-[#000000CC] w-full flex justify-center items-center h-screen fixed top-0 left-0 z-[9999]">
      {isLoading ? <TranLoader /> : <></>}

      <div className="bg-[#16131C] rounded-[22px] w-[90%] h-[75%] flex flex-col justify-between">
        <div className="">
          <TopBar setShowCovers={setShowCovers} />
        </div>
        <div className="flex-1 overflow-hidden overflow-y-scroll hide-sb">
          <div className="sticky top-0 z-50 flex whitespace-nowrap overflow-x-auto hide-sb bg-[#16131C]">
            {data?.data?.map((item: any, index: any) => (
              <div
                key={index}
                className="w-[72px] flex flex-col items-center justify-center gap-3"
                onClick={() => setSelectedCovers(item)}
              >
                <div className="w-[72px] h-[3px] bg-transparent"></div>
                <h1
                  className={`text-[14px] ${
                    selectedCovers?.level == item?.level
                      ? "text-white"
                      : "text-[#888888]"
                  }`}
                >
                  Lvl-{index + 1}
                </h1>
                <div
                  className={`w-[72px] h-[3px] ${
                    selectedCovers == item ? "bg-[#CD3EFF]" : "bg-transparent"
                  }`}
                ></div>
              </div>
            ))}
          </div>
          <div className="space-y-5 py-5 px-3">
            {selectedCovers?.list?.map((cover: any) => (
              <div
                onClick={
                  selectedCovers?.is_available
                    ? () => setActiveId(cover?.id)
                    : () => {}
                }
                className={`w-full relative border rounded-xl ${
                  activeId == cover?.id
                    ? "border-[#CD3EFF]"
                    : "border-transparent"
                } overflow-hidden`}
                key={cover?.image}
              >
                <ImageWithPlaceholder
                  src={cover?.image}
                  width={""}
                  height={""}
                  alt=""
                  className={`w-full ${
                    !selectedCovers?.is_available ? "brightness-50" : ""
                  } relative`}
                />
                {selectedCovers?.is_available ? (
                  <></>
                ) : (
                  <div className="">
                    <MdLock
                      size={20}
                      className="text-[#FFFFFFA3]  absolute right-5 top-5"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={uploadHandler}
            className="gradient-bg w-full text-[14px] py-4 rounded-[16px]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Covers;

const TopBar = ({ setShowCovers }: any) => {
  return (
    <div className="flex justify-between items-center p-5">
      <div className=""></div>
      <div className="">
        <p className="text-[18px]">选择背景</p>
      </div>
      <div className="">
        <button
          onClick={() => setShowCovers(false)}
          className="bg-[#FFFFFF0A] p-1 rounded-full"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
