import { useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "@/store/api/profileApi";
import { ChevronLeft } from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/profile-avatar";
import Loader from "@/components/shared/loader";
import OtherStats from "@/components/profile/other-stats";
import VideoTab2 from "@/components/profile/video-tab2";
const OtherProfile = () => {
  const { id } = useParams();
  const { data: userData, isLoading: userLoading } = useGetUserProfileQuery(
    id || ""
  );
  const navigate = useNavigate();

  if (userLoading) return <Loader />;
  return (
    <div className="px-5 max-h-screen no-scrollbar profile-bg">
      <div className="flex gap-3 my-5 justify-between items-center">
        <ChevronLeft onClick={() => navigate(-1)} />
        <p className="text-[16px] mr-5">{userData?.data?.nickname}</p>
        <div></div>
      </div>
      {/* login  */}
      <div className="w-full flex items-center gap-3 py-5">
        <ProfileAvatar progressData={userData?.data?.level_progress} />
        <div className="flex-1">
          <p className="text-[18px] flex items-center gap-2">
            {userData?.data?.nickname}
            <span>
              <BsPatchCheckFill className="text-[#888]" />
            </span>{" "}
          </p>
          <div className="flex items-start gap-2 mt-1">
            <img src={userData?.data?.level} className="w-14" alt="" />
            <p className="text-[14px]">(ID {userData?.data?.user_code})</p>
          </div>
        </div>
      </div>
      <h1 className="text-[12px] text-[#888] mb-5 italic">
        {userData?.data?.bio ? userData?.data?.bio : ""}
      </h1>
      {/* Stats */}
      {/* <Stats /> */}
      <OtherStats
        follower={userData?.data?.followers_count}
        following={userData?.data?.following_count}
      />

      <Button
        className={`w-full ${
          userData?.data?.is_following
            ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
            : "gradient-bg hover:gradient-bg"
        } rounded-[12px]`}
      >
        {userData?.data?.is_following ? "Following" : "Follow"}
      </Button>
      <VideoTab2 id={id} />
    </div>
  );
};

export default OtherProfile;
