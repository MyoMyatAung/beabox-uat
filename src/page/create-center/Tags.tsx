import TopNav from "@/components/create-center/top-nav";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronLeft, X } from "lucide-react";
import { useGetConfigQuery } from "@/store/api/createCenterApi";

const MAX_TAGS = 5;

const TagBtn = ({
  tag,
  setSelectedTags,
  addHashtag,
  removeTag,
  index,
  setHashtags,
  hashtags,
}: any) => {
  const [selected, setSelected] = useState(false);

  const isInclued = (tag: any) => {
    hashtags?.filter((item: any) => item == tag);
  };

  console.log(isInclued, "tags");

  const addTag = (tag: any) => {
    if (hashtags?.length >= MAX_TAGS) return;
    setSelected(true);
    isInclued(tag);
    setHashtags([...hashtags, tag.trim()]);
  };
  const remove = (indexToRemove: any) => {
    setSelected(false);
    setHashtags(hashtags.filter((tag: any) => tag !== indexToRemove));
  };
  return (
    <button
      onClick={!hashtags?.includes(tag) ? () => addTag(tag) : () => remove(tag)}
      className={`${
        hashtags?.includes(tag) ? "stagbg" : "bg-[#3A3A3A33]"
      } px-3 py-1 rounded-full ${
        hashtags?.length >= MAX_TAGS && !hashtags?.includes(tag)
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      disabled={hashtags?.length >= MAX_TAGS && !hashtags?.includes(tag)}
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
  setHashtags,
}: any) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: newData } = useGetConfigQuery({});
  const populars = newData?.data?.post_tags?.split(",");

  // Wrap addHashtag to include the limit check
  const handleAddHashtag = () => {
    if (hashtags?.length >= MAX_TAGS) return;
    addHashtag();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="px-2 bg-[#F0C3FF66] border-[1px] border-[#F0C3FF] py-1 rounded-full text-[14px] text-[#F0C3FF]">
          选择标签
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-0">
        <div className="h-screen overflow-y-scroll">
          <nav className="flex justify-between items-center p-5">
            <ChevronLeft onClick={() => setIsOpen(false)} />
            <p className="text-[16px]">选择标签</p>
            <div className="px-3" />
          </nav>
          <div className="px-5 py-5">
            <p className="text-[16px] pb-2">自定义标签</p>
            <div className="flex items-center gap-3">
              <input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                type="text"
                className="w-full bg-[#FFFFFF14] px-3 py-2 rounded-full"
                placeholder="请输入你的标签名称"
                disabled={hashtags?.length >= MAX_TAGS}
              />
              <button
                onClick={handleAddHashtag}
                className={`text-[#CD3EFF] w-[40px] text-[16px] ${
                  hashtags?.length >= MAX_TAGS
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={hashtags?.length >= MAX_TAGS}
              >
                添加
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 px-5">
            {hashtags
              .filter((tage: any) => !populars.includes(tage))
              ?.map((tag: any, index: any) => (
                <div
                  key={index}
                  className="stagbg px-3 py-1 rounded-full flex gap-1 items-center"
                >
                  <p> {tag?.trim()}</p>
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
            <p className="text-[16px] pb-2">热门标签</p>
            <div className="flex flex-wrap items-center gap-3">
              {populars?.map((tag: any, index: any) => (
                <TagBtn
                  key={tag}
                  tag={tag}
                  index={index}
                  setSelectedTags={setSelectedTags}
                  addHashtag={addHashtag}
                  removeTag={removeTag}
                  hashtags={hashtags}
                  setHashtags={setHashtags}
                />
              ))}
            </div>
          </div>
          <div className="pb-32"></div>
          <div className="w-full fixed bottom-5 px-5">
            <button
              onClick={() => setIsOpen(false)}
              className={`text-[16px] font-semibold bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white    w-full rounded-[16px] py-3`}
            >
              继续
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Tags;
