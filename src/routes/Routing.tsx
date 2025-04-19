import { lazy, ReactNode } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";
import More from "@/page/explore/comp/More";
import Wallet from "@/page/wallet/Wallet";
import Invite from "@/page/wallet/comp/Invite";
import TranHist from "@/page/wallet/comp/TranHist";
import Recharge from "@/page/wallet/page/Recharge";
import Withdraw from "@/page/wallet/page/Withdraw";
import Search from "@/page/search/Search";
import Results from "@/page/search/page/Results";
import VodDetails from "@/page/explore/comp/VodDetails";
import Report from "@/page/report/Report";
import SafeLazyLoad from "@/components/SafeLazyLoad";

const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
const CreateCenter = lazy(() => import("../page/create-center/CreateCenter"));
const Recycle = lazy(() => import("../page/create-center/Recycle"));
const Tags = lazy(() => import("../page/create-center/Tags"));
const Ranking = lazy(() => import("../page/create-center/Ranking"));
const CreatorUpload = lazy(() => import("../page/create-center/CreatorUpload"));
const VideoUpload = lazy(() => import("../page/create-center/VideoUpload"));
const VideoDetails = lazy(() => import("../page/create-center/VideoDetails"));
const YourVideos = lazy(() => import("../page/create-center/YourVideos"));
const Profile = lazy(() => import("../page/profile/Profile"));
const OtherProfile = lazy(() => import("../page/profile/OtherProfile"));
const ProfileDetail = lazy(() => import("../page/profile/ProfileDetail"));
const Settings = lazy(() => import("../page/profile/Settings"));
const PrivacySettings = lazy(() => import("../page/profile/PrivacySettings"));
const Noti = lazy(() => import("../page/profile/noti/Noti"));
const NotiDetail = lazy(() => import("../page/profile/noti/NotiDetail"));
const SystemNoti = lazy(() => import("../page/profile/noti/SystemNoti"));
const BalanceNoti = lazy(() => import("../page/profile/noti/BalanceNoti"));
const SecurityQuestion = lazy(() => import("../page/profile/SecurityQuestion"));
const Login = lazy(() => import("../page/auth/Login"));
const Register = lazy(() => import("../page/auth/Register"));
const OTP = lazy(() => import("../page/auth/OTP"));
const UploadComponent = lazy(() => import("../page/upload/Upload"));
const UploadProcess = lazy(() => import("../page/upload/UploadProcess"));
const Question = lazy(() => import("../page/profile/security/Question"));
const CheckAnswer = lazy(
  () => import("../components/profile/auth/check-answer")
);
const Answer = lazy(() => import("../page/profile/security/Answer"));
const Manage = lazy(() => import("../page/profile/security/Manage"));
const AddBio = lazy(() => import("../components/profile/add-bio"));
const ForgotPassword = lazy(
  () => import("../components/profile/auth/forgot-password")
);
const ResetPassword = lazy(
  () => import("../components/profile/auth/reset-password")
);

