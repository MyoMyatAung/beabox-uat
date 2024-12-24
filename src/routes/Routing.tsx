import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";
import More from "@/page/explore/comp/More";
import Wallet from "@/page/wallet/Wallet";
import Invite from "@/page/wallet/comp/Invite";

const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
const Profile = lazy(() => import("../page/profile/Profile"));
const ProfileDetail = lazy(() => import("../page/profile/ProfileDetail"));
const Settings = lazy(() => import("../page/profile/Settings"));
const Login = lazy(() => import("../page/auth/Login"));
const Register = lazy(() => import("../page/auth/Register"));
const OTP = lazy(() => import("../page/auth/OTP"));

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
      path: paths.otp,
      element: (
        <Suspense fallback={<p>loading...</p>}>
          <OTP />
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
  ]);
  return <RouterProvider router={router} />;
};

export default Routing;
