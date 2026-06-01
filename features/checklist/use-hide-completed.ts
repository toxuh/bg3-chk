import { useSyncExternalStore } from "react";

import type { ChecklistAct } from "@/features/checklist/types";

const STORAGE_EVENT = "bg3-checklist-hide-completed-changed";
const DEFAULT_VALUE = "false";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
};

const saveHideCompleted = (storageKey: string, hideCompleted: boolean) => {
  localStorage.setItem(storageKey, String(hideCompleted));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useHideCompleted = (act: ChecklistAct) => {
  const storageKey = `bg3-${act}-checklist-hide-completed`;
  const savedValue = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(storageKey) ?? DEFAULT_VALUE,
    () => DEFAULT_VALUE,
  );

  return {
    clearHideCompleted: () => saveHideCompleted(storageKey, false),
    hideCompleted: savedValue === "true",
    setHideCompleted: (hideCompleted: boolean) =>
      saveHideCompleted(storageKey, hideCompleted),
  };
};
