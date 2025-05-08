import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetUserProfileQuery,
} from "@/store/api/profileApi";
import { useGetUserShareQuery } from "@/page/home/services/homeApi";
import { ChevronLeft, Copy, Flag } from "lucide-react";
import ProfileAvatar from "@/components/profile/profile-avatar";
import Loader from "@/components/shared/loader";
import OtherStats from "@/components/profile/other-stats";
import VideoTab2 from "@/components/profile/video-tab2";
import FollowStatusBtn from "@/components/profile/follow-status-btn";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";
import defaultCover from "@/assets/cover.jpg";
import { useEffect, useRef, useState } from "react";
import OscrollHeader from "@/components/profile/oscroll-header";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import share from "@/assets/profile/share.svg";
import BadgeImg from "@/components/shared/badge-img";
import SearchVideo from "@/components/profile/video/search-video";
import OtherAds from "@/components/profile/other-ads";
import logo from "@/assets/logo.svg";

const decryptImage = (arrayBuffer: ArrayBuffer, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};

// Define a type for the window.webkit object
interface WebKitBridge {
  postMessage: (data: { eventName: string; value: string }) => void;
}

interface WebKitMessageHandlers {
  jsBridge?: WebKitBridge;
}

interface WebKit {
  messageHandlers?: WebKitMessageHandlers;
}

interface CustomWindow extends Window {
  webkit?: WebKit;
}

