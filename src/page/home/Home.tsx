import { useEffect, useState, useRef } from "react";
import Player from "./components/Player";
import loader from "./vod_loader.gif";
// import { convertToSecureUrl } from "../encryption";
// import VideoFooter from "../components/VideoFooter";
import VideoSidebar from "./components/VideoSidebar";
import "./home.css";

import VideoFooter from "./components/VideoFooter";
// import Footer from "../components/Footer";

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [errorMsg, seterrorMsg] = useState(false);

  let token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTA3LjE0OC40Ny45NDo4ODAwL2FwaS92MS9sb2dpbiIsImlhdCI6MTczNDY5OTgwNywiZXhwIjoxNzM1MzA0NjA3LCJuYmYiOjE3MzQ2OTk4MDcsImp0aSI6InpEQjM3SUkycU5waW5hb0oiLCJzdWIiOiI1MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xR_zLWUvsRsP-vmc1KzJ8QNgVf2Z21vcY1Kd7lZDo3g";

  // Fetch video data
  const fetchVideos = () => {
    seterrorMsg(false);
    if (page === 1) setLoading(true); // Show loading only for the first page

    fetch(
      `http://107.148.47.94:8800/api/v1/posts/list?pageSize=10&page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const videoData = data.data.filter(
          (item: any) => item.file_type === "video"
        );
        setVideos((prevVideos) => [...prevVideos, ...videoData]);
        setHasMore(data.data.page * data.data.pageSize < data.data.total);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.error("Error fetching video data:", error);
        seterrorMsg(true);
      })
      .finally(() => {
        seterrorMsg(false);
        if (page === 1) setLoading(false); // Hide loading only for the first page
      });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Observer for checking the second-to-last video
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchVideos();
          }
        });
      },
      { rootMargin: "100px", threshold: 0.5 }
    );

    // Observe the second-to-last video
    if (videos.length > 1) {
      const secondLastVideo = container.children[container.children.length - 3];
      if (secondLastVideo) observer.observe(secondLastVideo);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [videos, hasMore]);

  if (errorMsg) {
    return <div></div>;
  }

  return (
    <div className="app bg-black">
      {errorMsg ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="text-white flex items-center gap-2">
            <span className="text-[28px] font-bold">
              <span className="text-[#FA408D] text-[36px]">Not</span> Found
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-8 mt-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>
        </div>
      ) : loading ? ( // Show loading spinner only for the first API call
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="heart">
            <img src={loader} className="w-[150px] h-[150px]" />
          </div>
        </div>
      ) : (
        <>
          <div ref={videoContainerRef} className="app__videos">
            {videos.map((video, index) => (
              <div key={index} className="video mt-[20px]">
                <Player
                  src={video.files[0].resourceURL}
                  thumbnail={
                    video.files[0].thumbnail ||
                    "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                  }
                />
                {/* <VideoFooter channel={video?.user?.nickname} /> */}
                <VideoSidebar likes={2356} messages={239} />
                <VideoFooter
                  tags={video?.tag}
                  title={video?.title}
                  username={video?.user?.name}
                  city={video?.city}
                />
                <div className="flex items-center py-1 justify-between px-4 absolute bottom-[-10px] left-0 z-50 w-full bg-black">
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
                      Spider-man into the spider verse
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
                </div>
              </div>
            ))}
          </div>

          {!hasMore && (
            <p style={{ textAlign: "center" }}>
              <b>You have seen all videos</b>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
