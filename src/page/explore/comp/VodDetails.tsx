import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Player from "@/page/home/components/Player";
import "../../home/home.css";
import { ChevronLeft } from "lucide-react";
import search from "../../../assets/explore/search.svg";
import cmt from "../../../assets/explore/cmt.svg";
import VideoSidebar from "@/page/home/components/VideoSidebar";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import ShowHeart from "@/page/home/components/ShowHeart";
import { usePostCommentExpMutation } from "@/store/api/explore/exploreApi";
import { useNavigate } from "react-router-dom";

interface VodDetailsProps {
  // setshow: (value: boolean) => void;
}

const VodDetails: React.FC<VodDetailsProps> = ({  }) => {
  const [showHeart, setShowHeart] = useState(false);
  const { files } = useSelector((state: any) => state.explore);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [countdown, setCountdown] = useState(3);
  const { data: config } = useGetConfigQuery({});
  const [content, setContent] = useState<string>("");
  const [postComment] = usePostCommentExpMutation();
  const [showTip, setShowTip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleToggleTitle = () => {
    setShowFullTitle((prev) => !prev);
  };

  const handleCommentPost = async () => {
    // e.preventDefault()
    if (!content.trim()) return;
    console.log(content);

    try {
      const { data }: any = await postComment({
        post_id: files.post_id,
        content: content,
      }).unwrap();
      // console.log(data);
      if (data?.data) {
        setShowTip(true);
        setTimeout(() => {
          setShowTip(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
    setContent("");
  };

  return (
    <div className=" top-0 inset-0 z-[99999] bg-black w-screen overflow-hidden">
      {/* tip */}
      {showTip && (
        <div className="absolute top-[100px] z-[999991] w-screen flex justify-center">
          <div className="py-[8px] px-[12px] text-white text-[14px] font-[500] leading-[20px] tip_comment">
            Comment added
          </div>
        </div>
      )}
      {/* Header */}
      <div className="absolute top-0 z-[979191] flex gap-[6px] py-[30px] px-[20px] w-full">
        <button className="text-white" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <div
          onClick={() => navigate("/search_overlay")}
          className="bg-white/10 rounded-[100px] w-full flex justify-centr py-[8px] px-[15px] items-center gap-[12px]"
        >
          <img className="w-[22px] h-[22px]" src={search} alt="" />
          <span className="text-[14px] font-[400] text-white/40">
            {files.tag[0]}
          </span>
        </div>
      </div>

      {/* Video Player */}
      <div className="app__videos h-fit">
        <Player
          thumbnail={files.files[0].thumbnail}
          src={files.files[0].resourceURL}
        />
        <VideoSidebar
          likes={files?.like_count}
          is_liked={files?.is_liked}
          messages={files?.comment_count}
          post_id={files?.post_id}
          setCountNumber={setCountNumber}
          setCountdown={setCountdown}
          setShowHeart={setShowHeart}
          showHeart={showHeart}
          countdown={countdown}
          config={config?.data}
          image={files?.preview_image}
        />
        {showHeart && <ShowHeart countNumber={countNumber} />}

        {/* Footer */}
        <div className="absolute bottom-[50px] z-[979191] flex flex-col pl-[20px] pr-[40px] text-white">
          <span className="font-bold">{files.user.name}</span>
          <span>
            {showFullTitle ? (
              <>
                {files.title}{" "}
                <button className="text-white/70 " onClick={handleToggleTitle}>
                  see less
                </button>
              </>
            ) : (
              <>
                {files.title.length > 80
                  ? `${files.title.slice(0, 80)}... `
                  : files.title}{" "}
                {files.title.length > 80 && (
                  <button className="text-white/70" onClick={handleToggleTitle}>
                    see more
                  </button>
                )}
              </>
            )}
          </span>
        </div>
        <div className=" mx-[10px] mb-[20px] bg-white/20 flex gap-[10px] rounded-[12px] px-[20px] py-[6px]">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className=" my-[10px] w-full bg-transparent focus:outline-none"
            type="text"
          />
          <button onClick={handleCommentPost}>
            <img src={cmt} alt="" />
          </button>
        </div>
      </div>
      {/* cmt */}
    </div>
  );
};

export default VodDetails;
