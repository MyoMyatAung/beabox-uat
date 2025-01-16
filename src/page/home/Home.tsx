import { useEffect, useRef, useState } from "react";
import {
  useGetConfigQuery,
  useGetFollowedPostsQuery,
  useGetLatestPostsQuery,
  useGetPostsQuery,
} from "./services/homeApi";
import Player from "./components/Player";
import loader from "./vod_loader.gif";

import VideoSidebar from "./components/VideoSidebar";
import "./home.css";
import VideoFooter from "./components/VideoFooter";
import ShowHeart from "./components/ShowHeart";
import Top20Movies from "./components/Top20Movies";
import TopNavbar from "./components/TopNavbar";
import Explorer from "../explore/Explore";

import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "./services/homeSlice";

const Home = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [currentActivePost, setCurrentActivePost] = useState<any>(null); // Active post ID
  const [showHeart, setShowHeart] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const user = useSelector((state: any) => state.persist.user);
  const dispatch = useDispatch();
  // const [currentTab, setCurrentTab] = useState(2);
  const swiperRef = useRef<any>(null);

  const { data: config } = useGetConfigQuery({});

  // Fetch data based on the current tab
  const {
    data: followData,
    isFetching: isFollowFetching,
    refetch: followRefetch,
    isError: followError,
  } = useGetFollowedPostsQuery(
    {
      page,
    },
    { skip: currentTab !== 0 }
  );

  const {
    data: latestData,
    isFetching: isLatestFetching,
    refetch: latestRefetch,
    isError: latestError,
  } = useGetLatestPostsQuery(
    {
      page,
    },
    { skip: currentTab !== 1 }
  );

  const {
    data: forYouData,
    isFetching: isForYouFetching,
    refetch: forYouRefetch,
    isError: ForyouError,
  } = useGetPostsQuery(
    {
      page,
    },
    { skip: currentTab !== 2 }
  );

  console.log(forYouData, "followData");

  const isLoading =
    (currentTab === 0 && isFollowFetching) ||
    (currentTab === 1 && isLatestFetching) ||
    (currentTab === 2 && isForYouFetching);

  const isError = latestError || ForyouError || followError;

  useEffect(() => {
    // Populate videos based on the current tab and fetched data
    const currentData =
      currentTab === 0
        ? followData
        : currentTab === 1
        ? latestData
        : forYouData;

    if (currentData?.data) {
      if (page === 1) {
        setVideos(currentData.data);
      } else {
        setVideos((prev) => [...prev, ...currentData.data]);
      }
    }
  }, [followData, latestData, forYouData, currentTab]);

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
    if (!container) return;

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
  }, [videos]);

  // const currentPadding = useMemo(() => {
  //   console.log(currentActivePost);
  //   const currentVideo = videos.find(
  //     (video) => video.post_id == currentActivePost
  //   );
  //   console.log(currentVideo);
  //   return currentVideo?.related?.length > 0 ? "pb-[90px]" : "pb-[43px]";
  // }, [videos, currentActivePost]);

  // const handleRelated = (related: any) => {
  //   if (related[0]?.type === "top_post") {
  //     console.log("aa");
  //     setTopMovies(true);
  //   }
  //   console.log(related);
  // };

  if (topmovies) {
    return <Top20Movies setTopMovies={setTopMovies} />;
  }

  // const handleSlideChange = (swiper: any) => {
  //   const newTab = swiper.activeIndex; // Get the active slide index
  //   if (currentTab !== newTab) {
  //     dispatch(setCurrentTab(newTab));
  //     // setCurrentTab(newTab); // Update the current tab
  //     setPage(1);
  //     setVideos([]);
  //   }
  // };

  const handleTabClick = (tab: number) => {
    if (currentTab !== tab) {
      dispatch(setCurrentTab(tab));
      // setCurrentTab(tab); // Update the current tab
      setPage(1);
      setVideos([]);

      // Update the Swiper active index
      if (swiperRef.current) {
        swiperRef.current.slideTo(tab); // Change the Swiper index to match the clicked tab
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[1024px] home-main w-full">
        <TopNavbar currentTab={currentTab} onTabClick={handleTabClick} />
        {/*<Swiper
          initialSlide={currentTab} // Start from the third slide (index 2)
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={10}
        > */}
        <div className="app bg-black">
          {/* <SwiperSlide> */}
          {currentTab === 0 &&
            (isLoading && videos.length === 0 ? (
              <div className="app bg-black">
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div className="heart">
                    <img
                      src={loader}
                      className="w-[100px] h-[100px]"
                      alt="Loading"
                    />
                  </div>
                </div>
              </div>
            ) : !isError ? (
              <>
                <div
                  ref={videoContainerRef}
                  className={`app__videos pb-[74px] `}
                >
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="video mt-[20px]"
                      data-post-id={video.post_id} // Add post ID to the container
                    >
                      <Player
                        src={video.files[0].resourceURL}
                        thumbnail={
                          video?.preview_image ||
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
                        countNumber={countNumber}
                        showHeart={showHeart}
                        countdown={countdown}
                        config={config?.data}
                        image={video?.preview_image}
                        post={video}
                      />
                      <VideoFooter
                        tags={video?.tag}
                        title={video?.title}
                        username={video?.user?.name}
                        city={video?.city}
                      />
                      {showHeart && (
                        <ShowHeart
                          countNumber={countNumber}
                          username={user?.nickname}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {(!followData?.data?.length ||
                  !latestData?.data?.length ||
                  !forYouData?.data?.length) && (
                  <p style={{ textAlign: "center" }}>
                    <b>You have seen all videos</b>
                  </p>
                )}
              </>
            ) : (
              <div className="app bg-black">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div className="text-white flex flex-col justify-center items-center  gap-2">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="none"
                      >
                        <path
                          d="M24.4993 28.7502C24.4993 25.9212 23.3755 23.2081 21.3752 21.2077C19.3748 19.2073 16.6617 18.0835 13.8327 18.0835C11.0037 18.0835 8.2906 19.2073 6.29021 21.2077C4.28982 23.2081 3.16602 25.9212 3.16602 28.7502"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M13.8327 18.0833C17.5146 18.0833 20.4993 15.0986 20.4993 11.4167C20.4993 7.73477 17.5146 4.75 13.8327 4.75C10.1508 4.75 7.16602 7.73477 7.16602 11.4167C7.16602 15.0986 10.1508 18.0833 13.8327 18.0833Z"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M29.8337 27.4164C29.8337 22.9231 27.1671 18.7498 24.5004 16.7498C25.3769 16.0921 26.0779 15.2286 26.5411 14.2355C27.0044 13.2424 27.2157 12.1504 27.1564 11.0562C27.0971 9.96195 26.7689 8.89922 26.201 7.96204C25.6331 7.02486 24.8429 6.24212 23.9004 5.68311"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="follow-error">
                      Follow the creator you love
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* </SwiperSlide> */}
          {/* <SwiperSlide> */}
          {currentTab == 1 && (
            <div className="w-screen">
              <Explorer />
            </div>
          )}
          {/* </SwiperSlide>
          <SwiperSlide> */}
          {currentTab == 2 &&
            (isLoading && videos.length === 0 ? (
              <div className="app bg-black">
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div className="heart">
                    <img
                      src={loader}
                      className="w-[100px] h-[100px]"
                      alt="Loading"
                    />
                  </div>
                </div>
              </div>
            ) : !isError ? (
              <>
                <div
                  ref={videoContainerRef}
                  className={`app__videos pb-[74px]`}
                >
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="video mt-[20px]"
                      data-post-id={video.post_id} // Add post ID to the container
                    >
                      <Player
                        src={video.files[0].resourceURL}
                        thumbnail={
                          video?.preview_image ||
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
                        countNumber={countNumber}
                        showHeart={showHeart}
                        countdown={countdown}
                        config={config?.data}
                        image={video?.preview_image}
                        post={video}
                      />
                      <VideoFooter
                        tags={video?.tag}
                        title={video?.title}
                        username={video?.user?.name}
                        city={video?.city}
                      />
                      {showHeart && (
                        <ShowHeart
                          countNumber={countNumber}
                          username={user?.nickname}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {(!followData?.data?.length ||
                  !latestData?.data?.length ||
                  !forYouData?.data?.length) && (
                  <p style={{ textAlign: "center" }}>
                    <b>You have seen all videos</b>
                  </p>
                )}
              </>
            ) : (
              <div className="app bg-black">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div className="text-white flex flex-col justify-center items-center  gap-2">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="none"
                      >
                        <path
                          d="M24.4993 28.7502C24.4993 25.9212 23.3755 23.2081 21.3752 21.2077C19.3748 19.2073 16.6617 18.0835 13.8327 18.0835C11.0037 18.0835 8.2906 19.2073 6.29021 21.2077C4.28982 23.2081 3.16602 25.9212 3.16602 28.7502"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M13.8327 18.0833C17.5146 18.0833 20.4993 15.0986 20.4993 11.4167C20.4993 7.73477 17.5146 4.75 13.8327 4.75C10.1508 4.75 7.16602 7.73477 7.16602 11.4167C7.16602 15.0986 10.1508 18.0833 13.8327 18.0833Z"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M29.8337 27.4164C29.8337 22.9231 27.1671 18.7498 24.5004 16.7498C25.3769 16.0921 26.0779 15.2286 26.5411 14.2355C27.0044 13.2424 27.2157 12.1504 27.1564 11.0562C27.0971 9.96195 26.7689 8.89922 26.201 7.96204C25.6331 7.02486 24.8429 6.24212 23.9004 5.68311"
                          stroke="#888888"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="follow-error">Videos Error</div>
                  </div>
                </div>
              </div>
            ))}
          {/* </SwiperSlide> */}
        </div>
        {/* </Swiper> */}
      </div>
    </div>
  );
};

export default Home;

{
  /* {video?.related.length > 0 && (
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
                            {video?.related[0]?.type === "top_post" &&
                              "Top 20 Movies"}
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
                    )} */
}
