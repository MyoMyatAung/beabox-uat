import DisableFollow from "@/components/profile/disable-follow";
import HideBio from "@/components/profile/hide-bio";
import PrivateProfile from "@/components/profile/private-profile";
import ShareRegion from "@/components/profile/share-region";
import { paths } from "@/routes/paths";
import backButton from "../../assets/backButton.svg";
import { Link } from "react-router-dom";
import HideMe from "@/components/profile/hide-me";

const PrivacySettings = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between bg-[#16131C]">
      <div className="w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.settings}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">
            {/* Privacy Settings */}
            隐私设置
          </p>
          <div></div>
        </div>
        <div className="space-y-6">
          {/* <PrivateProfile />
          <div className="border-b border-white/10"></div> */}

          {/* <DisableFollow />
          <div className="border-b border-white/10"></div> */}
          <HideMe />
          {/* <HideBio /> */}
          <div className="border-b border-white/10"></div>
          <ShareRegion />
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
