import React from "react";
import UploadCard from "./upload-card";

const UploadList = ({ list, refetch }: any) => {
  return (
    <div className="px-5 py-5">
      {/* <p className="text-[10px] text-[#FFEAEA] py-5">Today</p> */}
      <div className="flex flex-col gap-4">
        {list?.map((item: any, index: number) => (
          <UploadCard key={item?.post_id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default UploadList;
