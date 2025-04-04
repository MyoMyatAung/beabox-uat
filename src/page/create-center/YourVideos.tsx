import FilterNav from "@/components/create-center/filter-nav";
import TopNav from "@/components/create-center/top-nav";
import UploadList from "@/components/create-center/upload-list";
import Loader from "@/components/shared/loader";
import { paths } from "@/routes/paths";
import loader from "@/page/home/vod_loader.gif";

import {
  useGetPostsQuery,
  useGetConfigQuery,
} from "@/store/api/createCenterApi";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadVideos from "./VideoUpload";
const Loader2 = () => (
  <div className="flex justify-center items-center w-full mt-[200px]">
    <img src={loader} alt="" className="w-20" />
  </div>
);

const YourVideos = () => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const { data: newData, isLoading: cfloading } = useGetConfigQuery({});
  const config = newData?.data?.creator_center_post_filter;
  const imgdomain = newData?.data?.post_domain?.image;
  // const { data, isLoading, refetch } = useGetPostListQuery("");
  const { data, isLoading, isFetching, refetch } = useGetPostsQuery({
    page,
    status: isActive,
  });

  console.log(data);

  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [editPost, seteditPost] = useState(null);
  const handleEdit = (record: any) => {
    seteditPost(record);
  };

  useEffect(() => {
    if (data?.data?.length) {
      // Append new data to the existing videos
      setPosts((prev: any) => [...prev, ...data.data]);
      setTotalData(data.pagination.total);
    }
  }, [data]);

  useEffect(() => {
    if (totalData <= posts.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, posts]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   setPage(1);
  //   setPosts([]);
  //   setHasMore(true);
  //   refetch();
  // }, [isActive, refetch]);
  useEffect(() => {
    if (newData?.data?.creator_center_post_filter) {
      setIsActive("all");
    }
  }, [newData]);

  // useEffect(() => {
  //   if (!editPost) refetch();
  // }, [editPost]);
  // console.log(newData?.data?.creator_center_post_filter);

  console.log(isFetching, "isFetching");

  if (editPost) {
    return (
      <UploadVideos
        editPost={editPost}
        seteditPost={seteditPost}
        refetch={refetch}
      />
    );
  }
  return (
    <div className="">
      {isLoading && cfloading && page === 1 ? (
        <Loader />
      ) : (
        <div>
          <div className="sticky top-0 bg-[#16131C] pb-2">
            <TopNav
              center={"你的视频"}
              right={
                <Trash onClick={() => navigate(paths.recycle)} size={18} />
              }
            />
            <FilterNav
              config={config}
              setIsActive={setIsActive}
              isActive={isActive}
              setPage={setPage}
              setPosts={setPosts}
              refetch={refetch}
              setHasMore={setHasMore}
            />
          </div>
          <div className="">
            {isFetching && page === 1 ? (
              <Loader2 />
            ) : (
              <UploadList
                imgdomain={imgdomain}
                config={config}
                list={posts}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                handleEdit={handleEdit}
                isFetching={isFetching}
              />
            )}
            <div className="pb-10"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourVideos;
