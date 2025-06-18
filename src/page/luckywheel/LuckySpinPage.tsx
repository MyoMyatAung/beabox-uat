import React, { useEffect, useRef, useState } from "react";
import "./LuckySpinPage.css";
import SpinWheelService from "./services/spinWheelService";
import NotEnoughCouponPopup from "./NotEnoughCouponPopup";
import SpinResultPopup from "./SpinResultPopup";
import { Prize, Profile } from "./models";

import { GameHead } from "./GameHead";
import { LuckyWheel } from "@lucky-canvas/react";
import { useLockFn } from "ahooks";
import { WHEEL_SEGMENTS } from "./constants/wheelConfig"; // Re-importing original wheel config for base styling
import NotificationTransition from "./NotificationTransition";
import { a } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { useDispatch, useSelector } from "react-redux";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { useGetCurrentEventQuery } from "@/store/api/events/eventApi";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
// import { WheelSegment } from "../types"; // Removed explicit import

// Define a local interface for LuckyWheel segments to explicitly include 'color'
interface LuckyWheelSegment {
  name: string;
  background: string;
  fonts: {
    text: string;
    top: string;
    fontSize: string;
    fontColor: string;
    fontWeight: string;
  }[];
  imgs: { src: string; width: string; height: string; top: string }[];
}

// Add decryptImage function
const decryptImage = async (
  imageUrl: string,
  defaultCover = ""
): Promise<string> => {
  if (!imageUrl || imageUrl.trim() === "") {
    return defaultCover || "";
  }

  if (!imageUrl.endsWith(".txt")) {
    return imageUrl;
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const encryptedData = await response.arrayBuffer();

    const decryptedData = new Uint8Array(encryptedData);
    const key = 0x12;
    const maxSize = Math.min(4096, decryptedData.length);

    for (let i = 0; i < maxSize; i++) {
      decryptedData[i] ^= key;
    }

    const decryptedStr = new TextDecoder().decode(decryptedData);

    if (decryptedStr.startsWith("data:")) {
      try {
        const matches = decryptedStr.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid data URL format");
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
      } catch (err) {
        return decryptedStr;
      }
    }

    return decryptedStr;
  } catch (error) {
    console.error("Error decrypting image:", error);
    return defaultCover || imageUrl;
  }
};

// Add DecryptedImage component
const DecryptedImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt = "", className = "", style = {} }) => {
  const [decryptedSrc, setDecryptedSrc] = useState<string>(src);

  useEffect(() => {
    const decryptSrc = async () => {
      if (src.endsWith(".txt")) {
        const decrypted = await decryptImage(src);
        setDecryptedSrc(decrypted);
      }
    };
    decryptSrc();
  }, [src]);

  return (
    <img src={decryptedSrc} alt={alt} className={className} style={style} />
  );
};

