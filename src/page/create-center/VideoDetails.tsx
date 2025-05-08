import Info from "@/components/create-center/info";
import Privacy from "@/components/create-center/privacy";
import TopNav from "@/components/create-center/top-nav";
import selected from "@/assets/createcenter/selected.png";
import unselected from "@/assets/createcenter/unselected.png";
import UploadVideo from "@/components/create-center/upload-video";
import DeleteDetail from "@/components/create-center/delete-detail";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Selected = () => (
  <img className="w-[18px] h-[18px]" src={selected} alt="" />
);
const Unselected = () => (
  <img className="w-[18px] h-[18px]" src={unselected} alt="" />
);

const VideoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [agree, setAgree] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="">
        <TopNav center={"Edit Video"} right={<DeleteDetail id={id} />} />
        <UploadVideo />
        <Privacy privacy={privacy} setPrivacy={setPrivacy} />
        <form className="px-5 py-5 flex flex-col gap-10">
          <div className="flex flex-col justify-start">
            <label htmlFor="" className="text-[14px]">
              Content Title
            </label>
            <input
              type="text"
              className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
              placeholder="Content title"
            />
            <p className="text-[10px] text-[#FFFFFF99] my-1">
              Enter a title. A good title can increase the video click-through
              rate.
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <label htmlFor="" className="text-[14px]">
              Hashtags
            </label>
            <input
              type="text"
              className="bg-transparent outline-none border border-t-0 border-x-0 py-2 border-b-[#FFFFFF99]"
              placeholder="Hashtags"
            />
          </div>
        </form>
        <div className="text-[14px] text-[#FFFFFF99] flex items-start mx-5">
          <p className="flex min-w-16">
            <span>备注</span> <span className="mx-2">:</span>
          </p>
          <p>
            Web upload is also available, open the link to upload from web :
            <span className="text-[#CD3EFF]">http://d.23abcd.me</span>
          </p>
        </div>
        <Info />
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
          <p className="text-[14px]">
            I have read and agree to the upload guidelines.
          </p>
        </div>
        <button className="text-[16px] font-semibold bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white w-full rounded-[16px] py-3">
          Save
        </button>
      </div>
    </div>
  );
};

export default VideoDetails;
