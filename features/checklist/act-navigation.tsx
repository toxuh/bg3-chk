import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface ActNavigationItem {
  id: string;
  label: "act1" | "act2" | "act3";
  status: "active" | "planned";
}

const acts: ActNavigationItem[] = [
  {
    id: "act-1",
    label: "act1",
    status: "active",
  },
  {
    id: "act-2",
    label: "act2",
    status: "planned",
  },
  {
    id: "act-3",
    label: "act3",
    status: "planned",
  },
];

export const ActNavigation = () => {
  const t = useTranslations("Navigation");

  return (
    <nav aria-label={t("ariaLabel")}>
      <ul className="flex flex-wrap gap-2">
        {acts.map((act) => {
          const active = act.status === "active";

          return (
            <li key={act.id}>
              <button
                type="button"
                disabled={!active}
                aria-current={active ? "page" : undefined}
                title={active ? undefined : t("plannedTitle")}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-amber-600 bg-amber-600 text-stone-950"
                    : "cursor-not-allowed border-stone-800 bg-stone-900 text-stone-600",
                )}
              >
                {t(act.label)}
                {!active && <LockKeyhole className="size-3.5" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