const LuckySpinPage: React.FC = () => {
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinService, setSpinService] = useState<SpinWheelService | null>(null);
  const [spinChances, setSpinChances] = useState<number>(0);
  const [showNoCouponPopup, setShowNoCouponPopup] = useState<boolean>(false);
  const [showSpinResultPopup, setShowSpinResultPopup] =
    useState<boolean>(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupButtonText, setPopupButtonText] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wheelPrizes, setWheelPrizes] = useState<LuckyWheelSegment[]>([]); // Use LuckyWheelSegment type
  const [msg, setMsg] = useState<any>({
    show: false,
    msg: "",
  });
  const [decryptedImages, setDecryptedImages] = useState<{
    [key: string]: string;
  }>({});
  const user = useSelector((state: any) => state.persist.user);
  // const [accessToken, setAccessToken] = useState<string>("");
  const [currentEventId, setCurrentEventId] = useState<string>("");
  const [eventDetails, setEventDetails] = useState<any>(null);
  const dispatch = useDispatch();

  const { data: currentEventData } = useGetCurrentEventQuery("");
  const eventId = currentEventData?.data?.filter(
    (x: any) => x.type === "event"
  )[0]?.id;
  if (!eventId) return;

  const smallWidthRatio = window.innerWidth < 400;
  const [blocks] = useState([{ padding: "0px", background: "#E51D17" }]);
  //const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);
  // LuckyWheel prizes will be set dynamically from API, using consistent styling
  // const [prizes] = useState( ... ); // Removed hardcoded prizes

  const [lockid, setLockid] = useState<boolean>(false); //防抖
  const [prizeItem, setPrizeItem] = useState<any>(); //中奖物品 (will be replaced by currentPrize)
  const navigate = useNavigate();
  const [buttons] = useState([
    {
      radius: "40%",
      pointer: true,
      imgs: [
        {
          src: "/images/center.png",
          top: -75,
          width: 150,
          height: 150,
        },
      ],
    },
  ]);

  const myLucky = useRef<any>("");

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // useEffect(() => {
  //   // Get token from localStorage

  //   // Listen for token from Android
  //   const handleAndroidToken = (event: CustomEvent) => {
  //     const token = event.detail.token;
  //     setAccessToken(token);
  //   };

  //   window.addEventListener(
  //     "androidTokenReceived",
  //     handleAndroidToken as EventListener
  //   );

  //   // Still listen for new tokens
  //   bridge.addEventListener(MessageType.ACCESS_TOKEN, (data) => {
  //     if (data.access_token) {
  //       setAccessToken(data.access_token);
  //     } else {
  //       localStorage.removeItem("access_token");
  //     }
  //   });
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     setAccessToken(token);
  //   }

  //   const handleError = (error: ErrorEvent) => {
  //     console.error("Page error:", error);
  //     setErrorMessage(error?.message);
  //   };

  //   const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  //     console.error("Unhandled promise rejection:", event.reason);
  //     setErrorMessage(event?.reason?.message || String(event?.reason || ""));
  //   };

  //   window.addEventListener("error", handleError);
  //   window.addEventListener("unhandledrejection", handleUnhandledRejection);

  //   return () => {
  //     // clearTimeout(loadTimeout);
  //     window.removeEventListener("error", handleError);
  //     window.removeEventListener(
  //       "unhandledrejection",
  //       handleUnhandledRejection
  //     );
  //     window.removeEventListener(
  //       "androidTokenReceived",
  //       handleAndroidToken as EventListener
  //     );
  //   };
  // }, []);

  // Initialize service when token is available

  useEffect(() => {
    if (user?.token) {
      const service = new SpinWheelService(user?.token);
      setSpinService(service);
      console.log("hello start");
      Promise.all([
        fetchProfile(service),
        fetchPrizes(service),
        fetchCurrentEvent(service),
      ]).finally(() => {
        console.log("hello finally");
        setIsInitialLoading(false);
      });
    } else {
      const service = new SpinWheelService("");
      setSpinService(service);
      Promise.all([
        // fetchProfile(service),
        fetchPrizes(service),
        fetchCurrentEvent(service),
      ]).finally(() => {
        console.log("hello finally");
        setIsInitialLoading(false);
      });
    }
  }, [user?.token]);

  const fetchCurrentEvent = async (service: SpinWheelService) => {
    try {
      const response = await service.getCurrentEvent();
      if (response.status && response.data) {
        const spinWheelEvent = response.data.filter(
          (x: any) => x.type === "spin-wheel"
        )[0];
        if (spinWheelEvent) {
          setCurrentEventId(spinWheelEvent.id);
          // Fetch event details
          const eventDetailsResponse = await service.getEventDetails(
            spinWheelEvent.id
          );
          if (eventDetailsResponse.status && eventDetailsResponse.data) {
            setEventDetails(eventDetailsResponse.data);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching current event:", error);
      setErrorMessage(error?.message || "Failed to fetch current event.");
    }
  };

  const fetchProfile = async (service: SpinWheelService) => {
    try {
      const response = await service.getProfile();
      if (response.status && response.data) {
        setSpinChances(response.data.spin_wheel_chance);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setErrorMessage(error?.message || "Failed to fetch profile.");
    }
  };

  // Add function to decrypt images
  const decryptImages = async (prizes: LuckyWheelSegment[]) => {
    const decryptedUrls: { [key: string]: string } = {};

    for (const prize of prizes) {
      if (prize.imgs && prize.imgs.length > 0) {
        const originalUrl = prize.imgs[0].src;

        if (originalUrl.endsWith(".txt")) {
          const decryptedUrl = await decryptImage(originalUrl);
          decryptedUrls[originalUrl] = decryptedUrl;
        } else {
          decryptedUrls[originalUrl] = originalUrl;
        }
      }
    }
    setDecryptedImages(decryptedUrls);
  };

  const fetchPrizes = async (service: SpinWheelService) => {
    try {
      const response = await service.getPrizeList();
      if (response.status && response.data) {
        const formattedPrizes: LuckyWheelSegment[] = response.data.map(
          (prize, index) => {
            const segmentIndex = index % WHEEL_SEGMENTS.length;
            const backgroundColor = WHEEL_SEGMENTS[segmentIndex].color;
            // Ensure the image URL is properly formatted
            const imageUrl = prize.image.startsWith("http")
              ? prize.image
              : `${prize.image}`;

            return {
              name: prize.name,
              background: backgroundColor,
              fonts: [
                {
                  text: prize.name,
                  top: "15%",
                  fontSize: "1rem",
                  fontColor: "#FF0000",
                  fontWeight: "800",
                },
              ],
              imgs: [
                {
                  src: imageUrl,
                  width: "2.8rem",
                  // height: "auto",
                  top: "50%",
                },
              ],
            };
          }
        );

        // const testFormattedPrices = [
        //   {
        //     name: "10元",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "10元",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/d8/d8b66cebe683bfb05603eecc5f0bcefc.txt",
        //         width: "26px",
        //         height: "26px",
        //         top: "45%",
        //       },
        //     ],
        //   },
        //   {
        //     name: "苹果 16 Pro Max",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "苹果 16 Pro Max",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/79/7983f063ccd9beb5b57776a9acf397eb.txt",
        //         width: "54px",
        //         height: "54px",
        //         top: "55%",
        //       },
        //     ],
        //   },
        //   {
        //     name: "200元",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "200元",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/d8/d8b66cebe683bfb05603eecc5f0bcefc.txt",
        //         width: "26px",
        //         height: "26px",
        //         top: "45%",
        //       },
        //     ],
        //   },
        //   {
        //     name: "5元",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "5元",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/d8/d8b66cebe683bfb05603eecc5f0bcefc.txt",
        //         width: "26px",
        //         height: "26px",
        //         top: "45%",
        //       },
        //     ],
        //   },
        //   {
        //     name: "电话费",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "电话费",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/da/dabb3a998fc633199b2ca17618b8876b.txt",
        //         width: "26px",
        //         height: "26px",
        //         top: "45%",
        //       },
        //     ],
        //   },
        //   {
        //     name: "100元",
        //     background: "#FFF7DF",
        //     fonts: [
        //       {
        //         text: "100元",
        //         top: "15%",
        //         fontSize: "1rem",
        //         fontColor: "#FF0000",
        //         fontWeight: "bold",
        //       },
        //     ],
        //     imgs: [
        //       {
        //         src: "https://da6de1g7g5kvm.cloudfront.net/resources/d8/d8b66cebe683bfb05603eecc5f0bcefc.txt",
        //         width: "26px",
        //         height: "26px",
        //         top: "45%",
        //       },
        //     ],
        //   },
        // ];
        setWheelPrizes(formattedPrizes);
        await decryptImages(formattedPrizes);
      }
    } catch (error: any) {
      console.error("Error fetching prizes:", error);
      setErrorMessage(error.message || "Failed to fetch prize list.");
    }
  };

  const handleEnd = () => {
    setSpinLoading(false);
    setLockid(false);

    // Show popup after wheel stops spinning
    if (currentPrize) {
      switch (currentPrize.type) {
        case "appreciation":
          setPopupTitle("谢谢参与");
          setPopupButtonText("我知道了");
          setShowSpinResultPopup(true);
          break;
        case "cash_payment":
          setPopupTitle("恭喜发财");
          setPopupButtonText("开心收下");
          setShowSpinResultPopup(true);
          break;
        case "reward":
          setPopupTitle("恭喜发财");
          setPopupButtonText("领取优惠券");
          setShowSpinResultPopup(true);
          break;
        default:
          setMsg({
            show: true,
            msg: `Spin Result: ${
              currentPrize.name || popupMessage || "Unknown prize type."
            }`,
          });
      }
    }
  };

  const handleSpinStart = useLockFn(async () => {
    if (!user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }

    if (spinChances <= 0) {
      setShowNoCouponPopup(true);
      return;
    }

    if (!spinService) return;

    setLockid(true);
    setPrizeItem(undefined); // Clear old prize item
    setSpinLoading(true);
    setErrorMessage(null); // Clear previous errors
    setShowSpinResultPopup(false); // Hide any previous spin result popups
    setMsg({ show: false, msg: "" }); // Clear any previous general messages

    try {
      const result = await spinService.spin();

      if (result.status && result.data) {
        setCurrentPrize(result.data);
        setPopupMessage(result.message);

        const wonPrizeIndex = wheelPrizes.findIndex(
          (p) => p.name === result.data.name
        );
        if (wonPrizeIndex !== -1) {
          myLucky.current.play();
          myLucky.current.stop(wonPrizeIndex);
        } else {
          myLucky.current.play();
          myLucky.current.stop(0); // Fallback to first prize if not found in dynamic list
        }
        setSpinChances((prev) => prev - 1); // Decrement spin chance on successful spin
      } else {
        setErrorMessage(
          result.message || "Spin failed with no specific message."
        );
        setLockid(false);
        setSpinLoading(false);
      }
    } catch (e: any) {
      setLockid(false);
      setSpinLoading(false);
      console.error("Error during spin:", e);
      setErrorMessage(e.message || "An unexpected error occurred during spin.");
    }
  });

  const handleNoCouponPopupClose = () => {
    setShowNoCouponPopup(false);
  };

  const handleInviteFriend = () => {
    navigate(`/events/lucky-draw/${eventId}`);
    setShowNoCouponPopup(false);
  };

  const handleSpinResultPopupClose = () => {
    setShowSpinResultPopup(false);
    setCurrentPrize(null);
  };

  const hanldeRedirect = () => {
    navigate("/wallet/withdraw");
  };

  return (
    <div className="w-full max-w-[440px]  min-h-dvh overflow-y-auto relative">
      <DecryptedImage
        alt=""
        src="/images/bg.webp"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="relative flex flex-col">
        <GameHead />

        {errorMessage && (
          <div
            className="error-message"
            style={{ color: "white", textAlign: "center", marginTop: "10px" }}
          >
            {errorMessage}
          </div>
        )}

        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-1 pb-8">
            <div className="p-4 relative flex justify-center">
              <DecryptedImage alt="" src="/images/head.webp" />
            </div>
            <div className="first-text">
              <NotificationTransition
                notifications={eventDetails.virtual_user_reward}
              />
            </div>

            <div
              className={`relative w-full max-w-[540px]  flex ${
                smallWidthRatio ? "mt-3" : "mt-3"
              } justify-center items-center`}
            >
              <DecryptedImage
                alt=""
                className={`${smallWidthRatio ? "w-[350px]" : "w-[400px]"}`}
                src="images/Wheel.webp"
              />
              <DecryptedImage
                className={`absolute ${
                  smallWidthRatio ? "top-[18px]" : "top-[22px]"
                }  left-[45.5%] z-10`}
                src="/svgs/indicator.svg"
                alt=""
              />
              <div
                onClick={handleSpinStart}
                className="absolute z-[3] w-[150px] h-[150px] flex justify-center items-center"
              ></div>

              <div
                className={`absolute z-[2] flex flex-col justify-center items-center w-full  -mt-[10px]`}
              >
                <LuckyWheel
                  ref={myLucky}
                  width={smallWidthRatio ? 310 : 355}
                  height={smallWidthRatio ? 310 : 355}
                  defaultConfig={{ gutter: 6 }}
                  blocks={blocks}
                  prizes={wheelPrizes.map((prize) => ({
                    ...prize,
                    imgs: prize.imgs.map((img) => ({
                      ...img,
                      src: decryptedImages[img.src] || img.src,
                    })),
                  }))}
                  buttons={buttons.map((button) => ({
                    ...button,
                    imgs: button.imgs.map((img) => ({
                      ...img,
                      src: decryptedImages[img.src] || img.src,
                    })),
                  }))}
                  onStart={() => {}}
                  onEnd={handleEnd}
                />
              </div>
            </div>

            <div className=" flex justify-center items-center gap-2  bg-text-bottom mt-4">
              <span className=" ">每次抽奖消耗一张券</span>
              <span className=" flex justify-center items-center">
                {spinChances} <DecryptedImage src="/images/coupon.png" alt="" />
              </span>
            </div>

            <div className="flex justify-center items-center pt-[0.8rem]">
              <button
                onClick={handleSpinStart}
                disabled={spinLoading || lockid}
                className="h-[60px] spin_button flex justify-center items-center text-center text-[#583000] text-[20px] font-[600] leading-[22px]"
              >
                {spinLoading ? "加载中.. " : "开始抽奖"}
                {!user?.token && (
                  <img src="/images/lock.png" className="w-5" alt="lock" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {showNoCouponPopup && (
        <NotEnoughCouponPopup
          onCancel={handleNoCouponPopupClose}
          onInviteFriend={handleInviteFriend}
        />
      )}
      {showSpinResultPopup && currentPrize && (
        <SpinResultPopup
          show={showSpinResultPopup}
          currentPrize={currentPrize}
          popupTitle={popupTitle}
          popupButtonText={popupButtonText}
          popupMessage={popupMessage}
          onClose={handleSpinResultPopupClose}
          onRedirect={hanldeRedirect}
        />
      )}
      {msg.show && (
        <div
          className="spin-result-overlay"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            className="spin-result"
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3>Spin Result</h3>
            <p
              className="prize-name"
              style={{ fontSize: "1.1em", color: "#555" }}
            >
              {msg.msg}
            </p>
            <button
              onClick={() => setMsg({ show: false, msg: "" })}
              style={{
                background: "linear-gradient(to right, #ff6b6b, #ee0979)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "12px 30px",
                fontSize: "1.1em",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckySpinPage;
