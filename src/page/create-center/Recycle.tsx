import TopNav from "@/components/create-center/top-nav";
import UploadCard from "@/components/create-center/upload-card";
import UploadList from "@/components/create-center/upload-list";
import { setIsSelect } from "@/store/slices/createCenterSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectBtn = ({ deleteItems }: any) => {
  const isSelected = useSelector((state: any) => state?.createCenter?.isSelect);

  return (
    <button
      //   onClick={() => dispatch(setIsSelect(!isSelected))}
      className={`text-[16px] bg-[#FFFFFF1F] px-2 py-1 rounded-full`}
    >
      {deleteItems?.length ? "Cancel" : "Select"}
    </button>
  );
};

const DeleteCard = ({ index, setDeleteItems }: any) => {
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
      onClick={() => handleItemClick(index)}
    >
      <div className="grid grid-cols-2 items-center">
        <img
          src="https://i.pinimg.com/236x/9e/21/11/9e211145e18c20159145b584738a8e2d.jpg"
          className="w-[128px] h-[80px] object-cover object-center rounded-[8px]"
          alt=""
        />
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[#888] truncate">
            Spider man no way home, no more home, no no no no no no no{" "}
          </p>
          <div className="flex justify-between items-center">
            <button className="bg-[#00FFC31F] text-[#00FFC3] rounded-full px-2 py-1">
              Publishing
            </button>
            <p className="text-[10px] text-[#bbb]">12 hr ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Recycle = () => {
  const [deleteItems, setDeleteItems] = useState([]);

  console.log(deleteItems);
  return (
    <>
      <TopNav
        center={"Recycle Bin"}
        right={<SelectBtn deleteItems={deleteItems} />}
      />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4]?.map((item: any, index: any) => (
          <DeleteCard
            key={index}
            index={index}
            setDeleteItems={setDeleteItems}
          />
        ))}
      </div>
    </>
  );
};

export default Recycle;
