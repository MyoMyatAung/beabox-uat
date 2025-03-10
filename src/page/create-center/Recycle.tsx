import TopNav from "@/components/create-center/top-nav";
import UploadCard from "@/components/create-center/upload-card";
import UploadList from "@/components/create-center/upload-list";
import Loader from "@/components/shared/loader";
import {
  useDeletePostMutation,
  useGetRecyclePostsQuery,
  useRestorePostMutation,
} from "@/store/api/createCenterApi";
import { setIsSelect } from "@/store/slices/createCenterSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectBtn = ({ deleteItems, setDeleteItems }: any) => {
  const isSelected = useSelector((state: any) => state?.createCenter?.isSelect);

  return (
    <button
      // onClick={() => deleteItems?.length ?}
      className={`text-[16px] bg-[#FFFFFF1F] px-2 py-1 rounded-full`}
    >
      {deleteItems?.length ? "Cancel" : "Select"}
    </button>
  );
};

const DeleteCard = ({ index, setDeleteItems, item }: any) => {
  const [selected, setSelected] = useState(false);
  const handleItemClick = (index: number) => {
    setDeleteItems((prevItems: any) =>
      prevItems.includes(index)
        ? prevItems.filter((item: any) => item !== index)
        : [...prevItems, index]
    );
    setSelected(!selected);
  };
  return (
    <div
      className={`px-5 ${selected ? "bg-[#FFFFFF0D]" : ""} py-2 `}
      onClick={() => handleItemClick(item?.post_id)}
    >
      <div className="grid grid-cols-2 items-center">
        <img
          src={item?.preview_image}
          className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
          alt=""
        />
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#888] truncate">{item?.title}</p>
          <div className="flex justify-between items-center">
            <button className="bg-[#00FFC31F] text-[#00FFC3] rounded-full px-2 py-1">
              {item?.status}
            </button>
            <p className="text-[10px] text-[#bbb]">{item?.time_ago}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Recycle = () => {
  const [deleteItems, setDeleteItems] = useState([]);
  const { data, isLoading } = useGetRecyclePostsQuery("");
  const [restorePost, { data: rp }] = useRestorePostMutation();
  const [deletePost] = useDeletePostMutation();
  console.log(rp);
  const postRestoreHandler = async (type: any) => {
    await restorePost({ id: deleteItems, type: type });
  };
  const postDeleteHandler = async () => {
    // deleteItems?.map(async (item: any) => {
    //   await deletePost({ id: item?.post_id });
    // });
    await deletePost({ id: deleteItems });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <TopNav
            center={"Recycle Bin"}
            right={
              <SelectBtn
                deleteItems={deleteItems}
                setDeleteItems={setDeleteItems}
              />
            }
          />
          <div className="space-y-3 pb-24">
            {data?.data?.map((item: any, index: any) => (
              <DeleteCard
                key={index}
                index={index}
                setDeleteItems={setDeleteItems}
                item={item}
              />
            ))}
          </div>
          {deleteItems?.length ? (
            <div className="fixed bottom-0 py-5 w-full z-50 bg-[#16131C]">
              <div className="flex gap-4 mx-5 ">
                <button
                  onClick={() => postDeleteHandler()}
                  className="text-[16px] bg-[#C2303333] py-3 w-full text-[#C23033] rounded-[16px]"
                >
                  Delete
                </button>
                <button
                  onClick={() => postRestoreHandler("restore")}
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
      )}
    </>
  );
};

export default Recycle;
