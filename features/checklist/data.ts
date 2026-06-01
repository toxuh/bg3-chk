import enChecklistData from "@/locales/en/checklist-data.json";
import enAct2ChecklistData from "@/locales/en/act-2-checklist-data.json";
import enAct3ChecklistData from "@/locales/en/act-3-checklist-data.json";

import type { ChecklistAct, ChecklistDataset } from "@/features/checklist/types";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const createChecklistData = (checklistData: ChecklistDataset) => {
  const checklistGroups = checklistData.groups;
  const checklistItems = checklistGroups.flatMap((group) => group.items);

  return {
    checklistGroups,
    checklistGroupsById: new Map(checklistGroups.map((group) => [group.id, group])),
    checklistGroupIds: new Set(checklistGroups.map((group) => group.id)),
    checklistItems,
    checklistItemIds: new Set(checklistItems.map((item) => item.id)),
    checklistSourceUrl: checklistData.sourceUrl,
  };
};

const checklistDataByLocale = {
  en: {
    "act-1": createChecklistData(enChecklistData),
    "act-2": createChecklistData(enAct2ChecklistData),
    "act-3": createChecklistData(enAct3ChecklistData),
  },
} satisfies Record<
  Locale,
  Record<ChecklistAct, ReturnType<typeof createChecklistData>>
>;

export const getChecklistData = (locale: Locale, act: ChecklistAct) =>
  checklistDataByLocale[locale][act];
