import { Map } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { ChecklistItemHoverCard } from "@/features/checklist/checklist-item-hover-card";
import { ChecklistItemImage } from "@/features/checklist/checklist-item-image";
import type { ChecklistItem } from "@/features/checklist/types";
import { cn } from "@/lib/utils";

interface Props {
  completed: boolean;
  item: ChecklistItem;
  onOpenDetails: (item: ChecklistItem) => void;
  onSelectMap: (mapUrl: string) => void;
  onToggleItem: (itemId: string) => void;
}

export const ChecklistItemRow = ({
  completed,
  item,
  onOpenDetails,
  onSelectMap,
  onToggleItem,
}: Readonly<Props>) => (
  <article
    className={cn(
      "group flex items-start gap-3 px-4 py-4 transition-colors sm:px-5",
      completed ? "bg-stone-950/45" : "hover:bg-stone-800/45",
    )}
  >
    <label className="mt-1 flex size-5 shrink-0 cursor-pointer items-center justify-center">
      <Checkbox
        checked={completed}
        className="size-5 border-stone-600 bg-stone-950 data-checked:border-amber-500 data-checked:bg-amber-600 data-checked:text-stone-950"
        onCheckedChange={() => onToggleItem(item.id)}
      />
      <span className="sr-only">Mark {item.name} as found</span>
    </label>

    <ChecklistItemHoverCard item={item}>
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={() => onOpenDetails(item)}
      >
        {item.imageUrl && <ChecklistItemImage imageUrl={item.imageUrl} />}
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block font-medium text-stone-100 transition-colors group-hover:text-amber-400",
              completed && "text-stone-500 line-through group-hover:text-stone-400",
            )}
          >
            {item.name}
          </span>
          {item.description && item.description !== "-" && (
            <span className="mt-1 line-clamp-2 block text-sm leading-6 text-stone-500">
              {item.description}
            </span>
          )}
        </span>
      </button>
    </ChecklistItemHoverCard>

    {item.mapUrl && (
      <button
        type="button"
        aria-label={`Show ${item.name} location on the map`}
        className="mt-1 rounded-md p-1 text-stone-600 transition-colors hover:bg-stone-800 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        onClick={() => onSelectMap(item.mapUrl ?? "")}
      >
        <Map className="size-4" />
      </button>
    )}
  </article>
);
