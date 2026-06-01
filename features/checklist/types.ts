export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  itemUrl: string | null;
  mapUrl: string | null;
  tooltip?: ChecklistItemTooltip;
}

export interface ChecklistItemTooltip {
  rarity: string | null;
  damage: string | null;
  lore: string | null;
  stats: string[];
  weight: string | null;
  imageUrl: string | null;
}

export interface ChecklistGroup {
  id: string;
  path: Array<string | null>;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistDataset {
  sourceUrl: string;
  groups: ChecklistGroup[];
}
