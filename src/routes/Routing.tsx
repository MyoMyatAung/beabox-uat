import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";

const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
const Profile = lazy(() => import("../page/profile/Profile"));

const Routing = () => {
  const router = createBrowserRouter([
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
      path: "*",
      element: (
        <Suspense>
          <h1>Page Not Found!</h1>
        </Suspense>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routing;
