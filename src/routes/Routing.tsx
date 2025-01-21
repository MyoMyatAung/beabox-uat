import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";
import More from "@/page/explore/comp/More";
import Wallet from "@/page/wallet/Wallet";
import Invite from "@/page/wallet/comp/Invite";
import TranHist from "@/page/wallet/comp/TranHist";
import Loader from "@/components/shared/loader";
import Recharge from "@/page/wallet/page/Recharge";
import Withdraw from "@/page/wallet/page/Withdraw";
import Search from "@/page/search/Search";
import Results from "@/page/search/page/Results";
import VodDetails from "@/page/explore/comp/VodDetails";

const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
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
const Answer = lazy(() => import("../page/profile/security/Answer"));
const Manage = lazy(() => import("../page/profile/security/Manage"));

const Routing = () => {
  const router = createBrowserRouter([
    {
      path: paths.login,
      element: (
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: paths.regiter,
      element: (
        <Suspense fallback={<Loader />}>
          <Register />
        </Suspense>
      ),
    },
    {
      path: paths.upload,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <UploadComponent />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.upload_process,
      element: (
        <Suspense fallback={<Loader />}>
          <UploadProcess />
        </Suspense>
      ),
    },
    {
      path: paths.otp,
      element: (
        <Suspense fallback={<Loader />}>
          <OTP />
        </Suspense>
      ),
    },
    {
      path: paths.security_questions,
      element: (
        <Suspense fallback={<Loader />}>
          <SecurityQuestion />
        </Suspense>
      ),
    },
    {
      path: paths.question,
      element: (
        <Suspense fallback={<Loader />}>
          <Question />
        </Suspense>
      ),
    },
    {
      path: paths.answer,
      element: (
        <Suspense fallback={<Loader />}>
          <Answer />
        </Suspense>
      ),
    },
    {
      path: paths.manage,
      element: (
        <Suspense fallback={<Loader />}>
          <Manage />
        </Suspense>
      ),
    },
    {
      path: paths.home,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <Home />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.explore,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <Explore />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.application,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <Application />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.profile,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <Profile />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.user_profile,
      element: (
        <Suspense fallback={<Loader />}>
          <RootLayout>
            <OtherProfile />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.profileDetail,
      element: (
        <Suspense fallback={<Loader />}>
          <ProfileDetail />
        </Suspense>
      ),
    },
    {
      path: paths.settings,
      element: (
        <Suspense fallback={<Loader />}>
          <Settings />
        </Suspense>
      ),
    },
    {
      path: paths.privacy_settings,
      element: (
        <Suspense fallback={<Loader />}>
          <PrivacySettings />
        </Suspense>
      ),
    },
    {
      path: paths.noti,
      element: (
        <Suspense fallback={<Loader />}>
          <Noti />
        </Suspense>
      ),
    },
    {
      path: paths.noti_detail,
      element: (
        <Suspense fallback={<Loader />}>
          <NotiDetail />
        </Suspense>
      ),
    },
    {
      path: paths.system_noti,
      element: (
        <Suspense fallback={<Loader />}>
          <SystemNoti />
        </Suspense>
      ),
    },
    {
      path: paths.balance_noti,
      element: (
        <Suspense fallback={<Loader />}>
          <BalanceNoti />
        </Suspense>
      ),
    },
    {
      path: paths.recommand_more,
      element: (
        <Suspense fallback={<Loader />}>
          <More />
        </Suspense>
      ),
    },
    // {
    //   path: paths.settings,
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <Settings />
    //       path: paths.recommand_more, element: (
    //       <Suspense fallback={<p>Panding..</p>}>
    //         <More />
    //       </Suspense>
    //     </Suspense>
    //   ),
    // },
    {
      path: "*",
      element: (
        <Suspense>
          <h1>Page Not Found!</h1>
        </Suspense>
      ),
    },
    {
      path: paths.wallet,
      element: (
        <Suspense fallback={<Loader />}>
          <Wallet />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_invite,
      element: (
        <Suspense fallback={<Loader />}>
          <Invite />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_history,
      element: (
        <Suspense fallback={<Loader />}>
          <TranHist />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_recharge,
      element: (
        <Suspense fallback={<Loader />}>
          <Recharge />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_withdraw,
      element: (
        <Suspense fallback={<Loader />}>
          <Withdraw />
        </Suspense>
      ),
    },
    {
      path: paths.search,
      element: (
        <Suspense fallback={<Loader />}>
          <Search />
        </Suspense>
      ),
    },
    {
      path: paths.search_result,
      element: (
        <Suspense fallback={<Loader />}>
          <Results />
        </Suspense>
      ),
    },
    {
      path: paths.vod_details,
      element: (
        <Suspense fallback={<Loader />}>
          <VodDetails />
        </Suspense>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routing;
