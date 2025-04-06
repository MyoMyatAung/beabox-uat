import React, { useEffect } from "react";
import UploadCard from "./upload-card";
import InfinitLoad from "../shared/infinit-load";
import { NoVideo } from "@/assets/profile";
import NoVideoCard from "../shared/no-video-card";

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
  const uniqueDates = [...new Set(list?.map((item: any) => item?.created_at))];
  // console.log(uniqueDates);

  const groupedData = uniqueDates.map((date) => ({
    date,
    list: list
      ?.filter((item: any) => item?.created_at === date)
      ?.map((item: any) => item),
  }));
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getTodayDate();

  // useEffect(() => {
  //   refetch();
  // }, []);

  return (
    <div className="p-5 flex flex-col gap-5">
      {groupedData?.length ? (
        <>
          {groupedData?.map((item: any) => (
            <div key={item?.date}>
              <p className="text-[10px] text-[#FFEAEA] py-5">
                {item?.date === today ? "今天" : item?.date}
              </p>
              <div className="flex flex-col gap-4">
                {item?.list?.map((item: any) => (
                  <div onClick={() => handleEdit(item)}>
                    <UploadCard
                      item={item}
                      config={config}
                      imgdomain={imgdomain}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
      <NoVideoCard />
      )}

      <InfinitLoad data={list} fetchData={fetchMoreData} hasMore={hasMore} />
    </div>
  );
};

export default UploadList;
