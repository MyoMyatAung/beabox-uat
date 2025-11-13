import React, { useEffect, useState } from "react";
// import header from "https://zm-cloud.oss-cn-beijing.aliyuncs.com/aisou/61a27f94f64bbd267317.png";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAdsNoticeQuery } from "@/store/api/explore/exploreApi";
import "../page/explore/explore.css";
import Notice from "./Notice";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import { useDispatch } from "react-redux";
import { setPlay } from "@/page/home/services/playSlice";
import ImageWithSkeleton from "./ImageWithLoader";

interface PopUpProps {
  setShowAd: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  isBrowser: boolean;
  onComplete?: () => void;
}

interface AppItem {
  id: string | number;
  image: string;
  title: string;
  url: string;
}

interface PopupImage {
  id: string | number;
  image: string;
  jump_url: string;
}

interface NoticeItem {
  id: string | number;
  title: string;
  content: string;
}

const PopUp: React.FC<PopUpProps> = ({
  setShowAd,
  setShowAlert,
  isBrowser,
  onComplete,
}) => {
  const [multiStart, setMultiStart] = useState<PopupImage[]>([]);
  const [ad, setAd] = useState<AppItem[]>([]);
  const [showStart, setShowStart] = useState(true);
  const [showAppContent, setShowAppContent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [showNotice, setShowNotice] = useState(false);
  const [NotList, setNotList] = useState<NoticeItem[]>([]);

  const { data: adsData } = useGetAdsPopUpQuery();
  const { data: notice } = useGetAdsNoticeQuery("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    if (adsData?.data?.popup_application) {
      setAd(adsData.data.popup_application.apps);
      setMultiStart(adsData.data?.index_popup || []);
    }
    if (notice?.data) {
      setNotList(notice?.data);
    }
  }, [notice, adsData]);

  const currentImage = multiStart[currentIndex];

  // Trigger animation on mount - delay slightly to ensure proper animation
  useEffect(() => {
    if (currentImage || showAppContent) {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentImage, showAppContent]);

  const handleStartClose = () => {
    setShowStart(false);
    setShowAppContent(true);
  };

  const handleAppClose = () => {
    if (!isBrowser) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
    setShowAppContent(false);
    setShowAd(false);

    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  const handleNoticeClose = () => {
    setShowNotice(false);
    setShowAd(false);

    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  const handleClose = () => {
    if (currentIndex < multiStart.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      handleStartClose();
    }
  };

  return (
    <AnimatePresence>
      {(currentImage || showAppContent) && (
        <motion.div
          key="popup-overlay"
          className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {/* Start Image */}
            {showStart && currentImage && isMounted && (
              <motion.div
                key={`start-image-${currentIndex}`}
                className="w-[330px] flex flex-col gap-0 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  className="flex justify-center items-center index_start_popup_img"
                  target="_blank"
                  href={currentImage.jump_url}
                >
                  <img
                    className="w-[260px] h-[390px] object-cover"
                    src={currentImage.image}
                    alt=""
                  />
                </a>
                <div
                  onClick={handleClose}
                  className="initial_popup_ad_box_close p-[9px] mt-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="23"
                    viewBox="0 0 24 23"
                    fill="none"
                  >
                    <path
                      d="M17.75 5.75L6.25 17.25"
                      stroke="white"
                      strokeWidth="1.49593"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.25 5.75L17.75 17.25"
                      stroke="white"
                      strokeWidth="1.49593"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* apps */}
            {!showStart && showAppContent && (
              <motion.div
                key="app-content"
                className="w-[330px] mb-20 flex flex-col gap-0 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://zm-cloud.oss-cn-beijing.aliyuncs.com/aisou/61a27f94f64bbd267317.png"
                  alt=""
                />
                <div className="initial_popup_ad_box w-full h-[325px] overflow-hidden p-2">
                  <div className="h-full overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-4 gap-2">
                      {ad?.map((app) => (
                        <a
                          key={app.id}
                          href={app.url}
                          target="_blank"
                          className="flex flex-col justify-center items-center"
                        >
                          <div className="w-full aspect-square">
                            <ImageWithSkeleton
                              src={app?.image}
                              alt="Ad"
                              className="w-full h-full object-cover rounded-lg border border-[#222]"
                              rounded={true}
                            />
                          </div>
                          <h1 className="text-white text-[14px] mt-1 truncate w-full text-center">
                            {app.title}
                          </h1>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  onClick={handleAppClose}
                  className="initial_popup_ad_box_close p-[9px] mt-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="23"
                    viewBox="0 0 24 23"
                    fill="none"
                  >
                    <path
                      d="M17.75 5.75L6.25 17.25"
                      stroke="white"
                      strokeWidth="1.49593"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.25 5.75L17.75 17.25"
                      stroke="white"
                      strokeWidth="1.49593"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Notice */}
            {!showStart && !showAppContent && showNotice && NotList && (
              <motion.div
                key="notice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Notice
                  handleNoticeClose={handleNoticeClose}
                  notice={NotList}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopUp;
