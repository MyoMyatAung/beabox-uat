import React from "react";
import UploadCard from "./upload-card";
import InfinitLoad from "../shared/infinit-load";
import { NoVideo } from "@/assets/profile";

const UploadList = ({
  list,
  refetch,
  handleEdit,
  fetchMoreData,
  hasMore,
  config,
  imgdomain,
  isFetching,
}: any) => {
  return (
    <>
      {list?.length ? (
        <div className="px-5 py-5">
          {/* <p className="text-[10px] text-[#FFEAEA] py-5">Today</p> */}
          <div className="flex flex-col gap-4">
            {list?.map((item: any, index: number) => (
              <div key={item?.post_id} onClick={() => handleEdit(item)}>
                <UploadCard item={item} config={config} imgdomain={imgdomain} />
              </div>
            ))}
          </div>
          <InfinitLoad
            data={list}
            fetchData={fetchMoreData}
            hasMore={hasMore}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full mt-[150px]">
          <NoVideo />
          <p className="text-[12px] text-[#888]">这里空空如也～</p>
        </div>
      )}
    </>
  );
};

export default UploadList;
