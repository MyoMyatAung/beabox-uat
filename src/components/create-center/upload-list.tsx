import React from "react";
import UploadCard from "./upload-card";
import InfinitLoad from "../shared/infinit-load";

const UploadList = ({
  list,
  refetch,
  handleEdit,
  fetchMoreData,
  hasMore,
  config,
}: any) => {
  return (
    <div className="px-5 py-5">
      {/* <p className="text-[10px] text-[#FFEAEA] py-5">Today</p> */}
      <div className="flex flex-col gap-4">
        {list?.map((item: any, index: number) => (
          <div key={item?.post_id} onClick={() => handleEdit(item)}>
            <UploadCard item={item} config={config} />
          </div>
        ))}
        <InfinitLoad data={list} fetchData={fetchMoreData} hasMore={hasMore} />
      </div>
    </div>
  );
};

export default UploadList;
