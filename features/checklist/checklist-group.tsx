import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChecklistItemRow } from "@/features/checklist/checklist-item-row";
import type { ChecklistGroup as ChecklistGroupType, ChecklistItem } from "@/features/checklist/types";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  completedCount: number;
  completedItems: Set<string>;
  group: ChecklistGroupType;
  originalItemCount: number;
  onOpenDetails: (item: ChecklistItem) => void;
  onSelectMap: (mapUrl: string) => void;
  onToggleGroup: (groupId: string) => void;
  onToggleItem: (itemId: string) => void;
}

export const ChecklistGroup = ({
  collapsed,
  completedCount,
  completedItems,
  group,
  originalItemCount,
  onOpenDetails,
  onSelectMap,
  onToggleGroup,
  onToggleItem,
}: Readonly<Props>) => {
  return (
    <Collapsible
      asChild
      open={!collapsed}
      onOpenChange={() => onToggleGroup(group.id)}
    >
      <section className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-lg shadow-black/10">
        <CollapsibleTrigger
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-stone-800/70 sm:px-5"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-amber-500 transition-transform",
              collapsed && "-rotate-90",
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-stone-500">
              {group.path.slice(0, -1).join(" / ")}
            </span>
            <span className="block font-heading text-xl font-semibold text-stone-100">
              {group.title}
            </span>
          </span>
          <span className="text-xs font-medium text-stone-500">
            {completedCount}/{originalItemCount}
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="divide-y divide-stone-800 border-t border-stone-800">
            {group.items.map((item) => (
              <ChecklistItemRow
                key={item.id}
                completed={completedItems.has(item.id)}
                item={item}
                onOpenDetails={onOpenDetails}
                onSelectMap={onSelectMap}
                onToggleItem={onToggleItem}
              />
            ))}
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
};
