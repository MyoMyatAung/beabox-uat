/**
 * ============================================================================
 * USE GOSSIP TABS HOOK
 * ============================================================================
 *
 * Custom hook for managing gossip category tabs.
 *
 * RESPONSIBILITIES:
 * - Fetches category list from API
 * - Manages active tab state
 * - Persists active tab to localStorage for session continuity
 * - Validates active tab against available categories
 *
 * BUSINESS LOGIC:
 * - Categories are fetched once and cached via RTK Query
 * - Active tab defaults to first category if not set or invalid
 * - Tab persistence enables users to return to their last viewed category
 */

import { useState, useEffect, useMemo } from "react";
import { useGetGossipCategoriesQuery } from "../services/gossipSlice";
import { GOSSIP_TAB_STORAGE_KEY } from "../constants";
import type { Tab, UseGossipTabsReturn } from "../types";

/**
 * Hook for managing gossip category tabs with persistence.
 *
 * @returns Tab management state and handlers
 *
 * @example
 * ```tsx
 * const { tabs, activeTab, handleTabClick, isLoading } = useGossipTabs();
 *
 * return (
 *   <TabBar
 *     tabs={tabs}
 *     activeTab={activeTab}
 *     onTabClick={handleTabClick}
 *   />
 * );
 * ```
 */
export function useGossipTabs(): UseGossipTabsReturn {
  // Initialize active tab from localStorage (client-side only)
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(GOSSIP_TAB_STORAGE_KEY) || "";
  });

  // Fetch categories from API with RTK Query caching
  const {
    data: categoryList = [],
    isLoading,
    error,
  } = useGetGossipCategoriesQuery();

  // Transform API categories into Tab objects
  // Memoized to prevent unnecessary re-renders
  const tabs: Tab[] = useMemo(() => {
    if (!Array.isArray(categoryList)) return [];

    return categoryList.map((category, index) => ({
      id: category.slug || category.id || `category-${index}`,
      label: category.name || `分类${index + 1}`,
      categoryId: category.id,
    }));
  }, [categoryList]);

  // Get configuration for the currently active tab
  const activeTabConfig = useMemo(
    () => tabs.find((tab) => tab.id === activeTab),
    [tabs, activeTab]
  );

  // Validate and set default active tab when categories load
  // - If no active tab, default to first
  // - If active tab doesn't exist in categories, reset to first
  useEffect(() => {
    if (!tabs.length) return;

    if (activeTab) {
      const existsInTabs = tabs.some((tab) => tab.id === activeTab);
      if (!existsInTabs) {
        setActiveTab(tabs[0].id);
      }
      return;
    }

    setActiveTab(tabs[0].id);
  }, [activeTab, tabs]);

  // Persist active tab to localStorage on change
  useEffect(() => {
    if (!activeTab || typeof window === "undefined") return;
    window.localStorage.setItem(GOSSIP_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  // Handler for tab click - updates active tab state
  const handleTabClick = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
  };

  return {
    tabs,
    activeTab,
    activeTabConfig,
    isLoading,
    error,
    handleTabClick,
  };
}

export default useGossipTabs;
