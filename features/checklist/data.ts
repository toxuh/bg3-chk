import enChecklistData from "@/locales/en/checklist-data.json";

import type { ChecklistDataset } from "@/features/checklist/types";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const createChecklistData = (checklistData: ChecklistDataset) => {
  const checklistGroups = checklistData.groups;
  const checklistItems = checklistGroups.flatMap((group) => group.items);

  return {
    checklistGroups,
    checklistGroupsById: new Map(checklistGroups.map((group) => [group.id, group])),
    checklistItems,
    checklistSourceUrl: checklistData.sourceUrl,
  };
};

const checklistDataByLocale = {
  en: createChecklistData(enChecklistData),
} satisfies Record<Locale, ReturnType<typeof createChecklistData>>;

export const getChecklistData = (locale: Locale) => checklistDataByLocale[locale];

const defaultChecklistData = getChecklistData(routing.defaultLocale);

export const checklistItems = defaultChecklistData.checklistItems;
export const checklistItemIds = new Set(checklistItems.map((item) => item.id));
export const checklistGroups = defaultChecklistData.checklistGroups;
export const checklistGroupIds = new Set(checklistGroups.map((group) => group.id));
