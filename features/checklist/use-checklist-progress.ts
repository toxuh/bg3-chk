import { useMemo, useSyncExternalStore } from "react";

import type { ChecklistAct } from "@/features/checklist/types";

const STORAGE_EVENT = "bg3-checklist-progress-changed";
const EMPTY_PROGRESS = "[]";

const parseProgress = (savedProgress: string, itemIds: ReadonlySet<string>) => {
  try {
    const savedItemIds = JSON.parse(savedProgress);

    if (!Array.isArray(savedItemIds)) {
      return new Set<string>();
    }

    return new Set(
      savedItemIds.filter(
        (itemId): itemId is string =>
          typeof itemId === "string" && itemIds.has(itemId),
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

const saveProgress = (storageKey: string, completedItems: Set<string>) => {
  localStorage.setItem(storageKey, JSON.stringify([...completedItems]));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useChecklistProgress = (act: ChecklistAct, itemIds: ReadonlySet<string>) => {
  const storageKey = `bg3-${act}-checklist-progress`;
  const savedProgress = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey) ?? EMPTY_PROGRESS,
    () => EMPTY_PROGRESS,
  );
  const completedItems = useMemo(
    () => parseProgress(savedProgress, itemIds),
    [itemIds, savedProgress],
  );

  const toggleItem = (itemId: string) => {
    const nextItems = new Set(completedItems);

    if (nextItems.has(itemId)) {
      nextItems.delete(itemId);
    } else {
      nextItems.add(itemId);
    }

    saveProgress(storageKey, nextItems);
  };

  const clearProgress = () => saveProgress(storageKey, new Set());

  return {
    clearProgress,
    completedItems,
    toggleItem,
  };
};
