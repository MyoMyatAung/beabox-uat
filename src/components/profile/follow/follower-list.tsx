import {
  useFilterFollowerQuery,
  useGetFollowerListQuery,
} from "@/store/api/profileApi";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../page/home/vod_loader.gif";
import FollowCard from "../follow-card";
import { UsersRound } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";

const FollowerList = ({ searchTerm, id }: any) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [followers, setFollowers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, isLoading, isFetching, refetch } = useGetFollowerListQuery(
    {
      user_id: id,
      page,
    },
    {
      skip: !user,
    }
  );

  const { data: filterdata, isLoading: filterLoading } = useFilterFollowerQuery(
    {
      user_id: id,
      search: searchTerm,
    },
    { skip: searchTerm === "" }
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.data?.length) {
      // Append new data to the existing videos
      setFollowers((prev: any) => [...prev, ...data.data]);
      setTotalData(data.pagination.total);
    }
  }, [data]);

  useEffect(() => {
    if (totalData <= followers.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, followers]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreData();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, followers]);

  if (isLoading && page === 1) {
    return (
      <div className=" flex justify-center w-full py-[200px]">
        <div className="">
          <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
        </div>
      </div>
    );
  }
  return (
    <>
      {/* <div className="py-2">
        <div className="bg-[#1E1C28] w-full rounded-full shadow-md flex items-center pl-4">
          <FaSearch />
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索用户"
            className="bg-[#1E1C28] rounded-full border-0 focus:border-transparent focus-visible:ring-0"
          />
        </div>
      </div> */}
      {searchTerm?.length ? (
        <>
          {filterdata?.data?.length ? (
            filterdata?.data?.map((follower: any) => (
              <FollowCard
                key={follower.user_code}
                data={follower}
                refetch={refetch}
              />
            ))
          ) : (
            <div className="flex justify-center mt-[40%]">
              <div className="flex flex-col items-center gap-3">
                <UsersRound className="text-[#888]" />
                <p className="text-[12px] text-[#888] w-[90px] text-center">
                  快关注你感兴 趣的用户吧！
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {followers?.length ? (
            <div className="flex flex-col gap-3">
              {followers?.map((follower: any) => (
                <FollowCard
                  key={follower.user_code}
                  data={follower}
                  refetch={refetch}
                />
              ))}
              <div
                ref={loadMoreRef}
                className="loading-indicator flex justify-center py-4"
              >
                {isFetching && (
                  <img
                    src={Loader}
                    className="w-[70px] h-[70px]"
                    alt="Loading"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex justify-center mt-[40%]">
              <div className="flex flex-col items-center gap-3">
                <UsersRound className="text-[#888]" />
                <p className="text-[12px] text-[#888] w-[90px] text-center">
                  快关注你感兴 趣的用户吧！
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FollowerList;
