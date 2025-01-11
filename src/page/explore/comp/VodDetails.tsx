import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Player from "@/page/home/components/Player";
import "../../home/home.css";
import { ChevronLeft } from "lucide-react";
import search from "../../../assets/explore/search.svg";
import cmt from "../../../assets/explore/cmt.svg";
import VideoSidebar from "./VideoSidebar";
import {
  useCommentListMutation,
  useGetConfigQuery,
} from "@/page/home/services/homeApi";
import ShowHeart from "./ShowHeart";
import { usePostCommentExpMutation } from "@/store/api/explore/exploreApi";
import { useNavigate } from "react-router-dom";

interface VodDetailsProps {
  // setshow: (value: boolean) => void;
}

const VodDetails: React.FC<VodDetailsProps> = ({}) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
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
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getComments, { data: commentData }] = useCommentListMutation();

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
    setCommentsVisible(true);
    setIsLoading(true);
    try {
      const response = await getComments({ post_id: files.post_id });
      if (response && response.data) {
        setComments(response && ((response as any).data.data as any[]));
      }
    } catch (error) {
      console.error("Error fetching comment list:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };
  // console.log(files);
  return (
    <div className="  z-[99999] bg-black w-screen ">
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
          className="bg-[#77777760 bg-neutral-800 rounded-[100px] w-full flex justify-centr py-[8px] px-[15px] items-center gap-[12px]"
        >
          <img className="w-[22px] h-[22px]" src={search} alt="" />
          <span className="text-[14px] font-[400] text-white/40">
            {files.tag[0]}
          </span>
        </div>
      </div>

      {/* Video Player */}
      <div className="app__videos">
        <Player
          thumbnail={files.files[0].thumbnail}
          src={files.files[0].resourceURL}
        />
        <VideoSidebar
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          comments={comments}
          setComments={setComments}
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
          commentsVisible={commentsVisible}
          setCommentsVisible={setCommentsVisible}
        />
        {showHeart && <ShowHeart countNumber={countNumber} />}

        {/* Footer */}
        <div className="absolute w-screen bottom-[50px] z-[979191] flex flex-col text-white px-[10px]">
          <div className=" pr-[40px]">
            <span className="font-bold">{files.user.name}</span>
            <span>
              {showFullTitle ? (
                <>
                  {files.title}{" "}
                  <button
                    className="text-white/70 "
                    onClick={handleToggleTitle}
                  >
                    see less
                  </button>
                </>
              ) : (
                <>
                  {files.title.length > 80
                    ? `${files.title.slice(0, 80)}... `
                    : files.title}{" "}
                  {files.title.length > 80 && (
                    <button
                      className="text-white/70"
                      onClick={handleToggleTitle}
                    >
                      see more
                    </button>
                  )}
                </>
              )}
            </span>
          </div>
          <div
            onClick={handleCommentPost}
            className=" mb-[5px mt-[10px] bg-[#77777790 bg-neutral-800 flex gap-[10px] rounded-[12px] px-[20px] py-[6px]"
          >
            <div
              // value={content}
              // onChange={(e) => setContent(e.target.value)}
              className=" my-[10px h-[44px] w-full flex items-center text-[#777] text-[16px] font-[400] leading-[20px]"
              // type="text"
            >
              Write a comment
            </div>
            <button>
              <img src={cmt} alt="" />
            </button>
          </div>
        </div>
      </div>
      {/* cmt */}
    </div>
  );
};

export default VodDetails;
