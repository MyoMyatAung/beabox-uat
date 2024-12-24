import { useEffect, useMemo, useRef, useState } from "react";
import { useGetConfigQuery, useGetPostsQuery } from "./services/homeApi";
import Player from "./components/Player";
import loader from "./vod_loader.gif";

import VideoSidebar from "./components/VideoSidebar";
import "./home.css";
import VideoFooter from "./components/VideoFooter";
import ShowHeart from "./components/ShowHeart";
import Top20Movies from "./components/Top20Movies";

const Home = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [currentActivePost, setCurrentActivePost] = useState<any>(null); // Active post ID
  const [showHeart, setShowHeart] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const { data: config } = useGetConfigQuery({});
  const { data, isLoading, isError } = useGetPostsQuery({ page });

  useEffect(() => {
    if (data?.data) {
      const videoData = data.data.filter(
        (item: any) => item.file_type === "video"
      );
      setVideos((prevVideos) => [...prevVideos, ...videoData]);
    }
  }, [data]);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the post ID of the currently visible video
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              setCurrentActivePost(postId);
            }
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 } // Trigger when 50% of the video is visible
    );

    // Observe all video elements
    Array.from(container.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  console.log(config);
  useEffect(() => {
    if (currentActivePost) {
      // Reset state when the active post changes
      setCountdown(3);
      setCountNumber(0);
      setShowHeart(false);
    }
  }, [currentActivePost]);

  // Pagination observer for loading more videos
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || !data?.data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.5 }
    );

    if (videos.length > 1) {
      const secondLastVideo = container.children[container.children.length - 3];
      if (secondLastVideo) observer.observe(secondLastVideo);
    }

    return () => {
      observer.disconnect();
    };
  }, [videos, data]);

  const currentPadding = useMemo(() => {
    console.log(currentActivePost);
    const currentVideo = videos.find(
      (video) => video.post_id == currentActivePost
    );
    console.log(currentVideo);
    return currentVideo?.related?.length > 0 ? "pb-[90px]" : "pb-[43px]";
  }, [videos, currentActivePost]);

  const handleRelated = (related: any) => {
    if (related[0]?.type === "top_post") {
      console.log("aa");
      setTopMovies(true);
    }
    console.log(related);
  };

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div className="text-white flex items-center gap-2">
          <span className="text-[28px] font-bold">
            <span className="text-[#FA408D] text-[36px]">Not</span> Found
          </span>
        </div>
      </div>
    );
  }

  if (isLoading && page === 1) {
    return (
      <div className="app bg-black">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="heart">
            <img src={loader} className="w-[100px] h-[100px]" />
          </div>
        </div>
      </div>
    );
  }

  if (topmovies) {
    return <Top20Movies setTopMovies={setTopMovies} />;
  }

  console.log(videos);
  return (
    <div className="app bg-black">
      <div ref={videoContainerRef} className={`app__videos ${currentPadding}`}>
        {videos.map((video, index) => (
          <div
            key={index}
            className="video mt-[20px]"
            data-post-id={video.post_id} // Add post ID to the container
          >
            <Player
              src={video.files[0].resourceURL}
              thumbnail={
                video.files[0].thumbnail ||
                "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
              }
            />
            <VideoSidebar
              likes={video?.like_count}
              is_liked={video?.is_liked}
              messages={video?.comment_count}
              post_id={video?.post_id}
              setCountNumber={setCountNumber}
              setCountdown={setCountdown}
              setShowHeart={setShowHeart}
              showHeart={showHeart}
              countdown={countdown}
              config={config?.data}
              image={video?.preview_image}
            />
            <VideoFooter
              tags={video?.tag}
              title={video?.title}
              username={video?.user?.name}
              city={video?.city}
            />
            {showHeart && <ShowHeart countNumber={countNumber} />}
            {video?.related.length > 0 && (
              <button
                onClick={() => handleRelated(video?.related)}
                className="flex items-center py-1 justify-between px-4 absolute bottom-[-10px] left-0 z-50 w-full bg-black"
              >
                <div className="flex items-center text-[15px] gap-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="18"
                      viewBox="0 0 17 18"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.5264 12.1723H4.46103C4.11296 12.1723 3.83046 11.8898 3.83046 11.5417C3.83046 11.1937 4.11296 10.9112 4.46103 10.9112H12.5264C12.8744 10.9112 13.1569 11.1937 13.1569 11.5417C13.1569 11.8898 12.8744 12.1723 12.5264 12.1723ZM15.4715 5.25963C14.5492 4.26586 13.373 4.2894 12.3364 4.3079C11.6865 4.31967 11.0719 4.33228 10.633 4.08174C10.0907 3.77318 9.90322 3.42343 9.68546 3.01735C9.44501 2.56838 9.17261 2.05973 8.4319 1.65953C7.06484 0.923034 5.45984 0.779266 3.3815 1.20805C1.32755 1.62842 0 3.44865 0 5.84479V10.9448C0 17.0587 3.52359 17.5321 8.5 17.5321C13.3158 17.5321 17 17.047 17 10.9221C17 9.42136 17 6.90918 15.4715 5.25963Z"
                        fill="url(#paint0_linear_2840_43)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2840_43"
                          x1="17"
                          y1="17.5321"
                          x2="0.44177"
                          y2="0.537826"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#CD3EFF" />
                          <stop offset="1" stop-color="#FFB2E0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="collect_text mt-[2px]">Collections</p>
                  <p className="collect_text_sec mt-[2px]">
                    {video?.related[0]?.type === "top_post" && "Top 20 Movies"}
                  </p>
                </div>
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="22"
                    viewBox="0 0 16 22"
                    fill="none"
                    className="mt-[10px]"
                  >
                    <g filter="url(#filter0_d_2840_37)">
                      <path
                        d="M5.27271 13L10.7273 7L5.27271 1"
                        stroke="white"
                        stroke-opacity="0.7"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        shape-rendering="crispEdges"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_2840_37"
                        x="0.272705"
                        y="0"
                        width="15.4546"
                        height="22"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_2840_37"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_2840_37"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {!data?.data?.length && (
        <p style={{ textAlign: "center" }}>
          <b>You have seen all videos</b>
        </p>
      )}
    </div>
  );
};

export default Home;
