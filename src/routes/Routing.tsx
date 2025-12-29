/**
 * Routing Configuration Module
 *
 * This module defines the application's routing structure using React Router v6.
 * It implements lazy loading for code splitting, error handling, and conditional
 * route registration based on device/platform requirements.
 *
 * Key Features:
 * - Lazy loading for performance optimization
 * - Error boundary handling with SafeLazyLoad
 * - Dual password protection for sensitive routes
 * - Platform-specific routes (iOS WebView only)
 * - Centralized route configuration for maintainability
 *
 * Design Principles:
 * - Single Responsibility: Each function handles a specific aspect of routing
 * - Open/Closed: Easy to extend with new routes without modifying existing code
 * - Dependency Inversion: Route creation logic is abstracted and reusable
 */

import { lazy, ReactNode, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  RouteObject,
} from "react-router-dom";
import { paths } from "./paths";
import RootLayout from "@/layouts/RootLayout";
import DualPasswordGuard from "@/components/DualPasswordGuard";
import SafeLazyLoad from "@/components/SafeLazyLoad";
import { isIOSWebView } from "@/lib/deviceInfo";

// Import non-lazy components (used for immediate rendering)
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
import CreatorNoti from "@/page/profile/noti/CreatorNoti";
import Detail from "@/page/home/components/Detail";
import Download from "@/page/download/Download";

// ============================================================================
// LAZY LOADED COMPONENTS - Auth & Security
// ============================================================================
// These components are lazy-loaded to improve initial bundle size and load time
const Login = lazy(() => import("../page/auth/Login"));
const Register = lazy(() => import("../page/auth/Register"));
const OTP = lazy(() => import("../page/auth/OTP"));
const ForgotPassword = lazy(
  () => import("../components/profile/auth/forgot-password")
);
const ResetPassword = lazy(
  () => import("../components/profile/auth/reset-password")
);
const PinEntry = lazy(() => import("../page/profile/security/PinEntry"));
const SecurityQuestion = lazy(() => import("../page/profile/SecurityQuestion"));
const Question = lazy(() => import("../page/profile/security/Question"));
const CheckAnswer = lazy(
  () => import("../components/profile/auth/check-answer")
);
const Answer = lazy(() => import("../page/profile/security/Answer"));
const Manage = lazy(() => import("../page/profile/security/Manage"));

// ============================================================================
// LAZY LOADED COMPONENTS - Security Settings (iOS WebView Only)
// ============================================================================
const DualAccessPassword = lazy(
  () => import("../page/profile/security/DualAccessPassword")
);
const MasterPassword = lazy(
  () => import("../page/profile/security/MasterPassword")
);
const DecoyPassword = lazy(
  () => import("../page/profile/security/DecoyPassword")
);

// ============================================================================
// LAZY LOADED COMPONENTS - Main Application Pages
// ============================================================================
const Home = lazy(() => import("../page/home/Home"));
const Explore = lazy(() => import("../page/explore/Explore"));
const Application = lazy(() => import("../page/application/Application"));
const Lucky = lazy(() => import("../page/luckywheel/LuckySpinPage"));
const LuckyDraw = lazy(() => import("../page/events/Luckydraw"));
const Gossip = lazy(() => import("../page/gossip/Gossip"));
const GossipPostDetail = lazy(() => import("../page/gossip/PostDetail"));
const GossipReport = lazy(() => import("../page/gossip/components/GossipReport"));

// ============================================================================
// LAZY LOADED COMPONENTS - Profile & User Management
// ============================================================================
const Profile = lazy(() => import("../page/profile/Profile"));
const OtherProfile = lazy(() => import("../page/profile/OtherProfile"));
const ProfileDetail = lazy(() => import("../page/profile/ProfileDetail"));
const Settings = lazy(() => import("../page/profile/Settings"));
const PrivacySettings = lazy(() => import("../page/profile/PrivacySettings"));
const AddBio = lazy(() => import("../components/profile/add-bio"));
const UserFeedSet = lazy(() => import("../page/profile/security/UserFeedSet"));

