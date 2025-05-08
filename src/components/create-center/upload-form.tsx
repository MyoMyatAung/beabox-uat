import React, { useState } from "react";
import toast from "react-hot-toast";
import Privacy from "./privacy";

import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import Tags from "@/page/create-center/Tags";
import Info from "./info";
import { useGetConfigQuery } from "@/store/api/createCenterApi";
const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const UploadFrom = ({
  onFormSubmit,
  uploading,
  editPost,
  loading,
  agree,
  setAgree,
}: any) => {
  const { data } = useGetConfigQuery({});
  const link = data?.data?.website_upload_link;

  console.log(link);

  const [privacy, setPrivacy] = useState(editPost?.privacy || "public");
  const [contentTitle, setContentTitle] = useState(editPost?.title || "");
  const [hashtags, setHashtags] = useState(editPost?.tag || []);
  const [newHashtag, setNewHashtag] = useState("");

  const addHashtag = () => {
    if (newHashtag.trim() === "") {
      toast.error("Please enter a valid hashtag.", {
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    if (hashtags.length >= 5) {
      toast.error("You can only add up to 5 hashtags.", {
        style: {
          background: "#25212a",
          color: "white",
        },
      });

      return;
    }

    setHashtags([...hashtags, newHashtag.trim()]);
    setNewHashtag("");
  };

  const handleSubmit = () => {
    // console.log("testing");
    // console.log(privacy, contentTitle, setContentTitle, setHashtags, hashtags);

    // if (!contentTitle) {
    //   toast.error("Please enter a content title.", {
    //     style: {
    //       background: "#25212a",
    //       color: "white",
    //     },
    //   });
    //   return;
    // }

    // if (!agreeToGuidelines) {
    //   toast.error("Please agree to the upload guidelines.", {
    //     style: {
    //       background: "#25212a",
    //       color: "white",
    //     },
    //   });
    //   return;
    // }
    // console.log(privacy, contentTitle, setContentTitle, setHashtags, hashtags);
    onFormSubmit({
      privacy,
      contentTitle,
      setContentTitle,
      setHashtags,
      hashtags,
    });
  };

  const removeTag = (indexToRemove: any) => {
    setHashtags(
      hashtags.filter((_: any, index: any) => index !== indexToRemove)
    );
  };

  return (
    <div className="">
      <div className="py-5">
        <Privacy privacy={privacy} setPrivacy={setPrivacy} />
      </div>

      <div className="px-5 py-5 flex flex-col gap-10">
        <div className="flex flex-col justify-start">
          <label htmlFor="" className="text-[14px]">
            内容标题
          </label>
          <input
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            type="text"
            className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
            placeholder="请输入标题"
          />
          <p className="text-[10px] text-[#FFFFFF99] my-1">
            请输入标题。一个好的标题可以提高视频的点击率。
          </p>
        </div>

        <div className="flex flex-col justify-start relative">
          <label htmlFor="" className="text-[14px]">
            话题标签
          </label>
          <div className="flex items-center w-full jsutify-start bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {hashtags?.length ? (
                hashtags.map((tag: any, index: any) => (
                  <div
                    key={index}
                    onClick={() => removeTag(index)}
                    className="text-[14px] bg-[#FFFFFF14] px-2 py-0.5 rounded-full"
                  >
                    # {tag}
                  </div>
                ))
              ) : (
                <p className="text-[16px] text-[#FFFFFF52]">
                  添加话题标签（最多5个）
                </p>
              )}
            </div>
            <div className="">
              <Tags
                hashtags={hashtags}
                removeTag={removeTag}
                newHashtag={newHashtag}
                setNewHashtag={setNewHashtag}
                addHashtag={addHashtag}
                setHashtags={setHashtags}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="text-[14px] text-[#FFFFFF99] flex items-start mx-5">
        <p className="flex min-w-16">
          <span>备注</span> <span className="mx-2">:</span>
        </p>
        <p>
          网页上传同样可用，打开链接即可从网页上传 :
          <a
            target="__blank"
            href={link ? link : "https://taupe-vacherin-31f51c.netlify.app/"}
            className="text-[#CD3EFF]"
          >
            {link ? link : "https://taupe-vacherin-31f51c.netlify.app/"}
          </a>
        </p>
      </div> */}
      {editPost ? (
        <Info status={editPost?.status} reason={editPost?.reason} />
      ) : (
        <></>
      )}
      <div className="mx-5 pb-5 pt-10 mt-5">
        <div className="flex gap-2 justify-center items-center pb-5">
          {agree ? (
            <button onClick={() => setAgree(!agree)}>
              <Selected />
            </button>
          ) : (
            <button onClick={() => setAgree(!agree)}>
              <Unselected />
            </button>
          )}
          <p className="text-[14px]">我已阅读并同意上传指南。</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={agree ? false : true}
          className={`text-[16px] font-semibold ${
            agree
              ? "bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white"
              : "bg-[#FFFFFF0A] text-[#444444]"
          }    w-full rounded-[16px] py-3`}
        >
          提交
        </button>
      </div>
    </div>
  );
};

export default UploadFrom;
