import React, { useEffect, useState, useRef } from "react";
import "../page/explore/explore.css";
import logo from "../assets/alertlogo.jpeg";
import closeIcon from "../assets/close.png";
import { useDispatch } from "react-redux";
import { setPlay } from "@/page/home/services/playSlice";

const imageToBlob = (url: string, callback: (blobUrl: string) => void) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      callback(blobUrl);
    })
    .catch((error) => console.error("Error: ", error));
};

// Function to detect if the app is being used as a web clip
const isWebClip = (): boolean => {
  return 'standalone' in window.navigator && window.navigator.standalone === true;
};

interface AlertRedirectProps {
  setShowAlert: (show: boolean) => void;
  app_download_link: string;
}

const AlertRedirect: React.FC<AlertRedirectProps> = ({ setShowAlert, app_download_link }) => {
  // State to track the platform and show/hide the alert section for Android
  // const [isAndroid, setIsAndroid] = useState(false);
  // const [isVisible, setIsVisible] = useState(false); // Track visibility

  const dispatch = useDispatch();

  // Ref for alert container
  const alertRef = useRef(null);

  const [logoBlobUrl, setLogoBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    imageToBlob(logo, (blobUrl) => setLogoBlobUrl(blobUrl));
    
    // Cleanup function to revoke blob URL when component unmounts
    return () => {
      if (logoBlobUrl) {
        URL.revokeObjectURL(logoBlobUrl);
      }
    };
  }, []);

  // Check if the user is on Android or iOS
  // useEffect(() => {
  //   if (navigator.userAgent.includes("Android")) {
  //     setIsAndroid(true);
  //   }
  // }, []);

  // const handleOutsideClick = (e: MouseEvent) => {
  //   if (alertRef.current && !alertRef.current?.contains(e.target)) {
  //     setShowAlert(false);
  //     dispatch(setPlay(true));
  //   }
  // };

  const onBrowserClick = () => {
    setShowAlert(false);
    dispatch(setPlay(true));
  };

  const onCloseClick = () => {
    setShowAlert(false);
    dispatch(setPlay(true));
  };

  // useEffect(() => {
  //   // Wait until the alert is visible before adding the event listener
  //   if (isVisible) {
  //     document.addEventListener("click", handleOutsideClick);
  //   } else {
  //     document.removeEventListener("click", handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [isVisible]);

  // useEffect(() => {
  //   // When the alert becomes visible, set isVisible to true
  //   if (setShowAlert) {
  //     setIsVisible(true);
  //   } else {
  //     setIsVisible(false);
  //   }
  // }, [setShowAlert]);

  return (
    <div className=" bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999] alert-height">
      <div className="absolute bottom-0 w-full bg-alert p-5" ref={alertRef}>
        {isWebClip() ? (
          <div className="flex justify-between items-center">
            <h1 className="alert-head-title">苹果商店版已上线，建议立刻安装</h1>
            <button 
              onClick={onCloseClick} 
              className="text-white"
            >
              <img src={closeIcon} alt="Close" width="16" height="16" />
            </button>
          </div>
        ) : (
          <h1 className="alert-head-title">强烈推荐下载APP观看</h1>
        )}
        <div className="flex flex-col mt-8 gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoBlobUrl || logo} alt="" className="w-[50px] h-[50px]" />
              <div>
                <h1 className="alert-body-title">笔盒APP</h1>
                <p className="alert-body-text">更多原创精品内容尽在笔盒</p>
              </div>
            </div>
            <div>
              <a
                href={app_download_link}
                target="_blank"
                className="alert-body-btn"
              >
                {isWebClip() ? "前往安装" : "打开"}
              </a>
            </div>
          </div>
          {/* Only show browser option if not used as a web clip */}
          {!isWebClip() && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <rect width="50" height="50" rx="8" fill="#4690F2" />
                  <path
                    d="M34.1921 15.808C31.7363 13.3522 28.4713 12 25 12C21.5286 12 18.2625 13.3521 15.8078 15.808C13.9096 17.7063 12.6717 20.0887 12.2065 22.6757C12.2054 22.6814 12.2043 22.687 12.2031 22.6927C12.0688 23.4466 12 24.2174 12 24.9996C12 28.4724 13.352 31.7373 15.8079 34.192C18.2625 36.6467 21.5275 38 25 38C28.4725 38 31.7363 36.6479 34.1921 34.192C36.6479 31.736 38 28.4721 38 24.9996C38 21.5267 36.648 18.263 34.1921 15.8072L34.1921 15.808ZM36.0361 25.0004C36.0361 26.6268 35.6818 28.172 35.0475 29.5634C33.6345 29.9505 32.1798 30.2519 30.7025 30.4686C30.9519 28.8434 31.0896 27.1662 31.1111 25.4667C32.8152 25.171 34.4584 24.7512 36.0067 24.2117C36.0248 24.4724 36.0349 24.7353 36.0349 24.9995L36.0361 25.0004ZM13.9636 25.0004C13.9636 24.7352 13.9738 24.4734 13.9919 24.2127C15.5403 24.751 17.1823 25.1708 18.8864 25.4665C18.9078 27.1662 19.0455 28.8435 19.2949 30.4684C17.8176 30.2517 16.3639 29.9503 14.9511 29.5632C14.3168 28.1717 13.9625 26.6266 13.9625 24.9991L13.9636 25.0004ZM16.4499 18.029C17.3956 18.2965 18.3978 18.5154 19.4361 18.6847C19.1574 20.2354 18.9824 21.838 18.9147 23.469C17.3144 23.1778 15.7661 22.7692 14.3112 22.2433C14.7152 20.6779 15.4555 19.2469 16.4487 18.0291L16.4499 18.029ZM18.0672 16.4196C18.7556 15.862 19.5117 15.3858 20.3221 15.0054C20.146 15.581 19.9846 16.169 19.8401 16.7661C19.2341 16.6679 18.6416 16.5528 18.0672 16.4196ZM33.5501 18.029C34.5444 19.2456 35.2847 20.6767 35.6887 22.2421C34.234 22.768 32.6846 23.1766 31.084 23.4677C31.0163 21.838 30.8414 20.2344 30.5626 18.6835C31.602 18.5142 32.6042 18.2952 33.55 18.0277L33.5501 18.029ZM30.1588 16.7649C30.0144 16.1679 29.853 15.5799 29.6769 15.0043C30.4872 15.3846 31.2434 15.8609 31.9329 16.4184C31.3585 16.5516 30.7648 16.6668 30.1588 16.7649ZM29.1307 23.7624C26.4086 24.0886 23.5905 24.0886 20.8683 23.7624C20.9259 22.1158 21.1008 20.4984 21.3841 18.9408C22.5702 19.0605 23.7845 19.1203 24.999 19.1203C26.2134 19.1203 27.4276 19.0605 28.6139 18.9408C28.8983 20.4983 29.0721 22.1155 29.1296 23.7624H29.1307ZM20.8539 25.7499C22.2104 25.9056 23.5974 25.9846 24.9992 25.9846C26.4009 25.9846 27.7879 25.9045 29.1445 25.7499C29.1084 27.4428 28.9504 29.1063 28.6762 30.7113C26.2385 30.9381 23.7612 30.9381 21.3236 30.7113C21.0494 29.1064 20.8902 27.443 20.8552 25.7499H20.8539ZM27.3409 14.2131C27.6704 15.1126 27.9582 16.0483 28.1997 17.0143C26.0961 17.2152 23.9044 17.2152 21.8008 17.0143C22.0423 16.0482 22.3301 15.1115 22.6608 14.2131C23.4158 14.0495 24.1979 13.9626 25.0015 13.9626C25.805 13.9626 26.5871 14.0495 27.3422 14.2131H27.3409ZM16.4309 31.9482C17.4962 32.1795 18.5785 32.3669 19.6734 32.5091C19.8584 33.3578 20.0751 34.1885 20.3223 34.9965C18.8055 34.2833 17.476 33.236 16.4309 31.9482ZM22.6596 35.7865C22.2996 34.8069 21.9915 33.7821 21.7364 32.7225C22.8142 32.8071 23.9021 32.85 25.0003 32.85C26.0972 32.85 27.1863 32.8071 28.2641 32.7225C28.0091 33.7811 27.701 34.8059 27.3421 35.7865C26.5871 35.9502 25.8039 36.0371 25.0014 36.0371C24.1979 36.0371 23.4146 35.9502 22.6608 35.7865H22.6596ZM29.677 34.9965C29.9242 34.1884 30.1409 33.3577 30.3259 32.509C31.4218 32.3668 32.503 32.1795 33.5696 31.9481C32.5234 33.2358 31.1939 34.2843 29.677 34.9965Z"
                    fill="white"
                  />
                </svg>
                <div>
                  <h1 className="alert-body-title">浏览器</h1>
                </div>
              </div>
              <div>
                <button className="alert-body-btn1" onClick={onBrowserClick}>
                  继续
                </button>
              </div>
            </div>
          )}
          {/* Only render this block if the user is not on Android */}
          {/* {!isAndroid && (
       
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AlertRedirect;
