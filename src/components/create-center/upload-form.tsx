import React, { useState } from "react";
import toast from "react-hot-toast";
import Privacy from "./privacy";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
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
    if (!contentTitle) {
      toast.error("Please enter a content title.", {
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }

    if (!agreeToGuidelines) {
      toast.error("Please agree to the upload guidelines.", {
        style: {
          background: "#25212a",
          color: "white",
        },
      });
      return;
    }
    console.log(privacy, contentTitle, setContentTitle, setHashtags, hashtags);
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
          <input
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            type="text"
            className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
            placeholder="Add Hashtags (Maximum 5)"
          />
          <Link
            to={paths.tags}
            className="right-0 top-5 px-2 absolute bg-[#F0C3FF66] border-[1px] border-[#F0C3FF] py-1 rounded-full text-[12px] text-[#F0C3FF]"
          >
            Select Tag
          </Link>
        </div>
      </div>
      <button
        onClick={addHashtag}
        className="cursor-pointer  text-[#CD3EFF] text-[14px]"
      >
        Add
      </button>
      <div className="mt-2 flex flex-wrap gap-2">
        {hashtags.map((tag: any, index: any) => (
          <div
            key={index}
            className="flex justify-center tag gap-1 px-2 py-1 rounded-md mr-1"
          >
            {tag}
            <span
              className="cross cursor-pointer"
              onClick={() => removeTag(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="9"
                viewBox="0 0 10 9"
                fill="none"
              >
                <path
                  d="M5.00009 3.59108L8.18205 0.409119L9.091 1.31807L5.90904 4.50003L9.091 7.68199L8.18205 8.59094L5.00009 5.40898L1.81813 8.59094L0.90918 7.68199L4.09114 4.50003L0.90918 1.31807L1.81813 0.409119L5.00009 3.59108Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
        ))}
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
      <div className="mx-5 py-5">
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
          type="submit"
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
    // <div>
    //   <div className="mt-6">
    //     <div className="py-5">
    //       <Privacy privacy={privacy} setPrivacy={setPrivacy} />
    //     </div>

    //     <div className="mb-6">
    //       <label className="block input_title mb-2">Content Title</label>
    //       <textarea
    //         type="text"
    //         className="custom-input"
    //         placeholder="Enter content title"
    //         value={contentTitle}
    //         onChange={(e: any) => setContentTitle(e.target.value)}
    //         rows={4}
    //       />
    //     </div>

    //     <div className="mb-6">
    //       <label className="block input_title mb-2">Add Hashtags</label>
    //       <div className="flex relative">
    //         <input
    //           className="custom-input"
    //           placeholder="Enter Your Tag (Maximum 5 Tags)"
    //           value={newHashtag}
    //           onChange={(e: any) => setNewHashtag(e.target.value)}
    //           //   onPressEnter={addHashtag}
    //           style={{
    //             padding: "10px",
    //           }}
    //         />
    //         <div className="absolute right-5 top-[10px] border-l-[1px] border-[#67656c] pl-5 ">
    //           <button
    //             onClick={addHashtag}
    //             className="cursor-pointer  text-[#CD3EFF] text-[14px]"
    //           >
    //             Add
    //           </button>
    //         </div>
    //       </div>
    //       <div className="mt-2 flex flex-wrap gap-2">
    //         {hashtags.map((tag: any, index: any) => (
    //           <div
    //             key={index}
    //             className="flex justify-center tag gap-1 px-2 py-1 rounded-md mr-1"
    //           >
    //             {tag}
    //             <span
    //               className="cross cursor-pointer"
    //               onClick={() => removeTag(index)}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="10"
    //                 height="9"
    //                 viewBox="0 0 10 9"
    //                 fill="none"
    //               >
    //                 <path
    //                   d="M5.00009 3.59108L8.18205 0.409119L9.091 1.31807L5.90904 4.50003L9.091 7.68199L8.18205 8.59094L5.00009 5.40898L1.81813 8.59094L0.90918 7.68199L4.09114 4.50003L0.90918 1.31807L1.81813 0.409119L5.00009 3.59108Z"
    //                   fill="white"
    //                 />
    //               </svg>
    //             </span>
    //           </div>
    //         ))}
    //       </div>
    //     </div>

    //     <div className="mb-6 flex justify-between items-center">
    //       <label className="flex items-center space-x-2 cursor-pointer text-gray-400">
    //         {/* Custom Radio Button */}
    //         <div
    //           className={`w-[14px] h-[14px] rounded-full border-[1px] ${
    //             agreeToGuidelines
    //               ? "border-[#868489] bg-[#CD3EFF]"
    //               : "border-[#868489]"
    //           } flex items-center justify-center`}
    //           onClick={() => setAgreeToGuidelines(!agreeToGuidelines)}
    //         ></div>

    //         {/* Text Label */}
    //         <span className="check_text">
    //           I have read and agree to the upload guidelines.
    //         </span>
    //       </label>
    //       <button
    //         onClick={handleSubmit}
    //         className="mt-6 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md text-white"
    //         disabled={uploading || loading}
    //       >
    //         {uploading || loading ? "Saving..." : "Save"}
    //       </button>
    //     </div>

    //     {/* Upload Button */}
    //   </div>
    // </div>
  );
};

export default UploadFrom;
