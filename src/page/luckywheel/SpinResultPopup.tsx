import React from "react";
import { Prize } from "./models";
import "./SpinResultPopup.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

// Add DecryptedImage component
const DecryptedImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt = "", className = "", style = {} }) => {
  const [decryptedSrc, setDecryptedSrc] = React.useState<string>(src);

  React.useEffect(() => {
    const decryptSrc = async () => {
      if (src.endsWith(".txt")) {
        try {
          const response = await fetch(src);
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
              setDecryptedSrc(blobUrl);
            } catch (err) {
              console.error("Error converting data URL to blob:", err);
              setDecryptedSrc(decryptedStr);
            }
          } else {
            setDecryptedSrc(decryptedStr);
          }
        } catch (error) {
          console.error("Error decrypting image:", error);
          setDecryptedSrc(src);
        }
      }
    };
    decryptSrc();
  }, [src]);

  return (
    <img src={decryptedSrc} alt={alt} className={className} style={style} />
  );
};

interface SpinResultPopupProps {
  show: boolean;
  currentPrize: Prize | null;
  popupTitle: string;
  popupButtonText: string;
  onClose: () => void;
  popupMessage: string;
  onRedirect: any;
}

const SpinResultPopup: React.FC<SpinResultPopupProps> = ({
  show,
  currentPrize,
  popupTitle,
  popupButtonText,
  onClose,
  popupMessage,
  onRedirect,
}) => {
  if (!show || !currentPrize) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        {/* Firework GIF at the top */}
        <DecryptedImage
          src="/images/firework.gif"
          alt="Fireworks"
          className="firework-gif"
        />

        <div className="popup-header">
          <span className="popup-title-line-left"></span>
          <h3 className="popup-title">{currentPrize?.content}</h3>
          <span className="popup-title-line-right"></span>
        </div>
        <div className="popup-content">
          {currentPrize.type === "cash_payment" ? (
            // Special display for cash payment
            <>
              <div className="currency-amount mr-4">
                <span>{currentPrize.name.match(/\d+/)?.[0]}</span>

                <span className="currency-unit">元</span>
              </div>
              {currentPrize.image && (
                <DecryptedImage
                  src={`${currentPrize.image}`}
                  alt="Yuan Coin"
                  className="prize-image"
                />
              )}
            </>
          ) : currentPrize.type === "appreciation" ? (
            <>
              {currentPrize.image && (
                <DecryptedImage
                  src={`${currentPrize.image}`}
                  alt="Emoji"
                  className="prize-image"
                />
              )}
              <p className="text-[#D20065] text-[16px] font-medium">
                {currentPrize.name}
              </p>
            </>
          ) : (
            // Default display for other prize types (reward)
            <>
              {currentPrize.image && (
                <DecryptedImage
                  src={`${currentPrize.image}`}
                  alt="Prize"
                  className="prize-image"
                />
              )}
            </>
          )}
        </div>
        <div className="popup-footer">
          <button
            onClick={onClose}
            className=" spin_button1 h-[50px] text-[#831C00] text-[16px] font-[700] leading-[24px] flex justify-center items-center"
          >
            {popupButtonText}
          </button>
        </div>
      </div>
      {currentPrize.type === "cash_payment" && (
        <div className="absolute bottom-10 border-none">
          <button
            onClick={onRedirect}
            className="w-[200px] border-none h-[48px] cash_bottom text-white text-[16px] font-[700] leading-[24px] flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M11.7585 5.78626V2.19924C11.7585 1.81784 12.0627 1.5 12.4475 1.5C12.7919 1.5 13.0838 1.76707 13.13 2.10536L13.1364 2.19924V5.78626L17.4132 5.78653C19.5426 5.78653 21.2922 7.53033 21.3904 9.7051L21.3947 9.89808V14.4069C21.3947 16.5969 19.7061 18.3946 17.6082 18.4955L17.4221 18.5H7.47263C5.34316 18.5 3.60208 16.7649 3.50433 14.5822L3.5 14.3884L3.5 9.88884C3.5 7.69883 5.18024 5.89245 7.27757 5.79102L7.46368 5.78653H11.7584V11.515L10.3268 10.0367C10.0584 9.75949 9.62 9.75949 9.35158 10.0367C9.21737 10.1753 9.15474 10.3601 9.15474 10.5448C9.15474 10.6853 9.19482 10.8316 9.27957 10.9555L9.35158 11.0438L11.9553 13.7417C12.0805 13.8803 12.2595 13.9542 12.4474 13.9542C12.5965 13.9542 12.7456 13.9029 12.8637 13.8056L12.9305 13.7417L15.5342 11.0438C15.8026 10.7666 15.8026 10.3139 15.5342 10.0367C15.2902 9.78469 14.9057 9.76178 14.6361 9.96795L14.5589 10.0367L13.1363 11.515V5.78653L11.7585 5.78626Z"
                fill="white"
              />
            </svg>
            <span className="ml-1">立即提现</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SpinResultPopup;
