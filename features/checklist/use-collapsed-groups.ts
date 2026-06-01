import { useMemo, useSyncExternalStore } from "react";

import { checklistGroupIds } from "@/features/checklist/data";

const STORAGE_KEY = "bg3-act-1-checklist-collapsed-groups";
const STORAGE_EVENT = "bg3-checklist-collapsed-groups-changed";
const EMPTY_GROUPS = "[]";

const getSnapshot = () => localStorage.getItem(STORAGE_KEY) ?? EMPTY_GROUPS;

const parseCollapsedGroups = (savedGroups: string) => {
  try {
    const groupIds = JSON.parse(savedGroups);

    if (!Array.isArray(groupIds)) {
      return new Set<string>();
    }

    return new Set(
      groupIds.filter(
        (groupId): groupId is string =>
          typeof groupId === "string" && checklistGroupIds.has(groupId),
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

const saveCollapsedGroups = (collapsedGroups: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsedGroups]));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useCollapsedGroups = () => {
  const savedGroups = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_GROUPS);
  const collapsedGroups = useMemo(() => parseCollapsedGroups(savedGroups), [savedGroups]);

  const toggleGroup = (groupId: string) => {
    const nextGroups = new Set(collapsedGroups);

    if (nextGroups.has(groupId)) {
      nextGroups.delete(groupId);
    } else {
      nextGroups.add(groupId);
    }

    saveCollapsedGroups(nextGroups);
  };

  return {
    clearCollapsedGroups: () => saveCollapsedGroups(new Set()),
    collapsedGroups,
    toggleGroup,
  };
};
