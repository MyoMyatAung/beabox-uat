import BaiduIcon from "@/assets/icons/Baidu.svg";
import QqIcon from "@/assets/icons/Qq.svg";
import WechatIcon from "@/assets/icons/Wechat.svg";
import WeiboIcon from "@/assets/icons/Weibo.svg";
import { useEffect, useRef, useState } from "react";

function SharePost({
  shareUrl,
  onClose,
}: {
  shareUrl: string;
  onClose: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const wechatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (wechatTimeoutRef.current) {
        clearTimeout(wechatTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = (e: React.MouseEvent) => {
    // Prevent any event bubbling that might interfere with modal state
    e.preventDefault();
    e.stopPropagation();
    // Clear any pending WeChat timeout to prevent unwanted modal closure
    if (wechatTimeoutRef.current) {
      clearTimeout(wechatTimeoutRef.current);
      wechatTimeoutRef.current = null;
    }

    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    onClose();
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const shareToWeChat = () => {
    // Clear any existing timeout first
    if (wechatTimeoutRef.current) {
      clearTimeout(wechatTimeoutRef.current);
    }

    // WeChat sharing - try to open WeChat app or redirect to WeChat web
    const wechatUrl = `weixin://dl/moments?text=${encodeURIComponent(
      shareUrl
    )}`;
    window.location.href = wechatUrl;

    // Fallback: if WeChat app is not available, show instructions
    wechatTimeoutRef.current = setTimeout(() => {
      if (document.hidden) {
        // WeChat app opened successfully
        onClose();
      } else {
        // Fallback - copy to clipboard and show message
        navigator.clipboard.writeText(shareUrl);
      }
      wechatTimeoutRef.current = null;
    }, 1000);
  };

  const shareToWeibo = () => {
    // Weibo sharing
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(weiboUrl, "_blank");
    onClose();
  };

  const shareToQQ = () => {
    // QQ sharing
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(qqUrl, "_blank");
    onClose();
  };

  const shareToBaidu = () => {
    // Baidu sharing
    const baiduUrl = `https://hi.baidu.com/share/share?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(baiduUrl, "_blank");
    onClose();
  };

  const shareOptions = [
    {
      name: "WeChat",
      icon: WechatIcon,
      bgColor: "bg-[#51C332]",
      onClick: shareToWeChat,
    },
    {
      name: "Weibo",
      icon: WeiboIcon,
      bgColor: "bg-[#D52C2B]",
      onClick: shareToWeibo,
    },
    {
      name: "QQ",
      icon: QqIcon,
      bgColor: "bg-[#1EBAFC]",
      onClick: shareToQQ,
    },
    {
      name: "Baidu",
      icon: BaiduIcon,
      bgColor: "bg-[#2319DC]",
      onClick: shareToBaidu,
    },
  ];

  return (
    <div className="h-44">
      {/* Share Options */}
      <div className="my-6 flex w-full items-center justify-between px-10">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            className="flex flex-col items-center"
            onClick={option.onClick}
          >
            <div
              className={`h-12 w-12 rounded-full ${option.bgColor} mb-2 flex items-center justify-center`}
            >
              <img src={option.icon} alt={option.name} className="h-6 w-6" />
            </div>
            <span className="font-medium mt-1 text-white text-sm">
              {option.name}
            </span>
          </button>
        ))}
      </div>
      {/* Copy Link Row */}
      <div className="flex w-full items-center justify-between px-6">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="font-xs-regular h-12 flex-1 appearance-none rounded-tl-xl rounded-bl-xl border-none bg-[#22202a] px-4 text-[#777777] placeholder-gray-400 focus:border-0 focus:ring-0 focus:outline-none"
        />
        <button
          onClick={handleCopyLink}
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-r-xl transition-colors duration-200 ${
            isCopied
              ? "bg-[#CD3EFF]"
              : "bg-gradient-to-b from-[#CD3EFF] to-[#FFB2E0]"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="6" fill="none" />
            <path
              d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5H15ZM20 21H8V7H20V21Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SharePost;
