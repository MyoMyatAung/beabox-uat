import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetNotiQuery } from "@/store/api/profileApi";
import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";

const PAGE_SIZE = 10;

type NotificationType = "system" | "creator" | "balance_alert";

interface UseInfiniteNotificationsOptions {
  type: NotificationType;
  unauthFlag: string;
}

export const useInfiniteNotifications = ({
  type,
  unauthFlag,
}: UseInfiniteNotificationsOptions) => {
  const user = useSelector((state: any) => state.persist.user);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const authStateKey = user?.token ? "auth" : "guest";

  const { data, isLoading, isFetching } = useGetNotiQuery({
    type,
    page,
    pageSize: PAGE_SIZE,
    authState: authStateKey,
  });

  useEffect(() => {
    setPage(1);
    setNotifications([]);
    setHasMore(true);

    if (!user?.token) {
      const storedRaw = localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY);
      let storedData: Record<string, any> = {};
      try {
        storedData = storedRaw ? JSON.parse(storedRaw) : {};
      } catch {
        storedData = {};
      }

      localStorage.setItem(
        NOTIFICATION_CONFIG.STORAGE_KEY,
        JSON.stringify({ ...storedData, [unauthFlag]: true })
      );
    }
  }, [user?.token, type, unauthFlag]);

  useEffect(() => {
    if (!data) return;

    const pageItems = Array.isArray(data?.data) ? data.data : [];

    if (page === 1) {
      setNotifications(pageItems);
      setHasMore(pageItems.length === PAGE_SIZE);
      return;
    }

    if (!pageItems.length) {
      setHasMore(false);
      return;
    }

    setNotifications((prev) => {
      const existingIds = new Set(prev.map((item: any) => item.id));
      const nextItems = pageItems.filter(
        (item: any) => !existingIds.has(item.id)
      );

      if (!nextItems.length) {
        setHasMore(false);
        return prev;
      }

      setHasMore(pageItems.length === PAGE_SIZE);
      return [...prev, ...nextItems];
    });
  }, [data, page]);

  useEffect(() => {
    if (!hasMore && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [hasMore]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const groupedData = useMemo(() => {
    if (!notifications.length) return [];

    const orderedDates: string[] = [];
    const grouped = new Map<string, any[]>();

    notifications.forEach((item: any) => {
      const dateKey = item?.created_at;
      if (!dateKey) return;

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
        orderedDates.push(dateKey);
      }
      grouped.get(dateKey)?.push(item);
    });

    return orderedDates.map((date) => ({
      date,
      list: grouped.get(date) ?? [],
    }));
  }, [notifications]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching) {
            observerRef.current?.disconnect();
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "120px" }
      );

      observerRef.current.observe(node);
    },
    [hasMore, isFetching]
  );

  return {
    groupedData,
    isLoading,
    isFetchingMore: isFetching && !isLoading,
    loadMoreRef,
    hasNotifications: notifications.length > 0,
  };
};

