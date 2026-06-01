import { useMemo, useSyncExternalStore } from "react";

import type { ChecklistAct } from "@/features/checklist/types";

const STORAGE_EVENT = "bg3-checklist-collapsed-groups-changed";
const EMPTY_GROUPS = "[]";

const parseCollapsedGroups = (savedGroups: string, groupIds: ReadonlySet<string>) => {
  try {
    const savedGroupIds = JSON.parse(savedGroups);

    if (!Array.isArray(savedGroupIds)) {
      return new Set<string>();
    }

    return new Set(
      savedGroupIds.filter(
        (groupId): groupId is string =>
          typeof groupId === "string" && groupIds.has(groupId),
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

const saveCollapsedGroups = (storageKey: string, collapsedGroups: Set<string>) => {
  localStorage.setItem(storageKey, JSON.stringify([...collapsedGroups]));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useCollapsedGroups = (act: ChecklistAct, groupIds: ReadonlySet<string>) => {
  const storageKey = `bg3-${act}-checklist-collapsed-groups`;
  const savedGroups = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey) ?? EMPTY_GROUPS,
    () => EMPTY_GROUPS,
  );
  const collapsedGroups = useMemo(
    () => parseCollapsedGroups(savedGroups, groupIds),
    [groupIds, savedGroups],
  );

  const toggleGroup = (groupId: string) => {
    const nextGroups = new Set(collapsedGroups);

    if (nextGroups.has(groupId)) {
      nextGroups.delete(groupId);
    } else {
      nextGroups.add(groupId);
    }

    saveCollapsedGroups(storageKey, nextGroups);
  };

  return {
    clearCollapsedGroups: () => saveCollapsedGroups(storageKey, new Set()),
    collapsedGroups,
    toggleGroup,
  };
};
