import { useEffect, useState } from "react";
import {
  useChangeCoverMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { setCover } from "@/store/slices/persistSlice";
import Loader from "@/components/shared/loader";
import Covers from "../avatar/covers";
import pensvg from "@/assets/pensvg.svg";

interface EditCoverProps {
  coverimg?: string;
  refetch: () => void;
}

const EditCover = ({ refetch, coverimg }: EditCoverProps) => {
  const [showCovers, setShowCovers] = useState(false);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [settingUpload, { data: settingUploadData, isLoading: load1 }] =
    useSettingUploadMutation();
  const [changeCover, { data: changeCoverData, isLoading: load2 }] =
    useChangeCoverMutation();

  // useEffect(() => {
  //   if (settingUploadData?.status) {
  //     changeCover({ file_url: settingUploadData?.data?.url });
  //     refetch();
  //     dispatch(setCover(settingUploadData?.data?.url));
  //   }
  //   setIsOpen(false);
  // }, [settingUploadData]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

  return (
    <>
      {showCovers ? <Covers setShowCovers={setShowCovers} refetch={refetch} /> : <></>}
      {load1 || load2 ? (
        <div className="fixed left-0 right-0 top-[100px] flex justify-center items-center h-screen text-red-500 z-[9000]">
          <Loader />
        </div>
      ) : (
        <></>
      )}
      <div
        onClick={() => setShowCovers(true)}
        className="flex gap-2 z-[1900] bg-[#FFFFFF14]  justify-center min-w-[55px] px-3 h-[34px] rounded-[12px] items-center"
      >
        <img src={pensvg} className="w-[14px] h-auto" alt="" />
        <p className="text-[14px]">设置封面</p>
      </div>
    </>
  );
};

export default EditCover;
