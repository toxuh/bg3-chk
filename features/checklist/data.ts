import checklistData from "@/lib/checklist-data.json";

import type { ChecklistGroup } from "@/features/checklist/types";

export const checklistGroups = checklistData.groups as ChecklistGroup[];
export const checklistItems = checklistGroups.flatMap((group) => group.items);
export const checklistItemIds = new Set(checklistItems.map((item) => item.id));
export const checklistGroupsById = new Map(checklistGroups.map((group) => [group.id, group]));
export const checklistSourceUrl = checklistData.sourceUrl;
