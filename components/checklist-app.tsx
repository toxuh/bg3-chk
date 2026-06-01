"use client";

import { useCallback, useMemo, useState } from "react";

import { ChecklistDetailsDialog } from "@/features/checklist/checklist-details-dialog";
import { ChecklistGroup } from "@/features/checklist/checklist-group";
import { ChecklistMapPanel, ChecklistMobileMap } from "@/features/checklist/checklist-map-panel";
import { ChecklistToolbar } from "@/features/checklist/checklist-toolbar";
import {
  checklistGroups,
  checklistGroupsById,
  checklistItems,
  checklistSourceUrl,
} from "@/features/checklist/data";
import type { ChecklistItem } from "@/features/checklist/types";
import { useChecklistProgress } from "@/features/checklist/use-checklist-progress";

export const ChecklistApp = () => {
  const { clearProgress, completedItems, toggleItem } = useChecklistProgress();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [query, setQuery] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [activeMapUrl, setActiveMapUrl] = useState(
    "https://gamestegy.com/bg3/maps/act-1-wilderness?mini=true&post=true",
  );
  const [showMobileMap, setShowMobileMap] = useState(false);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return checklistGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchesStatus = !showIncompleteOnly || !completedItems.has(item.id);
          const matchesQuery =
            normalizedQuery.length === 0 ||
            `${item.name} ${item.description} ${group.path.join(" ")}`
              .toLocaleLowerCase()
              .includes(normalizedQuery);

          return matchesStatus && matchesQuery;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [completedItems, query, showIncompleteOnly]);

  const completedCount = completedItems.size;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((currentGroups) => {
      const nextGroups = new Set(currentGroups);

      if (nextGroups.has(groupId)) {
        nextGroups.delete(groupId);
      } else {
        nextGroups.add(groupId);
      }

      return nextGroups;
    });
  };

  const closeDetails = useCallback(() => setSelectedItem(null), []);
  const selectMap = (mapUrl: string) => {
    setActiveMapUrl(mapUrl);
    setShowMobileMap(true);
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <ChecklistToolbar
        completedCount={completedCount}
        progress={progress}
        query={query}
        showIncompleteOnly={showIncompleteOnly}
        totalCount={checklistItems.length}
        onClearProgress={clearProgress}
        onQueryChange={setQuery}
        onShowIncompleteOnlyChange={setShowIncompleteOnly}
      />

      <div className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
        {filteredGroups.length === 0 ? (
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-8 text-center text-stone-400">
            No checklist entries match the current filters.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
            <div className="space-y-5">
              {filteredGroups.map((group) => (
                <ChecklistGroup
                  key={group.id}
                  collapsed={collapsedGroups.has(group.id)}
                  completedCount={
                    checklistGroupsById
                      .get(group.id)
                      ?.items.filter((item) => completedItems.has(item.id)).length ?? 0
                  }
                  completedItems={completedItems}
                  group={group}
                  originalItemCount={
                    checklistGroupsById.get(group.id)?.items.length ?? group.items.length
                  }
                  onOpenDetails={setSelectedItem}
                  onSelectMap={selectMap}
                  onToggleGroup={toggleGroup}
                  onToggleItem={toggleItem}
                />
              ))}
            </div>
            <ChecklistMapPanel mapUrl={activeMapUrl} />
          </div>
        )}

        <footer className="py-10 text-center text-xs leading-5 text-stone-600">
          Checklist content extracted from{" "}
          <a
            href={checklistSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-stone-500 underline underline-offset-4 hover:text-amber-500"
          >
            Gamestegy&apos;s Act 1 checklist
          </a>
          . Progress stays in this browser.
        </footer>
      </div>

      <ChecklistDetailsDialog
        key={selectedItem?.id ?? "closed"}
        completed={selectedItem ? completedItems.has(selectedItem.id) : false}
        item={selectedItem}
        onClose={closeDetails}
        onToggleItem={toggleItem}
      />
      {showMobileMap && (
        <ChecklistMobileMap mapUrl={activeMapUrl} onClose={() => setShowMobileMap(false)} />
      )}
    </main>
  );
};
