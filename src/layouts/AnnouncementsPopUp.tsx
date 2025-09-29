import { X } from "lucide-react";
import ImgAnnouncement from "@/assets/img-announcement.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type AnnouncementSection = {
  title: string;
  items: string[];
};

function parseAnnouncement(
  announcement: string | undefined
): AnnouncementSection[] {
  if (!announcement) return [];
  return announcement
    .split("###")
    .filter(Boolean)
    .map((block) => {
      const trimmedBlock = block.trim();
      const lines = trimmedBlock.split("<br/>");
      const title = lines[0]?.trim() || "";

      const items = lines
        .slice(1)
        .filter((line) => line.trim())
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.replace(/^-\s*/, "").trim());

      return { title, items };
    });
}

const AnnouncementsPopUp = ({
  showAnnouncementsPopUp,
  setShowAnnouncementsPopUp,
  config,
}: {
  showAnnouncementsPopUp: boolean;
  setShowAnnouncementsPopUp: (show: boolean) => void;
  config: { data?: { noti_announcement?: string } };
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPopup = Boolean(
      localStorage.getItem("hasSeenAnnounencePopup")
    );
    if (!hasSeenPopup) setShowAnnouncementsPopUp(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenAnnounencePopup", "true");
    setShowAnnouncementsPopUp(false);
  };

  const handleViewDetails = () => {
    localStorage.setItem("hasSeenAnnounencePopup", "true");
    setShowAnnouncementsPopUp(false);
    navigate("/notifications");
  };

  const announcement = config?.data?.noti_announcement;
  const parsed = parseAnnouncement(announcement);

  return (
    <>
      {showAnnouncementsPopUp && parsed.length > 0 && (
        <div className="top-0 left-0 h-screen bg-black/80 w-screen flex flex-col gap-4 justify-center items-center fixed z-[9999]">
          <div className="w-full max-w-[390px] bg-opacity-50 flex flex-col gap-5 items-center justify-center p-4 z-50">
            <div>
              {/* Header image */}
              <div
                className="text-left w-full h-[150px] relative bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${ImgAnnouncement})` }}
              >
                <div className="absolute bottom-[25%] left-5 w-[80%]">
                  <h2 className="text-white text-[26px]/[32px] font-semibold">
                    官方公告
                  </h2>
                </div>
              </div>

              {/* Content box */}
              <div className="bg-[#161619] rounded-b-3xl px-3 py-2 w-full text-center">
                <div className="w-full max-h-[286px] overflow-y-auto px-3">
                  {parsed.map((section, idx) => (
                    <div key={idx} className="space-y-3 mb-5 mx-1">
                      <h3 className="text-white text-base font-semibold text-left mb-4">
                        {section.title}
                      </h3>
                      {section.items.length > 0 && (
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-white rounded-full mt-2.5 flex-shrink-0"></div>
                              <span className="text-white/80 text-sm leading-relaxed text-left">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div className="py-4">
                  <button
                    onClick={handleViewDetails}
                    className="w-full max-w-[250px] bg-[linear-gradient(324.57deg,#CD3EFF_43.64%,#FFB2E0_100%)] text-white font-medium py-2.5 rounded-2xl hover:from-pink-600 hover:to-purple-700"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>

            {/* Close button */}
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

export default AnnouncementsPopUp;
