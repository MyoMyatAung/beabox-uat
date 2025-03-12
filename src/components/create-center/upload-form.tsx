import React, { useState } from "react";
import toast from "react-hot-toast";
import Privacy from "./privacy";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import Tags from "@/page/create-center/Tags";
import { X } from "lucide-react";
const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const UploadFrom = ({ onFormSubmit, uploading, editPost, loading }: any) => {
  const [agree, setAgree] = useState(false);

  const [privacy, setPrivacy] = useState(editPost?.privacy || "public");
  const [contentTitle, setContentTitle] = useState(editPost?.title || "");
  const [hashtags, setHashtags] = useState(editPost?.tag || []);
  const [newHashtag, setNewHashtag] = useState("");
  const [agreeToGuidelines, setAgreeToGuidelines] = useState(false);

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
    console.log("testing");
    console.log(privacy, contentTitle, setContentTitle, setHashtags, hashtags);

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
            Content Title
          </label>
          <input
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            type="text"
            className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
            placeholder="Please enter the title"
          />
          <p className="text-[10px] text-[#FFFFFF99] my-1">
            Enter a title. A good title can increase the video click-through
            rate.
          </p>
        </div>

        <div className="flex flex-col justify-start relative">
          <label htmlFor="" className="text-[14px]">
            Hashtags
          </label>
          <div className="flex items-center w-full jsutify-start bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {hashtags.map((tag: any, index: any) => (
                <div key={index} className="text-[12px] bg-[#FFFFFF14] px-2 py-0.5 rounded-full">
                  # {tag}
                </div>
              ))}
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
          {/* <input
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            type="text"
            className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
            placeholder="Add Hashtags (Maximum 5)"
          />
          <Tags
            hashtags={hashtags}
            removeTag={removeTag}
            newHashtag={newHashtag}
            setNewHashtag={setNewHashtag}
            addHashtag={addHashtag}
          /> */}
        </div>
      </div>

      <div className="text-[14px] text-[#FFFFFF99] flex items-start mx-5">
        <p className="flex">
          <span>Note</span> <span className="mx-2">:</span>
        </p>
        <p>
          Web upload is also available, open the link to upload from web :
          <span className="text-[#CD3EFF]">http://d.23abcd.me</span>
        </p>
      </div>
      <div className="mx-5 pb-5 pt-10">
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
          <p className="text-[12px]">
            I have read and agree to the upload guidelines.
          </p>
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
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadFrom;
