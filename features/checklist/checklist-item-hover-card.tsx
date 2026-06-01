import { Weight } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChecklistItemImage } from "@/features/checklist/checklist-item-image";
import type { ChecklistItem } from "@/features/checklist/types";

interface Props {
  children: React.ReactNode;
  item: ChecklistItem;
}

export const ChecklistItemHoverCard = ({ children, item }: Readonly<Props>) => {
  if (!item.tooltip) {
    return children;
  }

  const { damage, imageUrl, lore, rarity, stats, weight } = item.tooltip;

  return (
    <HoverCard openDelay={180} closeDelay={80}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        className="w-80 border-stone-700 bg-stone-900 p-0 text-stone-100 shadow-2xl"
      >
        <div className="flex gap-3 border-b border-stone-800 p-4">
          {(imageUrl || item.imageUrl) && (
            <ChecklistItemImage imageUrl={imageUrl ?? item.imageUrl ?? ""} size="large" />
          )}
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold text-amber-400">{item.name}</h3>
            {rarity && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-400">{rarity}</p>}
            {damage && <p className="mt-2 text-sm text-stone-200">{damage}</p>}
          </div>
        </div>
        <div className="space-y-3 p-4 text-xs leading-5 text-stone-400">
          {lore && <p className="italic text-stone-300">{lore}</p>}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {stats.map((stat) => (
                <span key={stat} className="rounded bg-stone-800 px-2 py-0.5 text-stone-300">
                  {stat}
                </span>
              ))}
            </div>
          )}
          {weight && (
            <p className="flex items-center gap-1 text-stone-500">
              <Weight className="size-3.5" />
              {weight}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
