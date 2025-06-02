import { paths } from "@/routes/paths";
// import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditLanguage from "@/components/profile/edit-language";
import { logOutUser } from "@/store/slices/persistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigQuery, useLogoutMutation } from "@/store/api/profileApi";
import withProfileData from "@/hocs/withProfileData";
import ChangePassword from "@/components/profile/change-password";
import EditSecurity from "@/components/profile/edit-security";
import PrivateProfile from "@/components/profile/private-profile";
import ContentVisibility from "@/components/profile/content-visibility";
import { useEffect, useState } from "react";
import backButton from "../../assets/backButton.svg";
import Loader from "@/components/shared/loader";

const Settings = ({
  liked_video_visibility,
  changeVisibilityHandler,
  visibilityLoading,
  content_visibility,
  changeCVisHandler,
  cvLoading,
}: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { data: lgdata, isLoading }] = useLogoutMutation();
  const user = useSelector((state: any) => state?.persist?.user);
  const [device, setDevice] = useState("android");
  const [cacheSize, setCacheSize] = useState(null);

  useEffect(() => {
    const calculateCacheSize = async () => {
      if ("caches" in window) {
        try {
          const cacheNames = await caches.keys();
          let totalSize = 0;

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const cachedRequests = await cache.keys();

            for (const request of cachedRequests) {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
              }
            }
          }

          // Convert total size from bytes to megabytes (MB) and round to nearest integer
          const sizeInMB = Math.round(totalSize / (1024 * 1024));
          setCacheSize(sizeInMB);
        } catch (error) {
          console.error("Error calculating cache size:", error);
          setCacheSize("Error");
        }
      } else {
        setCacheSize("Caches API not supported");
      }
    };

    calculateCacheSize();
  }, []);

  const { data } = useGetConfigQuery(device);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setDevice("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDevice("ios");
    } else {
      setDevice("other");
    }
  }, []);
  if (isLoading) return <Loader />;
  return (
    <div className="w-full h-screen no-scrollbar px-5 flex flex-col items-center relative bg-[#16131C]">
      <div className="top flex flex-col gap-5 w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">设置和隐私</p>
          <div></div>
        </div>

        {user?.token ? (
          <>
            <div className="flex flex-col gap-4">
              <h1 className="text-[16px] text-[#888]">账户安全</h1>
              <ChangePassword />
              <div className="mt-5">
                <EditSecurity />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {user?.token ? (
          <>
            <div className="flex flex-col gap-4 mt-5">
              <h1 className="text-[16px] text-[#888]">
                {/* Account Privacy */}
                账号隐私设置
              </h1>
            </div>
            <ContentVisibility
              content_visibility={content_visibility}
              changeVisibilityHandler={changeCVisHandler}
              visibilityLoading={cvLoading}
            />
            <div className="border-b border-white/10 my-2"></div>
            {/* change feed */}
            <Link to={paths.user_feed} className=" fle hidden flex-col gap-2">
              <div className=" flex w-full justify-between items-center">
                <h1 className=" text-white text-[14px] font-[400] leading-[24px]">
                  个性化您的推荐内容
                </h1>
                <ChevronRight size={15} className="text-[#777777]" />
              </div>
              <span className=" text-[#888] text-[10px] font-[400] pr-[60px]">
                您的偏好设置将帮助我们个性化推荐内容，根据您的兴趣展示最相关和最吸引您的选项。
              </span>
            </Link>

            <div className="border-b hidden border-white/10 my-2"></div>

            <Link
              to={paths.privacy_settings}
              className="flex justify-between items-center mb-5"
            >
              <p className="flex items-center gap-1 text-[14px]">
                {/* Privacy Settings */}
                隐私设置
              </p>
              <div className="flex items-center gap-1 text-[14px]">
                <ChevronRight size={15} className="text-[#777777]" />
              </div>
            </Link>
          </>
        ) : (
          <></>
        )}

        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">当前版本</p>
          <p className="flex items-center gap-1 text-[14px]">
            V 1.1.8.0 <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div>

        <div className="border-b border-white/10 my-2"></div>

        {/* <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">清除缓存</p>
          <p className="flex items-center gap-1 text-[14px]">
            {Math.round(cacheSize)} MB{" "}
            <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div> */}
      </div>
      <div className="w-full fixed bottom-0 px-5">
        {user?.token ? (
          <div className="bot w-full py-5">
            <Button
              onClick={async () => {
                dispatch(logOutUser());
                await logout("");
                navigate(paths.profile);
              }}
              className="w-full rounded-xl bg-[#1C1A22] hover:bg-[#1C1A22]"
            >
              退出
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default withProfileData(Settings);