// ============================================================================
// LAZY LOADED COMPONENTS - Notifications
// ============================================================================
const Noti = lazy(() => import("../page/profile/noti/Noti"));
const NotiDetail = lazy(() => import("../page/profile/noti/NotiDetail"));
const SystemNoti = lazy(() => import("../page/profile/noti/SystemNoti"));
const BalanceNoti = lazy(() => import("../page/profile/noti/BalanceNoti"));

// ============================================================================
// LAZY LOADED COMPONENTS - Content Creation
// ============================================================================
const CreateCenter = lazy(() => import("../page/create-center/CreateCenter"));
const CreatorUpload = lazy(() => import("../page/create-center/CreatorUpload"));
const VideoUpload = lazy(() => import("../page/create-center/VideoUpload"));
const VideoDetails = lazy(() => import("../page/create-center/VideoDetails"));
const YourVideos = lazy(() => import("../page/create-center/YourVideos"));
const Recycle = lazy(() => import("../page/create-center/Recycle"));
const Tags = lazy(() => import("../page/create-center/Tags"));
const Ranking = lazy(() => import("../page/create-center/Ranking"));

// ============================================================================
// LAZY LOADED COMPONENTS - Upload
// ============================================================================
const UploadComponent = lazy(() => import("../page/upload/Upload"));
const UploadProcess = lazy(() => import("../page/upload/UploadProcess"));

// ============================================================================
// ROUTE CONFIGURATION TYPES
// ============================================================================

/**
 * Configuration options for route wrapping behavior
 */
interface RouteWrapperOptions {
  /** Skip password guard for public routes (e.g., login, register) */
  skipPasswordGuard?: boolean;
  /** Skip SafeLazyLoad for non-lazy components (e.g., RootLayout) */
  skipSafeLazyLoad?: boolean;
}

/**
 * Route configuration helper that returns a RouteObject
 */
type RouteConfig = (
  path: string,
  component: ReactNode,
  options?: RouteWrapperOptions
) => RouteObject;

// ============================================================================
// ROUTE WRAPPER FACTORY
// ============================================================================

/**
 * Creates a route wrapper function that applies error handling, lazy loading,
 * and authentication guards consistently across all routes.
 *
 * This factory function implements the Dependency Inversion Principle by
 * abstracting route creation logic, making it easy to modify route behavior
 * in one place.
 *
 * @param defaultOptions - Default options to apply to all routes
 * @returns A function that creates route configurations with consistent wrapping
 */
const createRouteWrapper =
  (defaultOptions: RouteWrapperOptions = {}): RouteConfig =>
  (path, component, options = {}) => {
    // Merge default options with route-specific options
    const finalOptions = { ...defaultOptions, ...options };
    const { skipPasswordGuard = false, skipSafeLazyLoad = false } =
      finalOptions;

    let wrappedComponent: ReactNode;

    // Determine wrapping strategy based on options
    if (skipSafeLazyLoad) {
      // For non-lazy components (like RootLayout), skip SafeLazyLoad wrapper
      wrappedComponent = skipPasswordGuard ? (
        component
      ) : (
        <DualPasswordGuard>{component}</DualPasswordGuard>
      );
    } else {
      // For lazy-loaded components, wrap with SafeLazyLoad for Suspense and error handling
      wrappedComponent = skipPasswordGuard ? (
        <SafeLazyLoad>{component}</SafeLazyLoad>
      ) : (
        <DualPasswordGuard>
          <SafeLazyLoad>{component}</SafeLazyLoad>
        </DualPasswordGuard>
      );
    }

    return {
      path,
      element: wrappedComponent,
      // Redirect to home page on any route error
      errorElement: <Navigate to={paths.home} replace />,
    };
  };

// ============================================================================
// ROUTE CONFIGURATION BUILDERS
// ============================================================================

/**
 * Creates the home route with nested children routes.
 * This route uses RootLayout as the parent layout component.
 */
