import TopNav from "@/components/create-center/top-nav";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronLeft, X } from "lucide-react";

const TagBtn = ({
  tag,
  setSelectedTags,
  addHashtag,
  removeTag,
  index,
}: any) => {
  const [selected, setSelected] = useState(false);

  const handleItemClick = (index: number) => {
    setSelectedTags((prevItems: any) =>
      prevItems.includes(index)
        ? prevItems.filter((item: any) => item !== index)
        : [...prevItems, index]
    );
    setSelected(!selected);
    addHashtag();
  };
  return (
    <button
      onClick={selected ? () => handleItemClick(tag) : () => removeTag(tag)}
      className={`${
        selected ? "stagbg" : "bg-[#3A3A3A33]"
      } px-3 py-1 rounded-full`}
    >
      {tag}
    </button>
  );
};

const Tags = ({
  newHashtag,
  setNewHashtag,
  addHashtag,
  hashtags,
  removeTag,
}: any) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="px-2 bg-[#F0C3FF66] border-[1px] border-[#F0C3FF] py-1 rounded-full text-[12px] text-[#F0C3FF]">
          Select Tag
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0 h-screen">
        <>
          <nav className="flex justify-between items-center p-5">
            <ChevronLeft onClick={() => setIsOpen(false)} />
            <p className="text-[16px]">Select Tags</p>
            <div className="px-3" />
          </nav>
          <div className="px-5 py-5">
            <p className="text-[16px] pb-2">Custom Tags</p>
            <div className="flex items-center gap-3">
              <input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                type="text"
                className="w-full bg-[#FFFFFF14] px-3 py-2 rounded-full"
                placeholder="Enter Your Tags Name"
              />
              <button
                onClick={addHashtag}
                className="text-[#CD3EFF] text-[16px]"
              >
                Add
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 px-5">
            {hashtags.map((tag: any, index: any) => (
              <div
                key={index}
                className="stagbg px-3 py-1 rounded-full flex gap-1 items-center"
              >
                <p> {tag}</p>
                <div
                  onClick={() => removeTag(index)}
                  className="bg-[#FFFFFF33] w-[18px] h-[18px] flex justify-center items-center rounded-full"
                >
                  <X size={12} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-5">
            <p className="text-[16px] pb-2">Popular Tags</p>
            <div className="flex flex-wrap items-center gap-3">
              {populars?.map((tag, index) => (
                <TagBtn
                  key={tag}
                  tag={tag}
                  index={index}
                  setSelectedTags={setSelectedTags}
                  addHashtag={addHashtag}
                  removeTag={removeTag}
                />
              ))}
            </div>
          </div>
          <div className="w-full fixed bottom-5 px-5">
            <button
              onClick={() => setIsOpen(false)}
              className={`text-[16px] font-semibold bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white    w-full rounded-[16px] py-3`}
            >
              Continue
            </button>
          </div>
        </>
      </DrawerContent>
    </Drawer>
  );
};

export default Tags;