const OtherProfile = () => {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state?.persist?.user) || "";

  const [isCopied, setIsCopied] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [showHeader, setShowHeader] = useState(false);
  // console.log(user)
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
  } = useGetUserProfileQuery(id || "");
  // console.log(userData)
  const code = userData?.data?.user_code ? userData?.data?.user_code : ""
  console.log(code)
  const { data: shareData } = useGetUserShareQuery(
    {
      type: "profile",
      id: code,
      qr_code: 0,
    },
    { skip: !id }
  );
  // console.log(shareData, "share data");
  const [decryptedCover, setDecryptedCover] = useState(defaultCover);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const [cachedDownloadLink, setCachedDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    if (shareData?.data?.link) {
      setCachedDownloadLink(shareData?.data?.content);
    }
  }, [shareData,code]);

  useEffect(() => {
    const loadAndDecryptCover = async () => {
      if (!userData?.data?.cover_photo) {
        setDecryptedCover(defaultCover);
        return;
      }

      try {
        const coverUrl = userData.data.cover_photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!coverUrl.endsWith(".txt")) {
          setDecryptedCover(coverUrl);
          return;
        }

        // Fetch the encrypted image data
        const response = await fetch(coverUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode the entire file as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted cover image source
        setDecryptedCover(decryptedStr);
      } catch (error) {
        console.error("Error loading cover photo:", error);
        setDecryptedCover(defaultCover);
      }
    };

    loadAndDecryptCover();
  }, [userData?.data?.cover_photo]);

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!userData?.data?.profile_photo) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = userData.data.profile_photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted profile photo source
        setDecryptedPhoto(decryptedStr);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [userData?.data?.profile_photo]);

  const handleCopy = async (text: string) => {
    // await shareInfo({ id });
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
  
  const isIOSApp = () => {
    const customWindow = window as unknown as CustomWindow;
    return (
      customWindow.webkit &&
      customWindow.webkit.messageHandlers &&
      customWindow.webkit.messageHandlers.jsBridge
    );
  };
  
  const sendEventToNative = (name: string, text: string) => {
    const customWindow = window as unknown as CustomWindow;
    if (
      customWindow.webkit &&
      customWindow.webkit.messageHandlers &&
      customWindow.webkit.messageHandlers.jsBridge
    ) {
      customWindow.webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };
  
  const handleCopy2 = async () => {
    // If we already have a cached link, use it
    if (cachedDownloadLink) {
      copyToClipboard(cachedDownloadLink);
      return;
    }

    // If we have share data but no cached link yet
    if (shareData?.data?.link) {
      setCachedDownloadLink(shareData.data.content);
      copyToClipboard(shareData.data.content);
      return;
    }

    // Fallback to a default link if no share data is available
    const defaultLink = window.location.href;
    copyToClipboard(defaultLink);
  };

  const copyToClipboard = (link: string) => {
    if (isIOSApp()) {
      sendEventToNative("copyAppdownloadUrl", link);
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setIsCopied2(true);
          setTimeout(() => setIsCopied2(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // console.log(rect);

        if (rect.top <= 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);

  // useEffect(() => {
  //   if (id || userData) {
  //     refetch();
  //   }
  // }, [id, userData]);
  useEffect(() => {
    if (user?.token) refetch();
  }, [user?.token]);

  // console.log(userData, "user data");

  // Handle loading state
  if (userLoading) return <Loader />;

  // Handle case where userData is undefined after loading
  if (!userData?.data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>User not found or content is unavailable.</p>
        <button 
          className="mt-4 bg-[#FFFFFF1F] px-4 py-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col hide-sb max-w-[480px] mx-auto">
      {showHeader ? (
        <>
          <div className="gradient-overlay2"></div>
          <div
            style={{
              backgroundImage: `url('${
                decryptedCover ? decryptedCover : "./assets/cover.jpg"
              }')`,
            }}
            className={`fixed top-0 w-full left-0 h-[155px] z-[1000] bg-cover bg-top bg-no-repeat`}
          ></div>
          {/* <img
            src={decryptedCover ? decryptedCover : defaultCover}
            alt=""
            className={`fixed top-0 z-[1500] left-0 w-full h-[155px] object-cover object-center`}
          /> */}
        </>
      ) : (
        <>
          <div className="gradient-overlay"></div>
          <img
            src={decryptedCover ? decryptedCover : defaultCover}
            alt=""
            className="fixed top-0 left-0 w-full h-[23vh] object-cover object-center"
          />
        </>
      )}
      {isCopied ? (
        <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
          <p className="text-[14px] bg-[#191721] px-2 py-1 rounded-lg w-[83px] text-center">
            已复制 ID
          </p>
        </div>
      ) : (
        ""
      )}
      {isCopied2 ? (
        <div className="fixed w-full h-screen bg-[#000000CC]  z-[3000] top-0 left-0">
          <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
            <div className="text-[14px] bg-[#191721] px-2 py-1 rounded-lg w-[103px] flex items-center gap-2 text-center">
              <img src={logo} className="w-5" alt="" />
              <span>复制成功</span>
            </div>
          </div>
          {/* 1 */}
        </div>
      ) : (
        ""
      )}
      <div className="flex-1">
        <div
          className={`px-5 fixed ${
            showHeader ? "opacity-1" : "opacity-0"
          } top-0 w-full z-[1600] py-5`}
        >
          <OscrollHeader
            userData={userData}
            handleCopy2={handleCopy2}
            photo={decryptedPhoto}
            name={userData?.data?.nickname}
            visibility={userData?.data?.content_visibility}
            id={id}
            dphoto={userData?.data?.cover_photo}
          />
        </div>
        <div className="z-[1900] relative px-5 w-full flex gap-3 my-5 justify-between items-center">
          <ChevronLeft onClick={() => navigate(-1)} />
          <div className="flex gap-3 z-[1500] items-center">
            <SearchVideo id={userData?.data?.id} />

            <Link
              to={`/reports/profile/${id}`}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <Flag size={18} />
            </Link>
            <div
              onClick={() => handleCopy2()}
              className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full"
            >
              <img src={share} alt="" />
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-3 pb-5 px-5">
          <ProfileAvatar
            progressData={userData?.data?.level_progress}
            levelImage={userData?.data?.level}
            photo={decryptedPhoto}
          />
          <div className="z-[1900] flex-1 flex flex-col gap-0.5">
            <p className="z-[1900] text-[18px] flex items-center gap-1">
              {userData?.data?.nickname}
              <BadgeImg photo={userData?.data?.badge} />

              <span>
                {userData?.data?.gender == "Male" ? <MaleSVG /> : <></>}
              </span>
              <span>
                {userData?.data?.gender == "Female" ? <FemaleSVG /> : <></>}
              </span>
            </p>
            <p className="z-[1900] text-[14px] text-[#BBBBBB] flex items-center gap-2">
              B号 : {userData?.data?.user_code}{" "}
              <Copy
                onClick={() => handleCopy(userData?.data?.user_code)}
                size={14}
              />
            </p>
            {userData?.data?.city &&
            userData?.data?.province &&
            userData?.data?.share_region == "on" ? (
              <div className="z-[1900] flex">
                <div className="z-[1900] text-[14px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                  <span>{userData?.data?.province}</span>:
                  <span>{userData?.data?.city}</span>
                </div>
              </div>
            ) : (
              <div className="z-[1900] flex">
                <div className="z-[1900] text-[14px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 py-1 rounded-full justify-center shrink-0">
                  <span>未知</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <h1 className="text-[14px]  text-[#888] mb-5 px-5 z-[1900] relative xs:w-[100px] md:w-[340px] overflow-hidden break-words">
          {userData?.data?.bio ? userData?.data?.bio : ""}
        </h1>
        <div className={`${showHeader ? "opacity-0" : "opacity-1"}`}>
          <OtherStats
            followers={userData?.data?.followers_count}
            followings={userData?.data?.following_count}
            likes={userData?.data?.likes_sum_count}
            id={userData?.data?.id}
            nickname={userData?.data?.nickname}
          />
        </div>
        {user && user.id === id ? (
          <></>
        ) : (
          <div
            className={`px-5 z-[1900] relative ${
              showHeader ? "opacity-0" : "opacity-1"
            }`}
          >
            <FollowStatusBtn
              userData={userData}
              id={id}
              refetch={refetch}
              userLoading={userLoading}
            />
          </div>
        )}
        <div
          className={`px-5 relative z-[1900] ${
            showHeader ? "opacity-0" : "opacity-1"
          }`}
        >
          <OtherAds />
        </div>
        <div ref={headerRef} className="sticky z-[1500] top-0">
          {/* {showHeader ? "Show" : "Hide"} */}
        </div>

        <div className="">
          <VideoTab2
            id={id}
            showHeader={false}
            visibility={userData?.data?.content_visibility}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;
