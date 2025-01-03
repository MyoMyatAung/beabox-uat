import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";
import More from "@/page/explore/comp/More";
import Wallet from "@/page/wallet/Wallet";
import Invite from "@/page/wallet/comp/Invite";
import TranHist from "@/page/wallet/comp/TranHist";

const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
const Profile = lazy(() => import("../page/profile/Profile"));
const ProfileDetail = lazy(() => import("../page/profile/ProfileDetail"));
const Settings = lazy(() => import("../page/profile/Settings"));
const Noti = lazy(() => import("../page/profile/noti/Noti"));
const SystemNoti = lazy(() => import("../page/profile/noti/SystemNoti"));
const BalanceNoti = lazy(() => import("../page/profile/noti/BalanceNoti"));
const SecurityQuestion = lazy(() => import("../page/profile/SecurityQuestion"));
const Login = lazy(() => import("../page/auth/Login"));
const Register = lazy(() => import("../page/auth/Register"));
const OTP = lazy(() => import("../page/auth/OTP"));
const UploadComponent = lazy(() => import("../page/upload/Upload"));
const UploadProcess = lazy(() => import("../page/upload/UploadProcess"));

const Routing = () => {
  const router = createBrowserRouter([
    {
      path: paths.login,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: paths.regiter,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Register />
        </Suspense>
      ),
    },
    {
      path: paths.upload,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <RootLayout>
            <UploadComponent />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.upload_process,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <UploadProcess />
        </Suspense>
      ),
    },
    {
      path: paths.otp,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <OTP />
        </Suspense>
      ),
    },
    {
      path: paths.security_questions,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <SecurityQuestion />
        </Suspense>
      ),
    },
    {
      path: paths.home,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <RootLayout>
            <Home />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.explore,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <RootLayout>
            <Explore />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.application,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <RootLayout>
            <Application />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.profile,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <RootLayout>
            <Profile />
          </RootLayout>
        </Suspense>
      ),
    },
    {
      path: paths.profileDetail,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <ProfileDetail />
        </Suspense>
      ),
    },
    {
      path: paths.settings,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Settings />
        </Suspense>
      ),
    },
    {
      path: paths.noti,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Noti />
        </Suspense>
      ),
    },
    {
      path: paths.system_noti,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <SystemNoti />
        </Suspense>
      ),
    },
    {
      path: paths.balance_noti,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <BalanceNoti />
        </Suspense>
      ),
    },
    {
      path: paths.recommand_more,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <More />
        </Suspense>
      ),
    },
    // {
    //   path: paths.settings,
    //   element: (
    //     <Suspense fallback={<p>loading...</p>}>
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
        <Suspense fallback={<p>loading...</p>}>
          <Wallet />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_invite,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <Invite />
        </Suspense>
      ),
    },
    {
      path: paths.wallet_history,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <TranHist />
        </Suspense>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routing;
