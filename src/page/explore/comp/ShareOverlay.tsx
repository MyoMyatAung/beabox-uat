import React, { useState } from "react";
import ReactDOM from "react-dom";
import qr from "../../home/qr.png";
import copy from "copy-to-clipboard";

const ShareOverlay: React.FC<any> = ({
  alertVisible,
  config,
  setAlertVisible,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setIsClosing(false); // Reset the state
      setAlertVisible(false);
    }, 100); // Match the duration of the closing animation
  };

  if (!alertVisible && !isClosing) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999999] flex justify-center items-end">
      <div
        className="absolute inset-0 bg-transparent bg-opacity-80"
        onClick={handleClose}
      ></div>

      <div
        className={`relative w-full max-h-full comments-list  rounded-t-2xl z-[99999] p-5 overflow-hidden ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <div className="flex justify-center items-center">
          <div className="share-line"></div>
        </div>

        <div className="flex justify-center items-center mt-5">
          <div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none"
                >
                  <path
                    d="M40.5 20C40.5 31.0457 31.5457 40 20.5 40C9.4543 40 0.5 31.0457 0.5 20C0.5 8.9543 9.4543 0 20.5 0C31.5457 0 40.5 8.9543 40.5 20Z"
                    fill="white"
                    fill-opacity="0.08"
                  />
                  <path
                    d="M26.0209 28.8891H13.8682C12.3172 28.8891 11.0557 27.6808 11.0557 26.197V24.4447C11.0557 23.8312 11.5533 23.3336 12.1668 23.3336C12.7802 23.3336 13.2779 23.8312 13.2779 24.4447V26.197C13.2779 26.4516 13.5487 26.6669 13.8682 26.6669H26.0209C26.3404 26.6669 26.6112 26.4516 26.6112 26.197V24.4447C26.6112 23.8312 27.1089 23.3336 27.7223 23.3336C28.3358 23.3336 28.8334 23.8312 28.8334 24.4447V26.197C28.8334 27.6808 27.5719 28.8891 26.0209 28.8891ZM19.9446 11.1113C19.3311 11.1113 18.8334 11.609 18.8334 12.2224V22.2224C18.8334 22.8359 19.3311 23.3336 19.9446 23.3336C20.558 23.3336 21.0557 22.8359 21.0557 22.2224V12.2224C21.0557 11.609 20.558 11.1113 19.9446 11.1113Z"
                    fill="white"
                  />
                  <path
                    d="M22.6364 19.1184C22.3516 19.1184 22.0669 19.2272 21.8516 19.4448L19.9442 21.3498L18.0391 19.4448C17.6039 19.0096 16.9026 19.0096 16.4674 19.4448C16.0322 19.8799 16.0322 20.5813 16.4674 21.0165L19.1595 23.7086C19.5947 24.1438 20.2961 24.1438 20.7313 23.7086L23.4234 21.0165C23.8586 20.5813 23.8586 19.8799 23.4234 19.4448C23.2035 19.2272 22.9188 19.1184 22.6364 19.1184Z"
                    fill="white"
                  />
                </svg>
                <span className="download-text">Save Video</span>
              </div>
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none"
                >
                  <path
                    d="M40.5 20C40.5 31.0457 31.5457 40 20.5 40C9.4543 40 0.5 31.0457 0.5 20C0.5 8.9543 9.4543 0 20.5 0C31.5457 0 40.5 8.9543 40.5 20Z"
                    fill="white"
                    fill-opacity="0.08"
                  />
                  <path
                    d="M26.6426 21.8078L29.4586 18.9913C31.5129 16.9374 31.5129 13.5948 29.4586 11.5409C27.4045 9.48637 24.0621 9.48637 22.008 11.5409L17.944 15.6048C15.8897 17.6587 15.8897 21.0014 17.944 23.0552C18.2474 23.3588 18.5793 23.6161 18.9306 23.8298L21.1063 21.654C20.6919 21.5549 20.2988 21.3458 19.9761 21.0234C19.0424 20.0896 19.0424 18.5702 19.9761 17.6367L24.0401 13.5728C24.9738 12.639 26.4932 12.639 27.4267 13.5728C28.3605 14.5065 28.3605 16.0257 27.4267 16.9594L26.2328 18.1536C26.7248 19.3115 26.8608 20.5849 26.6426 21.8078Z"
                    fill="white"
                  />
                  <path
                    d="M15.3569 18.1925L12.5409 21.0087C10.4864 23.0628 10.4864 26.4053 12.5409 28.4594C14.5948 30.5137 17.9374 30.5137 19.9915 28.4594L24.0552 24.3954C26.1095 22.3413 26.1093 18.9989 24.0552 16.945C23.7521 16.6415 23.4202 16.3842 23.0688 16.1704L20.8932 18.3463C21.3074 18.4456 21.7005 18.6542 22.0234 18.9769C22.9571 19.9106 22.9571 21.4298 22.0234 22.3635L17.9592 26.4275C17.0255 27.3612 15.5062 27.3612 14.5725 26.4275C13.6388 25.4938 13.6388 23.9745 14.5725 23.0408L15.7667 21.8469C15.2745 20.689 15.1385 19.4153 15.3569 18.1925Z"
                    fill="white"
                  />
                </svg>
                <span className="download-text">Copy Link</span>
              </div>
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none"
                >
                  <path
                    d="M40.5 20C40.5 31.0457 31.5457 40 20.5 40C9.4543 40 0.5 31.0457 0.5 20C0.5 8.9543 9.4543 0 20.5 0C31.5457 0 40.5 8.9543 40.5 20Z"
                    fill="white"
                    fill-opacity="0.08"
                  />
                  <path
                    d="M26.4163 21.8333C27.7822 20.495 29.1663 18.8908 29.1663 16.7917C29.1663 15.4545 28.6352 14.1722 27.6897 13.2267C26.7442 12.2812 25.4618 11.75 24.1247 11.75C22.5113 11.75 21.3747 12.2083 19.9997 13.5833C18.6247 12.2083 17.488 11.75 15.8747 11.75C14.5375 11.75 13.2552 12.2812 12.3097 13.2267C11.3642 14.1722 10.833 15.4545 10.833 16.7917C10.833 18.9 12.208 20.5042 13.583 21.8333L19.9997 28.25L26.4163 21.8333Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.0003 20.9168L19.0837 20.0002L20.917 18.1668L18.167 15.4168L20.0003 13.5835"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="download-text">Unlike</span>
              </div>
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none"
                >
                  <path
                    d="M40.5 20C40.5 31.0457 31.5457 40 20.5 40C9.4543 40 0.5 31.0457 0.5 20C0.5 8.9543 9.4543 0 20.5 0C31.5457 0 40.5 8.9543 40.5 20Z"
                    fill="white"
                    fill-opacity="0.08"
                  />
                  <path
                    d="M28.9187 25.5L21.5854 12.6667C21.4255 12.3846 21.1936 12.1499 20.9134 11.9866C20.6332 11.8233 20.3147 11.7373 19.9904 11.7373C19.6661 11.7373 19.3476 11.8233 19.0674 11.9866C18.7872 12.1499 18.5553 12.3846 18.3954 12.6667L11.0621 25.5C10.9004 25.78 10.8157 26.0976 10.8164 26.4208C10.8171 26.7441 10.9033 27.0614 11.0661 27.3405C11.229 27.6197 11.4628 27.8509 11.7438 28.0106C12.0248 28.1704 12.343 28.253 12.6662 28.25H27.3329C27.6546 28.2497 27.9705 28.1648 28.2489 28.0037C28.5274 27.8427 28.7585 27.6112 28.9192 27.3326C29.0799 27.0539 29.1644 26.7379 29.1644 26.4162C29.1643 26.0946 29.0796 25.7786 28.9187 25.5Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20 17.25V20.9167"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20 24.5835H20.01"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="download-text">Report</span>
              </div>
            </div>
            <div className="flex mb-4 justify-center items-center my-10 p-0">
              <div className="text-right">
                <img src={qr} alt="" width={150} height={150} />
              </div>
              {/* <div>
            <h1 className="qr_text1 mb-2">Scan Qr Code</h1>
            <p className="qr_text2 mb-2">
              If the qr code cannot be open, please enter the link
            </p>
            <p className="qr_text3">{config?.app_download_link}</p>
          </div> */}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-10 py-2 px-5">
              <button className="share_btn">Save img to share</button>
              <button
                className="share_btn"
                onClick={() => {
                  const shareUrl = config?.app_download_link;
                  copy(shareUrl);
                }}
              >
                Copy share link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root") as HTMLElement
  );
};

export default ShareOverlay;
