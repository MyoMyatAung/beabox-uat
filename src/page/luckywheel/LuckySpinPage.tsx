import React, { useEffect, useRef, useState } from "react";
import "./LuckySpinPage.css";
import NotEnoughCouponPopup from "./NotEnoughCouponPopup";
import SpinResultPopup from "./SpinResultPopup";
import { Prize } from "./models";
import { GameHead } from "./GameHead";
import { LuckyWheel } from "@lucky-canvas/react";
import { useLockFn } from "ahooks";
import { WHEEL_SEGMENTS } from "./constants/wheelConfig";
import NotificationTransition from "./NotificationTransition";
import { useDispatch, useSelector } from "react-redux";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { useGetCurrentEventQuery } from "@/store/api/events/eventApi";
import {
  useGetPrizeListQuery,
  useSpinMutation,
  useGetProfileQuery,
  useGetEventDetailsQuery,
} from "./services/spinWheelApi";
import centerImg from '../../assets/center.png';
import bgImg from '../../assets/bg.webp';
import headImg from '../../assets/head.webp';
import wheelImg from '../../assets/Wheel.webp';
import couponImg from '../../assets/coupon.png';
import lockImg from '../../assets/lock.png';

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

// Create a new interface for virtual user reward
interface VirtualUserReward {
  nickname: string;
  amount: string;
  currency: string;
  text: string;
}

// Update the Event interface to include virtual_user_reward
interface Event {
  id: string;
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  virtual_user_reward?: VirtualUserReward[];
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
      } catch {
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
  const [spinChances, setSpinChances] = useState<number>(0);
  const [showNoCouponPopup, setShowNoCouponPopup] = useState<boolean>(false);
  const [showSpinResultPopup, setShowSpinResultPopup] = useState<boolean>(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupButtonText, setPopupButtonText] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wheelPrizes, setWheelPrizes] = useState<LuckyWheelSegment[]>([]);
  const [msg, setMsg] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: "",
  });
  const [decryptedImages, setDecryptedImages] = useState<{
    [key: string]: string;
  }>({});
  const user = useSelector((state: { persist: { user: { token: string } } }) => state.persist.user);
  const [currentEventId, setCurrentEventId] = useState<string>("");
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query hooks
  const { data: currentEventData } = useGetCurrentEventQuery('');
  const { data: prizeListData } = useGetPrizeListQuery();
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery();
  const [spin] = useSpinMutation();
  const { data: eventDetailsData } = useGetEventDetailsQuery(currentEventId, {
    skip: !currentEventId,
  });

  useEffect(()=>{
    console.log('eventDetails is=>', eventDetails);
  },[eventDetails])
  // Add effect to refetch profile when token changes
  useEffect(() => {
    if (user?.token) {
      refetchProfile();
    }
  }, [user?.token, refetchProfile]);

  const eventId = currentEventData?.data?.filter(
    (x: { type: string }) => x.type === "event"
  )[0]?.id;

  const smallWidthRatio = window.innerWidth < 400;
  const [blocks] = useState([{ padding: "0px", background: "#E51D17" }]);
  const [lockid, setLockid] = useState<boolean>(false);
  const [buttons] = useState([
    {
      radius: "40%",
      pointer: true,
      imgs: [
        {
          src: centerImg,
          top: -75,
          width: 150,
          height: 150,
        },
      ],
    },
  ]);

  const myLucky = useRef<{ play: () => void; stop: (index: number) => void } | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (profileData?.data) {
      setSpinChances(profileData.data.spin_wheel_chance);
    }
  }, [profileData]);

  useEffect(() => {
    if (currentEventData?.data) {
      const spinWheelEvent = currentEventData.data.filter(
        (x: { type: string }) => x.type === "spin-wheel"
      )[0];
      if (spinWheelEvent) {
        setCurrentEventId(spinWheelEvent.id);
      }
    }
  }, [currentEventData]);

  useEffect(() => {
    if (eventDetailsData?.data) {
      setEventDetails(eventDetailsData.data);
    }
  }, [eventDetailsData]);

  useEffect(() => {
    if (prizeListData?.data) {
      const formattedPrizes: LuckyWheelSegment[] = prizeListData.data.map(
        (prize: Prize, index: number) => {
          const segmentIndex = index % WHEEL_SEGMENTS.length;
          const backgroundColor = WHEEL_SEGMENTS[segmentIndex].color;
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
                height: "2.8rem",
                top: "50%",
              },
            ],
          };
        }
      );
      setWheelPrizes(formattedPrizes);
      decryptImages(formattedPrizes);
    }
  }, [prizeListData]);

  useEffect(() => {
    if (currentEventData && prizeListData) {
      setIsInitialLoading(false);
    }
  }, [currentEventData, prizeListData]);

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

  const handleEnd = () => {
    setSpinLoading(false);
    setLockid(false);

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

    if (!myLucky.current) {
      console.error('Lucky wheel reference is not available');
      return;
    }

    setLockid(true);
    setSpinLoading(true);
    setErrorMessage(null);
    setShowSpinResultPopup(false);
    setMsg({ show: false, msg: "" });

    try {
      const result = await spin().unwrap();

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
          myLucky.current.stop(0);
        }
        setSpinChances((prev) => prev - 1);
      } else {
        setErrorMessage(
          result.message || "Spin failed with no specific message."
        );
        setLockid(false);
        setSpinLoading(false);
      }
    } catch (error) {
      setLockid(false);
      setSpinLoading(false);
      console.error("Error during spin:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred during spin.");
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

  const handleRedirect = () => {
    navigate("/wallet/withdraw");
  };

  if (!eventId) return null;

  return (
    <div className="w-full max-w-[440px] min-h-dvh overflow-y-auto relative">
      <DecryptedImage
        alt=""
        src={bgImg}
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
              <DecryptedImage alt="" src={headImg} />
            </div>
            <div className="first-text">
              <NotificationTransition
                notifications={eventDetails?.virtual_user_reward || []}
              />
            </div>

            <div
              className={`relative w-full max-w-[540px] flex ${
                smallWidthRatio ? "mt-3" : "mt-3"
              } justify-center items-center`}
            >
              <DecryptedImage
                alt=""
                className={`${smallWidthRatio ? "w-[350px]" : "w-[400px]"}`}
                src={wheelImg}
              />
              <DecryptedImage
                className={`absolute ${
                  smallWidthRatio ? "top-[18px]" : "top-[22px]"
                } left-[45.5%] z-10`}
                src="/svgs/indicator.svg"
                alt=""
              />
              <div
                onClick={handleSpinStart}
                className="absolute z-[3] w-[150px] h-[150px] flex justify-center items-center"
              ></div>

              <div
                className={`absolute z-[2] flex flex-col justify-center items-center w-full -mt-[10px]`}
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

            <div className="flex justify-center items-center gap-2 bg-text-bottom mt-4">
              <span>每次抽奖消耗一张券</span>
              <span className="flex justify-center items-center">
                {spinChances} <DecryptedImage src={couponImg} alt="" />
              </span>
            </div>

            <div className="flex justify-center items-center pt-[0.8rem]">
              <button
                onClick={handleSpinStart}
                disabled={spinLoading || lockid}
                className={`h-[60px] ${(spinLoading || lockid || !user?.token) ? 'spin_button_disable' : 'spin_button'} flex justify-center items-center text-center text-[#583000] text-[20px] font-[600] leading-[22px]`}
              >
                {spinLoading ? "加载中.. " : "开始抽奖"}
                {!user?.token && (
                  <img src={lockImg} className="w-5" alt="lock" />
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
          onRedirect={handleRedirect}
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