const createHomeRoute = (createRoute: RouteConfig): RouteObject => {
  const baseRoute = createRoute(
    paths.home,
    <RootLayout />,
    { skipSafeLazyLoad: true } // RootLayout is not lazy-loaded
  );

  // Explicitly construct the route to avoid type conflicts with spread operator
  return {
    path: baseRoute.path,
    element: baseRoute.element,
    errorElement: baseRoute.errorElement,
    children: [
      {
        index: true,
        element: (
          <DualPasswordGuard>
            <SafeLazyLoad>
              <Home />
            </SafeLazyLoad>
          </DualPasswordGuard>
        ),
      },
      {
        path: paths.application,
        element: (
          <DualPasswordGuard>
            <SafeLazyLoad>
              <Application />
            </SafeLazyLoad>
          </DualPasswordGuard>
        ),
      },
      {
        path: paths.profile,
        element: (
          <DualPasswordGuard>
            <SafeLazyLoad>
              <Profile />
            </SafeLazyLoad>
          </DualPasswordGuard>
        ),
      },
      {
        path: paths.ranking,
        element: (
          <DualPasswordGuard>
            <SafeLazyLoad>
              <Ranking />
            </SafeLazyLoad>
          </DualPasswordGuard>
        ),
      },
      {
        path: paths.gossip,
        element: (
          <DualPasswordGuard>
            <SafeLazyLoad>
              <Gossip />
            </SafeLazyLoad>
          </DualPasswordGuard>
        ),
      },
    ],
  };
};

/**
 * Creates authentication-related routes.
 * These routes skip password guard as they are public access points.
 */
const createAuthRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.login, <Login />, { skipPasswordGuard: true }),
  createRoute(paths.regiter, <Register />, { skipPasswordGuard: true }),
  createRoute(paths.forgot_password, <ForgotPassword />, {
    skipPasswordGuard: true,
  }),
  createRoute(paths.reset_password, <ResetPassword />, {
    skipPasswordGuard: true,
  }),
  createRoute(paths.otp, <OTP />, { skipPasswordGuard: true }),
];

/**
 * Creates security-related routes.
 * These routes handle password management and security questions.
 */
const createSecurityRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.security_questions, <SecurityQuestion />),
  createRoute(paths.check_answer, <Question />),
  createRoute(paths.check_answer2, <CheckAnswer />),
  createRoute(paths.answer, <Answer />),
  createRoute(paths.manage, <Manage />),
];

/**
 * Creates iOS WebView-specific security routes.
 * These routes are only available when running in an iOS WebView context.
 */
const createIOSSecurityRoutes = (createRoute: RouteConfig): RouteObject[] => {
  if (!isIOSWebView()) {
    return [];
  }

  return [
    // Pin entry route (public, doesn't require password guard)
    createRoute(paths.pinEntry, <PinEntry />, { skipPasswordGuard: true }),
    // Password management routes (protected)
    createRoute(paths.dual_access_password, <DualAccessPassword />),
    createRoute(paths.master_password, <MasterPassword />),
    createRoute(paths.decoy_password, <DecoyPassword />),
  ];
};

/**
 * Creates upload-related routes.
 */
const createUploadRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.upload, <UploadComponent />),
  createRoute(paths.upload_process, <UploadProcess />),
];

/**
 * Creates main application routes.
 * These are the primary navigation routes for the app.
 */
const createMainRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.explore, <Explore />),
  createRoute(paths.lucky, <Lucky />),
  createRoute(paths.add_bio, <AddBio />),
  createRoute(paths.download, <Download />),
  createRoute(paths.recommand_more, <More />),
  createRoute(paths.gossip_post_detail, <GossipPostDetail />),
  createRoute(paths.gossip_report, <GossipReport />),
];

/**
 * Creates profile and user management routes.
 */
const createProfileRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.user_profile, <OtherProfile />),
  createRoute(paths.profileDetail, <ProfileDetail />),
  createRoute(paths.settings, <Settings />),
  createRoute(paths.privacy_settings, <PrivacySettings />),
  createRoute(paths.user_feed, <UserFeedSet />),
];

