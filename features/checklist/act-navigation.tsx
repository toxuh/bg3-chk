import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ChecklistAct } from "@/features/checklist/types";
import { cn } from "@/lib/utils";

interface ActNavigationItem {
  id: ChecklistAct;
  label: "act1" | "act2" | "act3";
}

const acts: ActNavigationItem[] = [
  {
    id: "act-1",
    label: "act1",
  },
  {
    id: "act-2",
    label: "act2",
  },
  {
    id: "act-3",
    label: "act3",
  },
];

interface Props {
  activeAct: ChecklistAct;
  isSwitchingAct: boolean;
  onSelectAct: (act: ChecklistAct) => void;
}

export const ActNavigation = ({
  activeAct,
  isSwitchingAct,
  onSelectAct,
}: Readonly<Props>) => {
  const t = useTranslations("Navigation");

  return (
    <nav aria-label={t("ariaLabel")}>
      <ul className="flex flex-wrap gap-2">
        {acts.map((act) => {
          const active = act.id === activeAct;

          return (
            <li key={act.id}>
              <button
                type="button"
                disabled={isSwitchingAct}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-amber-600 bg-amber-600 text-stone-950"
                    : "border-stone-700 bg-stone-900 text-stone-300 hover:border-amber-700 hover:text-amber-500",
                )}
                onClick={() => onSelectAct(act.id)}
              >
                {t(act.label)}
                {active && isSwitchingAct && <LoaderCircle className="size-3.5 animate-spin" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
