import React from "react";
import { useNavigate } from "react-router-dom";

const UploadProgress = ({
  uploadPercentage,
  uploadedSize,
  totalSize,
  onCancel,
  successEnd,
  setsuccessEnd,
  refetch,
  seteditPost,
}: any) => {
  const navigate = useNavigate();

  const govideos = () => {
    seteditPost(null);
    setsuccessEnd(false);
    refetch();
    navigate("/your-videos");
  };
  return (
    <div className="bg-[#000000A3]">
      {/* Progress Text */}

      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <div className="flex w-[60%] justify-between items-center mb-2">
          <div className="uploading_text">Uploading {uploadPercentage}%</div>

          {/* File Size Info */}
          <div className="uploading_text1">
            {uploadedSize}MB / {totalSize}MB
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-[60%] h-2 bg-progress rounded-full relative">
          <div
            className="h-2 rounded-full bg-progress1"
            style={{ width: `${uploadPercentage}%` }}
          ></div>
        </div>

        {/* Cancel Button */}
        {!successEnd && (
          <button
            className="mt-10 cancel_upload cursor-pointer"
            onClick={onCancel}
          >
            Cancel Uploading
          </button>
        )}

        {successEnd && (
          <div className="flex items-center gap-5">
            <button
              className="mt-10 cancel_upload cursor-pointer"
              onClick={() => setsuccessEnd(false)}
            >
              Continue Uploading
            </button>
            <button
              className="mt-10 cancel_upload cursor-pointer"
              onClick={govideos}
            >
              View Post Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;
