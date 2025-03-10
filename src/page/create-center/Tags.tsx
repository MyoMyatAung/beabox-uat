import TopNav from "@/components/create-center/top-nav";
import React, { useState } from "react";

const TagBtn = ({ tag, setSelectedTags }: any) => {
  const [selected, setSelected] = useState(false);

  const handleItemClick = (index: number) => {
    setSelectedTags((prevItems: any) =>
      prevItems.includes(index)
        ? prevItems.filter((item: any) => item !== index)
        : [...prevItems, index]
    );
    setSelected(!selected);
  };
  return (
    <button
      onClick={() => handleItemClick(tag)}
      className={`${
        selected ? "stagbg" : "bg-[#3A3A3A33]"
      } px-3 py-1 rounded-full`}
    >
      {tag}
    </button>
  );
};

const Tags = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  console.log(selectedTags);
  const populars = [
    "Spider man",
    "Sony",
    "Hero",
    "Marvel",
    "DC",
    "Super man",
    "Bat man",
    "Wonder woman",
    "Naruot",
    "Basara",
    "Vinland",
  ];
  return (
    <div>
      <TopNav center="Select  Tags" />
      <div className="px-5 py-5">
        <p className="text-[16px] pb-2">Custom Tags</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="w-full bg-[#FFFFFF14] px-3 py-2 rounded-full"
            placeholder="Enter Your Tags Name"
          />
          <button className="text-[#CD3EFF] text-[16px]">Add</button>
        </div>
      </div>
      <div className="px-5 py-5">
        <p className="text-[16px] pb-2">Popular Tags</p>
        <div className="flex flex-wrap items-center gap-3">
          {populars?.map((tag) => (
            <TagBtn key={tag} tag={tag} setSelectedTags={setSelectedTags} />
          ))}
        </div>
      </div>
      <div className="w-full fixed bottom-5 px-5">
        <button
          className={`text-[16px] font-semibold bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white    w-full rounded-[16px] py-3`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Tags;
