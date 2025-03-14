import TopNav from "@/components/create-center/top-nav";
import loader from "@/page/home/vod_loader.gif";
import InfinitLoad from "@/components/shared/infinit-load";
import Loader from "@/components/shared/loader";
import TranLoader from "@/components/shared/tran-loader";
import {
  useDeletePostMutation,
  useGetConfigQuery,
  useGetRecyclePostsQuery,
  useRestorePostMutation,
} from "@/store/api/createCenterApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UploadImg from "@/components/create-center/upload-img";
import RecyclePopup from "@/components/create-center/recycle-popup";

const SelectBtn = ({
  deleteItems,
  setDeleteItems,
  multiRestoreHandler,
}: any) => {
  const cancelHandler = () => setDeleteItems([]);
  return (
    <>
      {deleteItems?.length ? (
        <button
          onClick={() => cancelHandler()}
          className={`text-[16px] bg-[#FFFFFF1F] px-2 py-1 rounded-full`}
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={() => multiRestoreHandler()}
          className={`text-[16px] bg-[#FFFFFF1F] px-2 py-1 rounded-full`}
        >
          Select
        </button>
      )}
    </>
  );
};

const DeleteCard = ({ index, setDeleteItems, item, deleteItems }: any) => {
  const { data: newData } = useGetConfigQuery({});
  const imgdomain = newData?.data?.post_domain?.image;
  const [selected, setSelected] = useState(false);
  const handleItemClick = (index: number) => {
    setDeleteItems((prevItems: any) =>
      prevItems.includes(index)
        ? prevItems.filter((item: any) => item !== index)
        : [...prevItems, index]
    );
    // setSelected(!selected);
  };
  return (
    <div
      className={`px-5 ${
        deleteItems?.includes(item?.post_id) ? "bg-[#FFFFFF0D]" : ""
      } py-2 `}
      onClick={() => handleItemClick(item?.post_id)}
    >
      <div className="grid grid-cols-2 items-center">
        {item?.preview_image?.endsWith(".txt") ? (
          <UploadImg imgsrc={item?.preview_image} />
        ) : (
          <img
            src={`${imgdomain}/${item?.preview_image}`}
            className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
            alt=""
          />
        )}
        {/* <img
          src={`${imgdomain}/${item?.preview_image}`}
          className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
          alt=""
        /> */}
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#888] truncate">{item?.title}</p>
          <div className="flex justify-between items-center">
            <button className="bg-[#FFFFFF1F] text-[#fff] rounded-full px-2 py-1 capitalize">
              {item?.status?.replace("_", " ")}
            </button>
            <p className="text-[10px] text-[#bbb]">{item?.time_ago}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Recycle = () => {
  const [deleteItems, setDeleteItems] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("");

  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetRecyclePostsQuery(page);
  const [restorePost, { data: restoredata, isLoading: restoreLoading }] =
    useRestorePostMutation();
  const [deletePost, { data: deletedata, isLoading: deleteLoading }] =
    useDeletePostMutation();
  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const postRestoreHandler = async (type: any) => {
    await restorePost({ id: deleteItems, type: type });
    setDeleteItems([]);
    setShow(false);
  };

  const multiRestoreHandler = () => {
    if (posts) setDeleteItems([...posts?.map((item: any) => item?.post_id)]);
  };

  const postDeleteHandler = () => {
    deleteItems?.map(async (item: any) => {
      await deletePost({ id: item });
    });
    setDeleteItems([]);
    setShow(false);
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

  if (isLoading && page == 1) return <Loader />;
  return (
    <div className="relative">
      {show ? (
        <RecyclePopup
          action={action}
          setShow={setShow}
          postDeleteHandler={postDeleteHandler}
          postRestoreHandler={postRestoreHandler}
        />
      ) : (
        <></>
      )}
      <>
        {restoreLoading || deleteLoading ? (
          <div className="w-full bg-[#000000A3] h-screen fixed top-0 left-0 flex justify-center items-center z-50">
            <img src={loader} alt="" className="w-20" />
          </div>
        ) : (
          <></>
        )}
        <div className="sticky top-0 bg-[#16131C]">
          <TopNav
            center={"Recycle Bin"}
            right={
              <SelectBtn
                deleteItems={deleteItems}
                setDeleteItems={setDeleteItems}
                multiRestoreHandler={multiRestoreHandler}
              />
            }
          />
        </div>
        <div className="space-y-3 pb-24">
          {posts?.map((item: any, index: any) => (
            <DeleteCard
              key={index}
              index={index}
              setDeleteItems={setDeleteItems}
              deleteItems={deleteItems}
              item={item}
            />
          ))}
          <InfinitLoad
            data={posts}
            fetchData={fetchMoreData}
            hasMore={hasMore}
          />
        </div>
        {deleteItems?.length ? (
          <div className="fixed bottom-0 py-5 w-full z-50 bg-[#16131C]">
            <div className="flex gap-4 mx-5 ">
              <button
                onClick={() => {
                  setAction("delete");
                  setShow(true);
                }}
                // onClick={() => postDeleteHandler()}
                className="text-[16px] bg-[#C2303333] py-3 w-full text-[#C23033] rounded-[16px]"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setAction("restore");
                  setShow(true);
                }}
                // onClick={() => postRestoreHandler("restore")}
                className="text-[16px] bg-[#FFFFFF1F] py-3 w-full text-[#fff] rounded-[16px]"
              >
                Restore
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  );
};

export default Recycle;
