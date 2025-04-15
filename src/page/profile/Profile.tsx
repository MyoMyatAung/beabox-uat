import Stats from "@/components/profile/stats";
import defaultCover from "@/assets/cover.jpg";
import center from "@/assets/profile/center3.png";
import VideoTabs from "@/components/profile/video-tabs";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { UserPen, Bell, X, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingBtn from "@/components/profile/setting-btn";
import ProfileAvatar from "@/components/profile/profile-avatar";
import phoneImg from "@/assets/profile/phone-img.png";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/loader";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";
import EditCover from "@/components/profile/edit-cover";
import ScrollHeader from "@/components/profile/scroll-header";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import BadgeImg from "@/components/shared/badge-img";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

const Profile = () => {
  const headerRef = useRef(null);
  const [showHeader, setShowHeader] = useState(false);
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, isLoading, refetch } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data, "profiledata");
  const progressData = data?.data?.level_progress;
  // console.log(data, "data");
  const [show, setShow] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Reset scrolling
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup when component unmounts
    };
  }, [show]);

  // Scroll handler for header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        if (rect.top <= 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = (text: any) => {
    navigator?.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    if (user) refetch();
  }, []);
  useEffect(() => {
    if (user) refetch();
  }, [user, data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="h-screen flex flex-col hide-sb max-w-[480px] mx-auto">
      {/* <Covers /> */}

      {/* {
              user?.token
                ? 'bg-[url("./assets/cover.jpg")]' ||
                  'bg-[url("./assets/cover.jpg")]'
                : 'bg-[url("./assets/cover.jpg")]'
            }  */}
      {showHeader ? (
        <>
          <div className="gradient-overlay2"></div>
          <div
            className={`fixed top-0 w-full left-0 h-[155px] z-[1000] bg-cover bg-top bg-no-repeat`}
          >
            <AsyncDecryptedImage
              imageUrl={user?.token ? (data?.data?.cover_photo || "") : ""}
              defaultCover={defaultCover}
              className="fixed top-0 z-[1000] left-0 w-full h-[155px] object-cover object-center"
              alt="Cover"
            />
          </div>
        </>
      ) : (
        <>
          <div className="gradient-overlay"></div>
          <AsyncDecryptedImage
            imageUrl={user?.token ? (data?.data?.cover_photo || "") : ""}
            defaultCover={defaultCover}
            className="fixed top-0 left-0 w-full h-[23vh] object-cover object-center"
            alt="Cover"
          />
        </>
      )}
      {isCopied && (
        <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
        <p className="text-[14px] bg-[#191721] px-2 py-1 rounded-lg w-[83px] text-center">
          已复制 ID
        </p>
      </div>
      )}
      {show && (
        <div className="fixed top-0 z-[2300] left-0 w-full h-full mx-auto flex flex-col justify-center items-center bg-black/80">
          <div className="z-[1200] px-10">
            <div className="z-[1200] h-[250px] gradient-b rounded-lg relative">
              <img
                src={center || "/placeholder.svg"}
                className="absolute h-[250px] w-full"
                alt=""
              />
              <div className="z-[1200] w-full absolute -top-20 flex justify-center items-center">
                <img
                  src={phoneImg || "/placeholder.svg"}
                  className="w-[180px] z-[1200]"
                  alt=""
                />
              </div>
            </div>
            <div className="z-[1200] flex flex-col justify-center items-center gap-4 bg-[#161619] p-5 rounded-bl-lg rounded-br-lg">
              <h1 className="z-[1200] text-[18px] font-semibold text-white">
                创作者中心
              </h1>
              <p className="z-[1200] text-[14px] text-center text-[#FFFFFFCC]">
                查看创作者排名，洞察顶尖创作者的风采，观看最受欢迎视频，
                掌握流行趋势，发现精彩瞬间，探索全新内容。
              </p>
              <Button className="z-[1200] mt-2 mb-4 rounded-[16px] px-[26px] py-[12px] bg-[#FFFFFF14] hover:bg-[#FFFFFF14]">
                即将上线，敬请期待！
              </Button>
            </div>
          </div>
          <div
            onClick={() => setShow(false)}
            className="z-[1200] bg-[#FFFFFF29] p-2 rounded-full mt-5"
          >
            <X />
          </div>
        </div>
      )}
      <div className="flex-1">
        <div
          className={`px-5 ${
            showHeader ? "opacity-1" : "opacity-0"
          } fixed top-0 w-full z-[1600] py-5`}
        >
          <ScrollHeader
            photo={data?.data?.profile_photo || ""}
            name={data?.data?.nickname}
            login={user?.token}
            dphoto={data?.data?.cover_photo}
            setShow={setShow}
          />
        </div>
        <div className="z-[1900] flex my-5 justify-between items-center px-5">
          {user?.token ? (
            <EditCover
              coverimg={data?.data?.cover_photo}
              refetch={refetch}
            />
          ) : (
            <div></div>
          )}
          <div className="z-[1900] flex gap-3 items-center">
            <Link
              to={paths.noti}
              className="z-[1900] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Bell />
            </Link>
            <SettingBtn setShow={setShow} />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 pb-5 px-5">
          <ProfileAvatar
            progressData={data?.data?.level_progress}
            levelImage={data?.data?.level}
            photo={data?.data?.profile_photo}
          />
          {!user?.token ? (
            <div
              onClick={() => dispatch(setIsDrawerOpen(true))}
              className="z-[1900] flex items-center gap-2 flex-1"
            >
              <span className="z-[1200] text-[18px]">点击登录</span>
              <ChevronRight size={18} />
            </div>
          ) : (
            <div className="z-[1900] flex-1 flex flex-col gap-0.5">
              <p className="z-[1900] text-[18px] flex items-center gap-1">
                {data?.data?.nickname}
                <BadgeImg photo={data?.data?.badge} />
                <span>
                  {data?.data?.gender === "Male" ? <MaleSVG /> : null}
                </span>
                <span>
                  {data?.data?.gender === "Female" ? <FemaleSVG /> : null}
                </span>
              </p>
              <p className="z-[1900] text-[14px] text-[#BBBBBB] flex gap-1 items-center">
                B号 : {data?.data?.user_code}
                <Copy
                  onClick={() => handleCopy(data?.data?.user_code)}
                  size={14}
                />
              </p>
              {data?.data?.share_region === "on" ? (
                <div className="z-[1900] flex">
                  <div className="z-[1900] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                    {!data?.data?.city?.length &&
                    !data?.data?.province?.length ? (
                      <span>未知</span>
                    ) : (
                      <>
                        <span>{data?.data?.province}</span>:
                        <span>{data?.data?.city}</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="z-[1900] flex">
                  <div className="z-[1200] text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                    <span>未知</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <h1 className="text-[12px]  text-[#888] z-[1900] relative">
          {user?.token ? (
            <>
              {data?.data?.hide_bio?.length ? (
                <div className="text-[12px] xs:w-[100px] md:w-[340px] overflow-hidden break-words px-5  text-[#888] mb-5">
                  {data?.data?.bio}
                </div>
              ) : (
                <Link
                  to={paths.add_bio}
                  className="text-[12px] ml-5 text-[#FFFFFFCC] bg-[#FFFFFF14] px-2 py-1 w-[91px] text-center rounded-full"
                >
                  + 个人简介
                </Link>
              )}
            </>
          ) : (
            // <>
            //   {data?.data?.hide_bio === "on" ? (
            //     <div className="text-[12px] xs:w-[100px] md:w-[340px] overflow-hidden break-words px-5  text-[#888] mb-5">
            //       {data?.data?.bio}
            //     </div>
            //   ) : (
            //     <>
            //       {data?.data?.hide_bio?.length ? (
            //         <div className="text-[12px] xs:w-[100px] md:w-[340px] overflow-hidden break-words px-5  text-[#888] mb-5">
            //           {data?.data?.bio}
            //         </div>
            //       ) : (
            //         <Link
            //           to={paths.add_bio}
            //           className="text-[12px] ml-5 text-[#FFFFFFCC] bg-[#FFFFFF14] px-2 py-1 w-[91px] text-center rounded-full"
            //         >
            //           + 个人简介
            //         </Link>
            //       )}
            //     </>
            //   )}
            // </>
            <></>
          )}
        </h1>
        <div className={`${showHeader ? "opacity-0" : "opacity-1"}`}>
          <Stats
            followers={data?.data?.followers_count}
            followings={data?.data?.following_count}
            likes={data?.data?.likes_sum_count}
            nickname={data?.data?.nickname}
          />
        </div>
        <div
          className={`px-5 pt-3 z-[1900] relative ${
            showHeader ? "opacity-0" : "opacity-1"
          }`}
        >
          {user?.token ? (
            <Link to={paths.profileDetail}>
              <div className="w-full flex justify-center items-center gap-3 bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F] rounded-[12px] z-[1900] relative h-[51px]">
                <UserPen />
                <p className="text-[16px] mt-1">编辑资料</p>
              </div>
            </Link>
          ) : // <Link to={paths.profileDetail}>
          //   <button className="z-[1900] py-2 gap-2 w-full flex justify-center items-center bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F] relative rounded-[12px]">
          //     <UserPen /> <span className="text-[16px]">编辑资料</span>
          //   </button>
          // </Link>
          null}
        </div>
        <div ref={headerRef} className="sticky z-[1500] top-0"></div>
        <div className="">
          <VideoTabs />
        </div>
      </div>
    </div>
  );
};

export default Profile;
