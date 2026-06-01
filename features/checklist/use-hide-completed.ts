import { useSyncExternalStore } from "react";

const STORAGE_KEY = "bg3-act-1-checklist-hide-completed";
const STORAGE_EVENT = "bg3-checklist-hide-completed-changed";
const DEFAULT_VALUE = "false";

const getSnapshot = () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_VALUE;

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
};

const saveHideCompleted = (hideCompleted: boolean) => {
  localStorage.setItem(STORAGE_KEY, String(hideCompleted));
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const useHideCompleted = () => {
  const savedValue = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_VALUE);

  return {
    clearHideCompleted: () => saveHideCompleted(false),
    hideCompleted: savedValue === "true",
    setHideCompleted: saveHideCompleted,
  };
};
