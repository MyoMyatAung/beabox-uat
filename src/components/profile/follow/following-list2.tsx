import React, { useEffect, useState } from "react";
import FollowCard from "../follow-card";
import { useSelector } from "react-redux";
import {
  useFilterFollowingQuery,
  useGetFollowingListQuery,
} from "@/store/api/profileApi";
import { UsersRound } from "lucide-react";
import Loader from "../../../page/home/vod_loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";

const FollowingList2 = ({ searchTerm, id }: any) => {
  const [waterfall, setWaterFall] = useState<any[]>([]);
  // console.log(user_code)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching } = useGetFollowingListQuery({
    user_id: id,
    // search: searchTerm,
    page: page,
  });

  const { data: filterdata } = useFilterFollowingQuery({
    user_id: id,
    search: searchTerm,
  });
  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);
      const loadedItems =
        data.pagination.current_page * data.pagination.per_page;
      setHasMore(loadedItems < data.pagination.total);
    } else {
      setHasMore(false);
    }
    // console.log(data.pagination?.total);
  }, [data]);
  // console.log(" this is mf", waterfall);
  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };
  // console.log(data?.data, "following");
  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-5">
      {isLoading || isFetching ? (
        <div className=" flex justify-center w-full py-[200px]">
          <div className="">
            <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
          </div>
        </div>
      ) : (
        <>
          {searchTerm?.length ? (
            <>
              {filterdata?.data?.length ? (
                filterdata?.data?.map((follower: any) => (
                  <FollowCard key={follower.user_code} data={follower} />
                ))
              ) : (
                <div className="h-full flex justify-center mt-[40%]">
                  <div className="flex flex-col items-center gap-3">
                    <UsersRound className="text-[#888]" />
                    <p className="text-[12px] text-[#888] w-[90px] text-center">
                      暂无账户
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {data?.data?.length ? (
                <>
                  {waterfall.map((follower: any) => (
                    <FollowCard key={follower.user_code} data={follower} />
                  ))}
                  <InfiniteScroll
                    className=""
                    dataLength={data?.data?.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <div className=" flex justify-center w-screen h-[300px]">
                        <div className="">
                          <img
                            src={Loader}
                            className="w-[70px] h-[70px] hidden"
                            alt="Loading"
                          />
                        </div>
                      </div>
                    }
                    endMessage={
                      <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                        <p
                          className="py-10"
                          style={{ textAlign: "center" }}
                        ></p>
                      </div>
                    }
                  >
                    <></>
                  </InfiniteScroll>
                </>
              ) : (
                <div className="h-full flex justify-center mt-[40%]">
                  <div className="flex flex-col items-center gap-3">
                    <UsersRound className="text-[#888]" />
                    <p className="text-[12px] text-[#888] w-[90px] text-center">
                      暂无账户
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {/* {data?.data?.map((follower: any) => (
        <FollowCard key={follower.user_code} data={follower} />
      ))} */}
    </div>
  );
};

export default FollowingList2;