const Routing = () => {
  // Create a wrapper component that includes SafeLazyLoad for error handling
  const withErrorHandling = (Component: ReactNode) => {
    return {
      element: (
        <SafeLazyLoad>
          {Component}
        </SafeLazyLoad>
      ),
      // On route error, navigate to home page
      errorElement: <Navigate to="/" replace />
    };
  };

  const routes = [
    {
      path: paths.login,
      ...withErrorHandling(<Login />)
    },
    {
      path: paths.regiter,
      ...withErrorHandling(<Register />)
    },
    {
      path: paths.forgot_password,
      ...withErrorHandling(<ForgotPassword />)
    },
    {
      path: paths.reset_password,
      ...withErrorHandling(<ResetPassword />)
    },
    {
      path: paths.upload,
      ...withErrorHandling(<RootLayout><UploadComponent /></RootLayout>)
    },
    {
      path: paths.upload_process,
      ...withErrorHandling(<UploadProcess />)
    },
    {
      path: paths.otp,
      ...withErrorHandling(<OTP />)
    },
    {
      path: paths.security_questions,
      ...withErrorHandling(<SecurityQuestion />)
    },
    {
      path: paths.check_answer,
      ...withErrorHandling(<Question />)
    },
    {
      path: paths.check_answer2,
      ...withErrorHandling(<CheckAnswer />)
    },
    {
      path: paths.answer,
      ...withErrorHandling(<Answer />)
    },
    {
      path: paths.manage,
      ...withErrorHandling(<Manage />)
    },
    {
      path: paths.home,
      ...withErrorHandling(<RootLayout><Home /></RootLayout>)
    },
    {
      path: paths.add_bio,
      ...withErrorHandling(<RootLayout><AddBio /></RootLayout>)
    },
    {
      path: paths.explore,
      ...withErrorHandling(<RootLayout><Explore /></RootLayout>)
    },
    {
      path: paths.application,
      ...withErrorHandling(<RootLayout><Application /></RootLayout>)
    },
    {
      path: paths.profile,
      ...withErrorHandling(<RootLayout><Profile /></RootLayout>)
    },
    {
      path: paths.user_profile,
      ...withErrorHandling(<RootLayout><OtherProfile /></RootLayout>)
    },
    {
      path: paths.profileDetail,
      ...withErrorHandling(<ProfileDetail />)
    },
    {
      path: paths.settings,
      ...withErrorHandling(<Settings />)
    },
    {
      path: paths.privacy_settings,
      ...withErrorHandling(<PrivacySettings />)
    },
    {
      path: paths.noti,
      ...withErrorHandling(<Noti />)
    },
    {
      path: paths.noti_detail,
      ...withErrorHandling(<NotiDetail />)
    },
    {
      path: paths.system_noti,
      ...withErrorHandling(<SystemNoti />)
    },
    {
      path: paths.balance_noti,
      ...withErrorHandling(<BalanceNoti />)
    },
    {
      path: paths.recommand_more,
      ...withErrorHandling(<More />)
    },
    {
      path: "*",
      element: <h1>Page Not Found!</h1>,
      errorElement: <Navigate to="/" replace />
    },
    {
      path: paths.wallet,
      ...withErrorHandling(<Wallet />)
    },
    {
      path: paths.wallet_invite,
      ...withErrorHandling(<Invite />)
    },
    {
      path: paths.wallet_history,
      ...withErrorHandling(<TranHist />)
    },
    {
      path: paths.wallet_income,
      ...withErrorHandling(<TranHist />)
    },
    {
      path: paths.wallet_recharge,
      ...withErrorHandling(<Recharge />)
    },
    {
      path: paths.wallet_withdraw,
      ...withErrorHandling(<Withdraw />)
    },
    {
      path: paths.search,
      ...withErrorHandling(<Search />)
    },
    {
      path: paths.search_result,
      ...withErrorHandling(<Results />)
    },
    {
      path: paths.vod_details,
      ...withErrorHandling(<VodDetails />)
    },
    {
      path: paths.reports,
      ...withErrorHandling(<Report />)
    },
    {
      path: paths.create_center,
      ...withErrorHandling(<CreateCenter />)
    },
    {
      path: paths.your_videos,
      ...withErrorHandling(<YourVideos />)
    },
    {
      path: paths.video_detail,
      ...withErrorHandling(<VideoDetails />)
    },
    {
      path: paths.recycle,
      ...withErrorHandling(<Recycle />)
    },
    {
      path: paths.ranking,
      ...withErrorHandling(<RootLayout><Ranking /></RootLayout>)
    },
    {
      path: paths.creator_upload,
      ...withErrorHandling(<CreatorUpload />)
    },
    {
      path: paths.creator_upload_video,
      ...withErrorHandling(<VideoUpload />)
    },
    {
      path: paths.tags,
      ...withErrorHandling(<Tags />)
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default Routing;
