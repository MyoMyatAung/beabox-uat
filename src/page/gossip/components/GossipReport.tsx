import { useNavigate, useParams } from "react-router-dom";
import { useReportGossipPostMutation } from "../services/gossipSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/page/home/services/errorSlice";
import { useState, useEffect } from "react";
import type { RootState } from "@/store/store";

// Report reasons structure matching the UI
const reportReasons = {
  未成年: [{ id: "1", content: "包含未成年人内容" }],
  内容违规: [
    { id: "2", content: "包含敏感政治内容" },
    { id: "3", content: "暴力&令人不适" },
  ],
  垃圾广告: [
    { id: "4", content: "传播谣言" },
    { id: "5", content: "涉嫌欺诈内容" },
    { id: "6", content: "搬运/偷取他人视频" },
    { id: "7", content: "头像&昵称违规" },
  ],
};

const GossipReport = () => {
  const { id } = useParams();
  const [triggerReport, { isLoading }] = useReportGossipPostMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.persist?.user);
  const [isReady, setIsReady] = useState(false);

  // Wait a moment to ensure token is available from redux-persist
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReport = async (content: string) => {
    if (isSubmitting || isLoading || !isReady) return;

    // Check authentication before making the request
    if (!user?.token) {
      dispatch(
        showToast({
          message: "请先登录后再操作",
          type: "error",
        })
      );
      navigate(-1);
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await triggerReport({
        model_id: id || "",
        type: "post",
        report_content: content,
      });

      if (response?.data) {
        dispatch(
          showToast({
            message:
              response?.data?.message || "已收到您的举报，我们会尽快处理",
            type: "success",
          })
        );
        navigate(-1);
      } else {
        dispatch(
          showToast({
            message: response?.error?.data?.message || "举报失败",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          message: "举报失败，请稍后重试",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white bg-[#16131C] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center px-5 py-4 sticky top-0 bg-[#16131C] z-10">
        <button onClick={handleBack} className="p-2 -ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
          >
            <path
              d="M9.45638 0.326135C9.35813 0.242721 9.24141 0.176541 9.11291 0.131386C8.98441 0.0862314 8.84665 0.0629883 8.70753 0.0629883C8.56841 0.0629883 8.43065 0.0862314 8.30215 0.131386C8.17365 0.176541 8.05693 0.242721 7.95868 0.326135L0.92714 6.28078C0.848699 6.34707 0.786466 6.42581 0.744005 6.51249C0.701544 6.59918 0.679688 6.6921 0.679688 6.78595C0.679688 6.8798 0.701544 6.97272 0.744005 7.05941C0.786466 7.14609 0.848699 7.22484 0.92714 7.29113L7.95868 13.2458C8.3733 13.5969 9.04176 13.5969 9.45638 13.2458C9.87099 12.8947 9.87099 12.3286 9.45638 11.9775L3.33022 6.78237L9.46484 1.58729C9.87099 1.24334 9.87099 0.670085 9.45638 0.326135Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="text-lg font-medium">举报违规内容</div>
        <div className="w-10"></div>
      </div>

      <div className="px-5 pt-2">
        {/* Loop Through Groups */}
        {Object.keys(reportReasons).map((group, groupIndex) => (
          <div
            key={group}
            className={`mb-6 ${
              groupIndex !== Object.keys(reportReasons).length - 1
                ? "border-b border-[#2A2731]"
                : ""
            } pb-6`}
          >
            {/* Group Header */}
            <div className="text-[#6B6B6B] text-sm mb-1 font-normal">
              {group}
            </div>
            {/* List of Reports in Group */}
            {reportReasons[group as keyof typeof reportReasons].map(
              (item: { id: string; content: string }) => (
                <div
                  onClick={() => !isSubmitting && handleReport(item.content)}
                  key={item.id}
                  className={`flex justify-between items-center py-3 rounded-lg transition-colors ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer active:bg-[#1E1C28]"
                  }`}
                >
                  <span className="text-white text-base font-normal">
                    {item.content}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="6"
                    height="11"
                    viewBox="0 0 6 11"
                    fill="none"
                  >
                    <path
                      d="M0.205987 0.537167C0.270848 0.472142 0.347901 0.420552 0.432731 0.385351C0.517561 0.35015 0.608502 0.332031 0.700346 0.332031C0.79219 0.332031 0.883131 0.35015 0.967961 0.385351C1.05279 0.420552 1.12984 0.472142 1.1947 0.537167L5.83664 5.17911C5.88843 5.23078 5.92951 5.29217 5.95754 5.35974C5.98557 5.42732 6 5.49976 6 5.57292C6 5.64607 5.98557 5.71851 5.95754 5.78609C5.92951 5.85366 5.88843 5.91505 5.83664 5.96673L1.1947 10.6087C0.920991 10.8824 0.4797 10.8824 0.205987 10.6087C-0.0677252 10.335 -0.0677252 9.89366 0.205987 9.61995L4.25023 5.57012L0.200402 1.5203C-0.0677242 1.25217 -0.0677252 0.805294 0.205987 0.537167Z"
                      fill="#888888"
                    />
                  </svg>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GossipReport;
