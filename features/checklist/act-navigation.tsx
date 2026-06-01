import { LockKeyhole } from "lucide-react";

import { cn } from "@/lib/utils";

interface ActNavigationItem {
  id: string;
  label: string;
  status: "active" | "planned";
}

const acts: ActNavigationItem[] = [
  {
    id: "act-1",
    label: "Act 1",
    status: "active",
  },
  {
    id: "act-2",
    label: "Act 2",
    status: "planned",
  },
  {
    id: "act-3",
    label: "Act 3",
    status: "planned",
  },
];

export const ActNavigation = () => (
  <nav aria-label="Checklist acts">
    <ul className="flex flex-wrap gap-2">
      {acts.map((act) => {
        const active = act.status === "active";

        return (
          <li key={act.id}>
            <button
              type="button"
              disabled={!active}
              aria-current={active ? "page" : undefined}
              title={active ? undefined : "Checklist will be added later"}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                active
                  ? "border-amber-600 bg-amber-600 text-stone-950"
                  : "cursor-not-allowed border-stone-800 bg-stone-900 text-stone-600",
              )}
            >
              {act.label}
              {!active && <LockKeyhole className="size-3.5" />}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
