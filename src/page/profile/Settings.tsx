import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditLanguage from "@/components/profile/edit-language";
import { logOutUser } from "@/store/slices/persistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/store/api/profileApi";
import withProfileData from "@/hocs/withProfileData";
import ChangePassword from "@/components/profile/change-password";
import EditSecurity from "@/components/profile/edit-security";
import PrivateProfile from "@/components/profile/private-profile";
import ContentVisibility from "@/components/profile/content-visibility";

const Settings = ({ liked_video_visibility, changeVisibilityHandler }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const user = useSelector((state: any) => state.persist.user);

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between bg-[#16131C]">
      <div className="top flex flex-col gap-5 w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">
            {user?.token ? "Setting & Privacy" : "Setting"}
          </p>
          <div></div>
        </div>

        {user?.token ? (
          <>
            {/* <EditLanguage />
            <div className="border-b border-white/10"></div> */}
            <div className="flex flex-col gap-4">
              <h1 className="text-[12px] text-[#888]">Account Security</h1>
              <ChangePassword />
              <EditSecurity />
            </div>
          </>
        ) : (
          <></>
        )}

        {user?.token ? (
          <>
            <div className="flex flex-col gap-4">
              <h1 className="text-[12px] text-[#888]">Account Privacy</h1>
            </div>
            <ContentVisibility
              liked_video_visibility={liked_video_visibility}
              changeVisibilityHandler={changeVisibilityHandler}
            />
            <div className="border-b border-white/10"></div>
            <div className="flex justify-between items-center">
              <p className="flex items-center gap-1 text-[14px]">
                Privacy Settings
              </p>
              <Link
                to={paths.privacy_settings}
                className="flex items-center gap-1 text-[14px]"
              >
                <ChevronRight size={15} className="text-[#777777]" />
              </Link>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="border-b border-white/10"></div>

        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">Current Version</p>
          <p className="flex items-center gap-1 text-[14px]">
            V 8.0.4 <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div>
        <div className="border-b border-white/10"></div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">Clear Cache</p>
          <p className="flex items-center gap-1 text-[14px]">
            V 8.0.4 <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div>
      </div>
      {user?.token ? (
        <div className="bot w-full py-5">
          <Button
            onClick={async () => {
              dispatch(logOutUser());
              await logout("");
              // navigate(paths.profile);
            }}
            className="w-full rounded-xl bg-[#1C1A22] hover:bg-[#1C1A22]"
          >
            Log Out
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default withProfileData(Settings);
