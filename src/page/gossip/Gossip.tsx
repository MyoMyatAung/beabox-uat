import { useState, useEffect, useMemo } from "react";
import type { ComponentProps } from "react";
import { useDispatch } from "react-redux";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import GossipTopNavbar from "./components/GossipTopNavbar";
import GossipPost from "./components/GossipPost";
import { useGetGossipPostsQuery as useExternalGossipPostsQuery } from "./services/gossipSlice";
import type { GossipPostMedia } from "./services/gossipSlice";

type TabType = "hot" | "encyclopedia" | "celebrity";

interface Tab {
  id: TabType;
  label: string;
  categoryId: string;
}

const tabs: Tab[] = [
  // Mapping each tab to the remote category ids returned by the external API
  { id: "hot", label: "热门大瓜", categoryId: "692fef5f317b970b85090927" }, // Fitness
  {
    id: "encyclopedia",
    label: "吃瓜百科",
    categoryId: "692fef5f317b970b85090923",
  }, // Food
  {
    id: "celebrity",
    label: "网红黑料",
    categoryId: "692fef5f317b970b85090926",
  }, // Gaming
];

const Gossip = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("encyclopedia");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const hasCategoryId = Boolean(activeTabConfig?.categoryId);

  // Ensure bottom nav is visible on gossip page
  useEffect(() => {
    dispatch(sethideNew(false));
  }, [dispatch]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabType);
    setPage(1); // Reset page when switching tabs
  };

  const {
    data: apiPosts = [],
    isLoading,
    error,
    refetch,
  } = useExternalGossipPostsQuery(
    {
      category_id: activeTabConfig?.categoryId ?? "",
      page,
      pageSize,
    },
    {
      skip: !hasCategoryId,
    }
  );

  type GossipPostData = ComponentProps<typeof GossipPost>["post"];

  const posts: GossipPostData[] = useMemo(() => {
    if (!apiPosts?.length) {
      return [];
    }

    return apiPosts.map((post, index) => {
      const nickname = post.user?.nickname?.trim() || "匿名用户";
      const userId =
        post.user?.id !== undefined ? String(post.user.id) : `user-${index}`;

      const mediaItems: GossipPostData["media"] = Array.isArray(post.media)
        ? post.media
            .filter((item): item is GossipPostMedia =>
              Boolean(item && item.url)
            )
            .map((item, mediaIndex) => ({
              id: `${post.id || `post-${index}`}-media-${mediaIndex}`,
              type: item.type === "video" ? "video" : "image",
              url:
                item.type === "video"
                  ? "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  : item.url,
              thumbnail: item.thumbnail,
            }))
        : [];

      return {
        post_id: post.id || `post-${index}`,
        user: {
          id: userId,
          username: nickname,
          profile_photo:
            post.user?.profile_image ||
            `https://api.dicebear.com/7.x/initials/svg?background=%23121016&seed=${encodeURIComponent(
              nickname
            )}`,
          is_verified: false,
          level: "Lv1",
          level_badge_color: "#9333EA",
        },
        content: post.description || "",
        media: mediaItems,
        like_count: Number(post.like_count ?? 0),
        comment_count: Number(post.comment_count ?? 0),
        share_count: Number(post.share_count ?? 0),
        is_liked: Boolean(post.is_liked),
        created_at: post.created_at || new Date().toISOString(),
      };
    });
  }, [apiPosts]);

  const errorMessage = useMemo(() => {
    if (!hasCategoryId) {
      return "当前频道暂未配置分类，请稍后再试";
    }

    if (!error) {
      return null;
    }

    if ("status" in error) {
      const errData = error.data as { message?: string };
      return errData?.message || "帖子加载失败，请稍后重试";
    }

    return error.message || "帖子加载失败，请稍后重试";
  }, [error, hasCategoryId]);

  const showEmptyState = !isLoading && !errorMessage && posts.length === 0;

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* Header Tabs */}
      <GossipTopNavbar
        tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {/* Content Area - Scrollable Posts */}
      <div className="w-full h-[calc(100vh-136px)] bg-black overflow-y-auto pb-20">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
            <p className="text-red-400 text-sm">{errorMessage}</p>
            {hasCategoryId && (
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
              >
                重新加载
              </button>
            )}
          </div>
        )}

        {showEmptyState && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-sm">暂无内容</div>
          </div>
        )}

        {!isLoading && !errorMessage && posts.length > 0 && (
          <div className="w-full max-w-[480px] mx-auto">
            {posts.map((post) => (
              <GossipPost key={post.post_id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gossip;