/**
 * Creates notification-related routes.
 */
const createNotificationRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.noti, <Noti />),
  createRoute(paths.noti_detail, <NotiDetail />),
  createRoute(paths.system_noti, <SystemNoti />),
  createRoute(paths.balance_noti, <BalanceNoti />),
  createRoute(paths.creator_noti, <CreatorNoti />),
];

/**
 * Creates wallet and financial routes.
 */
const createWalletRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.wallet, <Wallet />),
  createRoute(paths.wallet_invite, <Invite />),
  createRoute(paths.wallet_history, <TranHist />),
  createRoute(paths.wallet_income, <TranHist />),
  createRoute(paths.wallet_recharge, <Recharge />),
  createRoute(paths.wallet_withdraw, <Withdraw />),
];

/**
 * Creates content creation and management routes.
 */
const createContentCreationRoutes = (
  createRoute: RouteConfig
): RouteObject[] => [
  createRoute(paths.create_center, <CreateCenter />),
  createRoute(paths.your_videos, <YourVideos />),
  createRoute(paths.video_detail, <VideoDetails />),
  createRoute(paths.recycle, <Recycle />),
  createRoute(paths.creator_upload, <CreatorUpload />),
  createRoute(paths.creator_upload_video, <VideoUpload />),
  createRoute(paths.tags, <Tags />),
];

/**
 * Creates search and discovery routes.
 */
const createSearchRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.search, <Search />),
  createRoute(paths.search_result, <Results />),
  createRoute(paths.vod_details, <VodDetails />),
];

/**
 * Creates event and activity routes.
 */
const createEventRoutes = (createRoute: RouteConfig): RouteObject[] => [
  createRoute(paths.lucky_draw, <LuckyDraw />),
  createRoute(paths.story_detail, <Detail />),
  createRoute(paths.reports, <Report />),
];

/**
 * Creates the catch-all 404 route.
 * This route must be placed last in the routes array.
 */
const createNotFoundRoute = (): RouteObject => ({
  path: "*",
  element: <h1>Page Not Found!</h1>,
  errorElement: <Navigate to={paths.home} replace />,
});

// ============================================================================
// MAIN ROUTING COMPONENT
// ============================================================================

/**
 * Main Routing Component
 *
 * This component configures and provides the application router.
 * It aggregates all route configurations using the builder functions above,
 * ensuring a clean separation of concerns and easy maintainability.
 *
 * Performance optimizations:
 * - Routes are memoized to prevent unnecessary re-creation on re-renders
 * - Lazy loading reduces initial bundle size
 * - Error boundaries prevent entire app crashes
 */
const Routing = () => {
  // Create route wrapper with default options
  const createRoute = useMemo(() => createRouteWrapper(), []);

  // Aggregate all route configurations
  // Routes are organized by feature for better maintainability
  const routes = useMemo<RouteObject[]>(
    () => [
      // Authentication routes (public, no password guard)
      ...createAuthRoutes(createRoute),

      // Security routes (protected)
      ...createSecurityRoutes(createRoute),

      // iOS WebView-specific routes (conditional)
      ...createIOSSecurityRoutes(createRoute),

      // Upload routes
      ...createUploadRoutes(createRoute),

      // Home route with nested children
      createHomeRoute(createRoute),

      // Main application routes
      ...createMainRoutes(createRoute),

      // Profile and user management routes
      ...createProfileRoutes(createRoute),

      // Notification routes
      ...createNotificationRoutes(createRoute),

      // Wallet and financial routes
      ...createWalletRoutes(createRoute),

      // Content creation routes
      ...createContentCreationRoutes(createRoute),

      // Search and discovery routes
      ...createSearchRoutes(createRoute),

      // Event and activity routes
      ...createEventRoutes(createRoute),

      // 404 catch-all route (must be last)
      createNotFoundRoute(),
    ],
    [createRoute]
  );

  // Create router instance with all configured routes
  const router = useMemo(() => createBrowserRouter(routes), [routes]);

  return <RouterProvider router={router} />;
};

export default Routing;
