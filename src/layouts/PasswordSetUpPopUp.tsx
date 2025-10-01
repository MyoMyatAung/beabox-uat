import { X } from "lucide-react";
import ImgPasswordSetup from "@/assets/img-password-setup.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const PasswordSetUpPopUp = ({
  showPasswordSetUpPopUp,
  setShowPasswordSetUpPopUp,
}: {
  showPasswordSetUpPopUp: boolean;
  setShowPasswordSetUpPopUp: (show: boolean) => void;
}) => {
  const navigate = useNavigate();

  const isEnabledDualPassword = useSelector(
    (state: any) => state.persist.isEnabledDualPassword
  );

  useEffect(() => {
    // Show popup only if dual password is not enabled and user hasn't seen it
    const hasSeenPopup = Boolean(
      localStorage.getItem("hasSeenPasswordSetupPopup")
    );
    if (!isEnabledDualPassword && !hasSeenPopup) {
      setShowPasswordSetUpPopUp(true);
    }
  }, [isEnabledDualPassword]);

  const handleClose = () => {
    localStorage.setItem("hasSeenPasswordSetupPopup", "true");
    setShowPasswordSetUpPopUp(false);
  };

  const handleSetup = () => {
    localStorage.setItem("hasSeenPasswordSetupPopup", "true");
    setShowPasswordSetUpPopUp(false);
    navigate("/security/decoy-password?type=setup");
  };

  if (isEnabledDualPassword) return null;

  return (
    <>
      {showPasswordSetUpPopUp && (
        <div className="top-0 left-0 h-screen bg-black/80 w-screen flex flex-col gap-4 justify-center items-center fixed z-[9999]">
          <div className="w-full max-w-[390px] bg-opacity-50 flex flex-col gap-5 items-center justify-center p-4 z-50">
            <div>
              <div className="text-center w-full h-auto">
                <img
                  src={ImgPasswordSetup}
                  alt="Password Setup Illustration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#161619] rounded-b-3xl p-5 w-full text-center">
                <h2 className="text-white text-lg font-semibold text-center mb-2">
                  双重访问密码设置
                </h2>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-white/80 text-sm leading-relaxed text-left">
                      设置两个不同的密码。一个进入伪装应用，另一个进入真实应用。
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-white/80 text-sm leading-relaxed text-left">
                      在设置中，用户可以设置、删除或更改密码。
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-white/80 text-sm leading-relaxed text-left">
                      需要清除应用数据才能恢复密码。
                      <span className="text-white font-medium ml-1">
                        应用信息 → 清除数据
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSetup}
                  className="w-full max-w-[250px] bg-[linear-gradient(324.57deg,#CD3EFF_43.64%,#FFB2E0_100%)] text-white font-medium py-2.5 rounded-2xl hover:from-pink-600 hover:to-purple-700"
                >
                  立即设置！
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordSetUpPopUp;
