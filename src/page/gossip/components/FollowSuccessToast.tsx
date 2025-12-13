import { useEffect } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";

interface FollowSuccessToastProps {
  show: boolean;
  message: string;
  onHide: () => void;
  duration?: number; // Duration in milliseconds, default 3000
  isFollowed?: boolean;
}

const FollowSuccessToast = ({
  show,
  message,
  isFollowed = false,
  onHide,
  duration = 3000,
}: FollowSuccessToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show) return null;

  return (
    <div className="fixed bottom-[200px] left-1/2 transform -translate-x-1/2 z-[9999] flex justify-center items-center">
      <div className="bg-[#4a4448] bg-opacity-90 text-white px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg">
        {isFollowed ? (
          <PlusCircle size={18} className="text-white" />
        ) : (
          <MinusCircle size={18} className="text-white" />
        )}
        <p className="text-[13px] whitespace-nowrap">{message}</p>
      </div>
    </div>
  );
};

export default FollowSuccessToast;
