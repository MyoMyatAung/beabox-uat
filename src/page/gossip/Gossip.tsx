import { useState, useEffect, useMemo } from "react";
import type { ComponentProps } from "react";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import GossipTopNavbar from "./components/GossipTopNavbar";
import GossipPost from "./components/GossipPost";
import {
  useGetGossipPostsQuery as useExternalGossipPostsQuery,
  useGetGossipCategoriesQuery,
} from "./services/gossipSlice";
import type { GossipPostMedia } from "./services/gossipSlice";

interface Tab {
  id: string;
  label: string;
  categoryId: string;
}

const PostSkeleton = () => (
  <div className="px-4 py-3 animate-pulse space-y-3 mb-4">
    <div className="flex gap-3">
      <div className="w-9 h-9 bg-[#221d2a] rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="w-52 h-4 bg-[#221d2a] rounded-md" />
        <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
        <div className="w-36 h-4 bg-[#221d2a] rounded-md" />
      </div>
    </div>
    <div className="flex gap-3 overflow-x-auto">
      <div className="w-[220px] h-[236px] bg-[#221d2a] rounded-md" />
      <div className="w-[220px] h-[236px] bg-[#221d2a] rounded-md" />
    </div>
    <div className="flex justify-between">
      <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
      <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const GOSSIP_TAB_STORAGE_KEY = "gossip-active-tab";

const Gossip = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem(GOSSIP_TAB_STORAGE_KEY) || "";
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [posts, setPosts] = useState<
    ComponentProps<typeof GossipPost>["post"][]
  >([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: categoryList = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetGossipCategoriesQuery();

  const tabs: Tab[] = useMemo(() => {
    if (!Array.isArray(categoryList)) {
      return [];
    }

    return categoryList.map((category, index) => ({
      id: category.slug || category.id || `category-${index}`,
      label: category.name || `分类${index + 1}`,
      categoryId: category.id,
    }));
  }, [categoryList]);

  useEffect(() => {
    if (!tabs.length) {
      return;
    }

    if (activeTab) {
      const existsInTabs = tabs.some((tab) => tab.id === activeTab);
      if (!existsInTabs) {
        setActiveTab(tabs[0].id);
      }
      return;
    }

    setActiveTab(tabs[0].id);
  }, [activeTab, tabs]);

  useEffect(() => {
    if (!activeTab || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(GOSSIP_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const hasCategoryId = Boolean(activeTabConfig?.categoryId);

  // Ensure bottom nav is visible on gossip page
  useEffect(() => {
    dispatch(sethideNew(false));
  }, [dispatch]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1); // Reset page when switching tabs
  };

  const {
    data: apiPostsResponse,
    isLoading: isPostsLoading,
    isFetching: isPostsFetching,
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
  const isLoading =
    isCategoriesLoading || isPostsLoading || isPostsFetching || !hasCategoryId;

  type GossipPostData = ComponentProps<typeof GossipPost>["post"];

  const mappedApiPosts: GossipPostData[] = useMemo(() => {
    if (!apiPostsResponse?.data?.length) return [];

    return apiPostsResponse.data.map((post, index) => {
      const nickname = post.user?.nickname?.trim() || "匿名用户";
      const userId =
        post.user?.id !== undefined ? String(post.user.id) : `user-${index}`;

      const mediaItems: GossipPostData["media"] = Array.isArray(post.media)
        ? post.media
            .filter((item): item is GossipPostMedia =>
              Boolean(item && (item.url || item.download_url))
            )
            .map((item, mediaIndex) => {
              const mediaUrl = item.download_url || item.url || "";
              return {
                id: `${post.id || `post-${index}`}-media-${mediaIndex}`,
                type: item.type === "video" ? "video" : "image",
                url: mediaUrl,
                download_url: item.download_url,
                thumbnail_url: (item as any).thumbnail_url,
              };
            })
        : [];

      return {
        post_id: post.id || `post-${index}`,
        category_id: post.category_id || "",
        user: {
          id: userId,
          nickname: nickname,
          profile_image: post.user?.profile_image || "",
          is_following: post.user?.is_following ?? false,
          badge: post.user?.badge ?? "",
          level: post.user?.level ?? "",
        },
        content: post.description || "",
        media: mediaItems,
        like_count: Number(post.like_count ?? 0),
        comment_count: Number(post.comment_count ?? 0),
        share_count: Number(post.share_count ?? 0),
        share_link: post.share_link || "",
        is_liked: Boolean(post.is_liked),
        created_at: post.created_at || new Date().toISOString(),
        time_ago: post.time_ago || "",
      };
    });
  }, [apiPostsResponse]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
  }, [activeTab]);

  useEffect(() => {
    if (!apiPostsResponse) return;

    const merged = mappedApiPosts;

    setPosts((prev) => {
      if (page === 1) {
        return merged;
      }

      const existingIds = new Set(prev.map((item) => item.post_id));
      const combined = [...prev];

      merged.forEach((item) => {
        if (!existingIds.has(item.post_id)) {
          combined.push(item);
        }
      });

      return combined;
    });

    const pagination = apiPostsResponse.pagination;
    if (pagination) {
      setHasMore(pagination.current_page < pagination.last_page);
    } else {
      setHasMore(merged.length >= pageSize);
    }
  }, [apiPostsResponse, mappedApiPosts, page, pageSize]);

  const loadMorePosts = () => {
    if (isPostsFetching || isCategoriesLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const isInitialLoading =
    (isCategoriesLoading || isPostsLoading || !hasCategoryId) &&
    posts.length === 0;

  const errorMessage = useMemo(() => {
    if (!tabs.length && !isCategoriesLoading) {
      return "当前频道暂未配置分类，请稍后再试";
    }

    if (categoriesError && "message" in (categoriesError as any)) {
      return (
        ((categoriesError as { message?: string }).message as string) ||
        "频道加载失败，请稍后重试"
      );
    }

    if (!error) {
      return null;
    }

    if ("status" in error) {
      const errData = error.data as { message?: string };
      return errData?.message || "帖子加载失败，请稍后重试";
    }

    return error.message || "帖子加载失败，请稍后重试";
  }, [tabs.length, isCategoriesLoading, categoriesError, error]);

  const showEmptyState =
    !isInitialLoading && !errorMessage && posts.length === 0;

  return (
    <div className="w-full h-svh bg-[#16131C] overflow-hidden">
      {/* Header Tabs */}
      <GossipTopNavbar
        tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {/* Content Area - Scrollable Posts */}
      {isInitialLoading ? (
        <div className="w-full max-w-[480px] mx-auto">
          {Array.from({ length: 2 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div
          id="gossip-scroll-container"
          className="w-full h-[calc(100vh-136px)] bg-black overflow-y-auto pb-20"
        >
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
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={<LoadingSpinner />}
              scrollableTarget="gossip-scroll-container"
              scrollThreshold={0.9}
              style={{ overflow: "visible" }}
            >
              <div className="w-full max-w-[480px] mx-auto">
                {posts.map((post) => (
                  <GossipPost key={post.post_id} post={post} />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )}
    </div>
  );
};

export default Gossip;
