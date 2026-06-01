import { useMemo, useSyncExternalStore } from "react";

import { checklistItemIds } from "@/features/checklist/data";

const STORAGE_KEY = "bg3-act-1-checklist-progress";
const STORAGE_EVENT = "bg3-checklist-progress-changed";
const EMPTY_PROGRESS = "[]";

const getSnapshot = () => localStorage.getItem(STORAGE_KEY) ?? EMPTY_PROGRESS;

const parseProgress = (savedProgress: string) => {
  try {
    const itemIds = JSON.parse(savedProgress);

    if (!Array.isArray(itemIds)) {
      return new Set<string>();
    }

    return new Set(
      itemIds.filter(
        (itemId): itemId is string =>
          typeof itemId === "string" && checklistItemIds.has(itemId),
      ),
    );
  } catch {
    return new Set<string>();
  }
};

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
};

const saveProgress = (completedItems: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedItems]));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useChecklistProgress = () => {
  const savedProgress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_PROGRESS);
  const completedItems = useMemo(() => parseProgress(savedProgress), [savedProgress]);

  const toggleItem = (itemId: string) => {
    const nextItems = new Set(completedItems);

    if (nextItems.has(itemId)) {
      nextItems.delete(itemId);
    } else {
      nextItems.add(itemId);
    }

    saveProgress(nextItems);
  };

  const clearProgress = () => {
    if (completedItems.size === 0 || window.confirm("Clear all saved progress?")) {
      saveProgress(new Set());
    }
  };

  return {
    clearProgress,
    completedItems,
    toggleItem,
  };
};
