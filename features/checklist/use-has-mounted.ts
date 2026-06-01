import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

export const useHasMounted = () => useSyncExternalStore(subscribe, () => true, () => false);
