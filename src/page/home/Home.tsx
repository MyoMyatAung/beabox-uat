import { useEffect, memo, useRef, useState } from "react";
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
import { setCurrentActivePost } from "./services/activeSlice";
import { setVideos } from "./services/videosSlice";
import { setPage } from "./services/pageSlice";

const Home = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  // const [videos, setVideos] = useState<any[]>([]);
  //const [page, setPage] = useState(1);
  const { currentActivePost } = useSelector((state: any) => state.activeslice);
  const { videos } = useSelector((state: any) => state.videoSlice);
  const { page } = useSelector((state: any) => state.pageSlice);

  //const [currentActivePost, setCurrentActivePost] = useState<any>(null); // Active post ID
  const [showHeart, setShowHeart] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countNumber, setCountNumber] = useState(0); // New state for counting clicks
  const [topmovies, setTopMovies] = useState(false);
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const user = useSelector((state: any) => state.persist.user);

  const [rotateVideoId, setRotateVideoId] = useState<string | null>(null); // For controlling fullscreen per video
  const dispatch = useDispatch();

  // const [currentTab, setCurrentTab] = useState(2);
  const swiperRef = useRef<any>(null);
  const [mute, setMute] = useState(true);

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

  console.log(videos);

  const isLoading =
    (currentTab === 0 && isFollowFetching) ||
    (currentTab === 1 && isLatestFetching) ||
    (currentTab === 2 && isForYouFetching);

  const isError = latestError || ForyouError || followError;

  console.log(page);

  // useEffect(() => {
  //   // Populate videos based on the current tab and fetched data
  //   const currentData =
  //     currentTab === 0
  //       ? followData
  //       : currentTab === 1
  //       ? latestData
  //       : forYouData;

  //   console.log("win");

  //   if (currentData?.data) {
  //     // Filter out posts with duplicate `post_id`
  //     const filteredData = currentData.data.filter(
  //       (newPost: any) =>
  //         !videos.some((video: any) => video.post_id === newPost.post_id)
  //     );

  //     if (filteredData.length > 0) {
  //       if (page === 1) {
  //         console.log("ha1");
  //         dispatch(setVideos(filteredData)); // Set the filtered videos if page is 1
  //       } else {
  //         console.log("ha2");
  //         dispatch(setVideos([...videos, ...filteredData])); // Append filtered videos otherwise
  //       }
  //     } else {
  //       console.log("No new videos to add");
  //     }
  //   }
  // }, [followData, forYouData, latestData, currentTab, videos]);

  useEffect(() => {
    // Determine which data corresponds to the current tab
    const currentData =
      currentTab === 0 ? followData : currentTab === 2 ? forYouData : null; // Add other tabs if necessary

    console.log("win");

    if (currentData?.data) {
      // Determine the key in the videos object based on the current tab
      const videoKey =
        currentTab === 0 ? "follow" : currentTab === 2 ? "foryou" : "";

      // Filter out posts with duplicate `post_id`
      const filteredData = currentData.data.filter(
        (newPost: any) =>
          !videos[videoKey]?.some(
            (video: any) => video.post_id === newPost.post_id
          )
      );

      if (filteredData.length > 0) {
        if (page === 1) {
          console.log("ha1");
          // Replace videos for the current tab
          dispatch(
            setVideos({
              ...videos,
              [videoKey]: filteredData, // Update only the current tab
            })
          );
        } else {
          console.log("ha2");
          // Append filtered videos for the current tab
          dispatch(
            setVideos({
              ...videos,
              [videoKey]: [...videos[videoKey], ...filteredData], // Append to the current tab
            })
          );
        }
      } else {
        console.log("No new videos to add");
      }
    }
  }, [followData, forYouData, currentTab, videos, page]);

  // useEffect(() => {
  //   // Populate videos based on the current tab and fetched data
  //   const currentData =
  //     currentTab === 0
  //       ? followData
  //       : currentTab === 1
  //       ? latestData
  //       : forYouData;

  //   console.log("win");

  //   if (currentData?.data) {
  //     if (page === 1) {
  //       console.log("ha1");
  //       dispatch(setVideos(currentData.data));

  //       // setVideos(currentData.data);
  //     } else {
  //       console.log("ha2");
  //       dispatch(setVideos([...videos, ...currentData.data]));

  //       // dispatch(setVideos((prev: any) => [...prev, ...currentData.data]));
  //       //setVideos((prev: any) => [...prev, ...currentData.data]);
  //     }
  //   }
  // }, [followData, forYouData, latestData, currentTab]);

  // Scroll to the first current post when the component is mounted
  useEffect(() => {
    const container = videoContainerRef.current;
    if (container && currentActivePost) {
      const activeElement = container.querySelector(
        `[data-post-id="${currentActivePost}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" });
      }
    }
  }, []);

  useEffect(() => {
    const container = videoContainerRef.current;
    console.log("active");
    console.log(videos);
    if (
      !container ||
      videos[currentTab === 2 ? "foryou" : "follow"].length === 0
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the post ID of the currently visible video
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              dispatch(setCurrentActivePost(postId));
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
  }, [videos[currentTab === 2 ? "foryou" : "follow"]]);

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
            // dispatch(setPage((prevPage: any) => prevPage + 1));
            dispatch(setPage(page + 1));
            // setPage((prevPage) => prevPage + 1);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.5 }
    );

    if (videos[currentTab === 2 ? "foryou" : "follow"].length > 1) {
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
      dispatch(setCurrentActivePost(null));
      // setCurrentTab(tab); // Update the current tab
      dispatch(setPage(1));
      // dispatch(setVideos([]));

      //setVideos([]);

      // // Update the Swiper active index
      // if (swiperRef.current) {
      //   swiperRef.current.slideTo(tab); // Change the Swiper index to match the clicked tab
      // }
    }
  };

  const handleFullscreen = (postId: string) => {
    if (rotateVideoId === postId) {
      // If the clicked video is already in fullscreen, exit fullscreen
      setRotateVideoId(null);
    } else {
      // Otherwise, set the clicked video to fullscreen
      setRotateVideoId(postId);
    }
  };

  console.log(currentActivePost);

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
            (isLoading && videos["follow"]?.length === 0 ? (
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
                  {videos["follow"]?.map((video: any, index: any) => (
                    <div
                      key={index}
                      className="video mt-[20px]"
                      data-post-id={video.post_id} // Add post ID to the container
                    >
                      <Player
                        rotate={rotateVideoId === video.post_id}
                        src={video.files[0].resourceURL}
                        thumbnail={
                          video?.preview_image ||
                          "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                        }
                        mute={mute}
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
                        setMute={setMute}
                        mute={mute}
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
                      {/* {+video.files[0].width > +video.files[0].height ? (
                        <>
                          <button
                            onClick={() => handleFullscreen(video.post_id)}
                            className={`absolute ${
                              rotateVideoId === video.post_id
                                ? " top-[10px] right-[10px] w-[40px] bg-transparent"
                                : "left-[37%] top-[70%] bottom-0 right-0 w-[120px] bg-[#101010]"
                            }   h-[35px] rounded-md flex justify-center items-center z-[9999] text-center  text-white `}
                          >
                            {rotateVideoId === video.post_id ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="10"
                                  viewBox="0 0 14 10"
                                  fill="none"
                                >
                                  <path
                                    d="M13.4595 8.9178C13.5429 8.81955 13.6091 8.70284 13.6543 8.57434C13.6994 8.44584 13.7227 8.30808 13.7227 8.16896C13.7227 8.02983 13.6994 7.89208 13.6543 7.76358C13.6091 7.63508 13.5429 7.51836 13.4595 7.42011L7.50487 0.388566C7.43858 0.310125 7.35984 0.247892 7.27315 0.205431C7.18647 0.16297 7.09354 0.141113 6.99969 0.141113C6.90585 0.141113 6.81292 0.16297 6.72623 0.205431C6.63955 0.247892 6.56081 0.310125 6.49452 0.388566L0.539875 7.42011C0.188759 7.83473 0.188759 8.50319 0.539875 8.9178C0.89099 9.33242 1.45708 9.33242 1.80819 8.9178L7.00328 2.79164L12.1984 8.92626C12.5423 9.33242 13.1156 9.33242 13.4595 8.9178Z"
                                    fill="white"
                                  />
                                </svg>
                              </>
                            ) : (
                              <div className=" flex items-center p-1 gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="13"
                                  viewBox="0 0 14 13"
                                  fill="none"
                                >
                                  <path
                                    d="M11.9279 4.03607L10.664 2.68779C10.6123 2.63272 10.5969 2.55002 10.6249 2.47798C10.6528 2.40611 10.7186 2.35917 10.7916 2.35917L11.3304 2.35917C11.2894 1.07625 10.8481 0.573193 10.8434 0.568154L10.8434 0.567974C10.7879 0.507124 10.7764 0.414495 10.815 0.340101C10.8537 0.265707 10.9335 0.227068 11.0113 0.245124C11.0284 0.249096 12.6563 0.655005 12.7714 2.35915L13.3195 2.35915C13.3925 2.35915 13.4583 2.4061 13.4863 2.47796C13.5142 2.55001 13.4988 2.63271 13.4471 2.68778L12.1832 4.03606C12.1493 4.07217 12.1035 4.09257 12.0556 4.09257C12.0077 4.09257 11.9618 4.07218 11.9279 4.03607Z"
                                    fill="white"
                                  />
                                  <rect
                                    x="0.9"
                                    y="0.640723"
                                    width="7.38519"
                                    height="11.7185"
                                    rx="1.6"
                                    stroke="white"
                                    stroke-width="0.8"
                                  />
                                  <path
                                    d="M9.16667 6.01855L11.5 6.01855C12.6046 6.01855 13.5 6.91399 13.5 8.01855L13.5 10.2778C13.5 11.3824 12.6046 12.2778 11.5 12.2778L9.16667 12.2778"
                                    stroke="white"
                                    stroke-width="0.8"
                                  />
                                </svg>
                                <span>全屏</span>
                              </div>
                            )}
                          </button>
                        </>
                      ) : (
                        <></>
                      )} */}
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
                    <div className="follow-error">关注您喜欢的作者</div>
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
            (isLoading && videos["foryou"]?.length === 0 ? (
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
                  {videos["foryou"]?.map((video: any, index: any) => (
                    <div
                      key={index}
                      className="video mt-[20px]"
                      data-post-id={video.post_id} // Add post ID to the container
                    >
                      <Player
                        rotate={rotateVideoId === video.post_id}
                        src={video.files[0].resourceURL}
                        thumbnail={
                          video?.preview_image ||
                          "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                        }
                        mute={mute}
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
                        setMute={setMute}
                        mute={mute}
                      />
                      <VideoFooter
                        tags={video?.tag}
                        title={video?.title}
                        username={video?.user?.name}
                        city={video?.city}
                      />
                      {/* {+video.files[0].width > +video.files[0].height ? (
                        <>
                          <button
                            onClick={() => handleFullscreen(video.post_id)}
                            className={`absolute ${
                              rotateVideoId === video.post_id
                                ? " top-[10px] right-[10px] w-[40px] bg-transparent"
                                : "left-[37%] top-[70%] bottom-0 right-0 w-[120px] bg-[#101010]"
                            }   h-[35px] rounded-md flex justify-center items-center z-[9999] text-center  text-white `}
                          >
                            {rotateVideoId === video.post_id ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="10"
                                  viewBox="0 0 14 10"
                                  fill="none"
                                >
                                  <path
                                    d="M13.4595 8.9178C13.5429 8.81955 13.6091 8.70284 13.6543 8.57434C13.6994 8.44584 13.7227 8.30808 13.7227 8.16896C13.7227 8.02983 13.6994 7.89208 13.6543 7.76358C13.6091 7.63508 13.5429 7.51836 13.4595 7.42011L7.50487 0.388566C7.43858 0.310125 7.35984 0.247892 7.27315 0.205431C7.18647 0.16297 7.09354 0.141113 6.99969 0.141113C6.90585 0.141113 6.81292 0.16297 6.72623 0.205431C6.63955 0.247892 6.56081 0.310125 6.49452 0.388566L0.539875 7.42011C0.188759 7.83473 0.188759 8.50319 0.539875 8.9178C0.89099 9.33242 1.45708 9.33242 1.80819 8.9178L7.00328 2.79164L12.1984 8.92626C12.5423 9.33242 13.1156 9.33242 13.4595 8.9178Z"
                                    fill="white"
                                  />
                                </svg>
                              </>
                            ) : (
                              <div className=" flex items-center p-1 gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="13"
                                  viewBox="0 0 14 13"
                                  fill="none"
                                >
                                  <path
                                    d="M11.9279 4.03607L10.664 2.68779C10.6123 2.63272 10.5969 2.55002 10.6249 2.47798C10.6528 2.40611 10.7186 2.35917 10.7916 2.35917L11.3304 2.35917C11.2894 1.07625 10.8481 0.573193 10.8434 0.568154L10.8434 0.567974C10.7879 0.507124 10.7764 0.414495 10.815 0.340101C10.8537 0.265707 10.9335 0.227068 11.0113 0.245124C11.0284 0.249096 12.6563 0.655005 12.7714 2.35915L13.3195 2.35915C13.3925 2.35915 13.4583 2.4061 13.4863 2.47796C13.5142 2.55001 13.4988 2.63271 13.4471 2.68778L12.1832 4.03606C12.1493 4.07217 12.1035 4.09257 12.0556 4.09257C12.0077 4.09257 11.9618 4.07218 11.9279 4.03607Z"
                                    fill="white"
                                  />
                                  <rect
                                    x="0.9"
                                    y="0.640723"
                                    width="7.38519"
                                    height="11.7185"
                                    rx="1.6"
                                    stroke="white"
                                    stroke-width="0.8"
                                  />
                                  <path
                                    d="M9.16667 6.01855L11.5 6.01855C12.6046 6.01855 13.5 6.91399 13.5 8.01855L13.5 10.2778C13.5 11.3824 12.6046 12.2778 11.5 12.2778L9.16667 12.2778"
                                    stroke="white"
                                    stroke-width="0.8"
                                  />
                                </svg>
                                <span>全屏</span>
                              </div>
                            )}
                          </button>
                        </>
                      ) : (
                        <></>
                      )} */}

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

export default memo(Home);

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
