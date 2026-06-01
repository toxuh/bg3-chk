"use client";

import { useCallback, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { ChecklistDetailsDialog } from "@/features/checklist/checklist-details-dialog";
import { ChecklistActLoading } from "@/features/checklist/checklist-act-loading";
import { ChecklistClearProgressDialog } from "@/features/checklist/checklist-clear-progress-dialog";
import { ChecklistGroup } from "@/features/checklist/checklist-group";
import { ChecklistLoading } from "@/features/checklist/checklist-loading";
import { ChecklistMapPanel, ChecklistMobileMap } from "@/features/checklist/checklist-map-panel";
import { ChecklistToolbar } from "@/features/checklist/checklist-toolbar";
import {
  getChecklistData,
} from "@/features/checklist/data";
import {
  checklistActNumbers,
  type ChecklistAct,
  type ChecklistItem,
} from "@/features/checklist/types";
import { useChecklistProgress } from "@/features/checklist/use-checklist-progress";
import { useCollapsedGroups } from "@/features/checklist/use-collapsed-groups";
import { useHasMounted } from "@/features/checklist/use-has-mounted";
import { useHideCompleted } from "@/features/checklist/use-hide-completed";

const DEFAULT_MAP_URLS: Record<ChecklistAct, string> = {
  "act-1": "https://gamestegy.com/bg3/maps/act-1-wilderness?mini=true&post=true",
  "act-2": "https://gamestegy.com/bg3/maps/act-2-shadowcursed-lands?mini=true&post=true",
  "act-3": "https://gamestegy.com/bg3/maps/act-3-rivington?mini=true&post=true",
};

export const ChecklistApp = () => {
  const t = useTranslations("Checklist");
  const locale = useLocale();
  const [activeAct, setActiveAct] = useState<ChecklistAct>("act-1");
  const [selectedAct, setSelectedAct] = useState<ChecklistAct>("act-1");
  const [isSwitchingAct, startActTransition] = useTransition();
  const localeData = getChecklistData(locale, activeAct);
  const {
    checklistGroupIds,
    checklistGroupsById,
    checklistItemIds,
    checklistItems,
    checklistSourceUrl,
  } = localeData;
  const hasMounted = useHasMounted();
  const { clearProgress, completedItems, toggleItem } = useChecklistProgress(
    activeAct,
    checklistItemIds,
  );
  const { clearCollapsedGroups, collapsedGroups, toggleGroup } = useCollapsedGroups(
    activeAct,
    checklistGroupIds,
  );
  const { clearHideCompleted, hideCompleted, setHideCompleted } = useHideCompleted(activeAct);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [query, setQuery] = useState("");
  const [activeMapUrl, setActiveMapUrl] = useState(DEFAULT_MAP_URLS[activeAct]);
  const [showClearProgressDialog, setShowClearProgressDialog] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const filteredGroups = (() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return localeData.checklistGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchesStatus = !hideCompleted || !completedItems.has(item.id);
          const matchesQuery =
            normalizedQuery.length === 0 ||
            `${item.name} ${item.description} ${group.path.join(" ")}`
              .toLocaleLowerCase()
              .includes(normalizedQuery);

          return matchesStatus && matchesQuery;
        }),
      }))
      .filter((group) => group.items.length > 0);
  })();

  const completedCount = completedItems.size;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  const closeDetails = useCallback(() => setSelectedItem(null), []);
  const selectMap = (mapUrl: string) => {
    setActiveMapUrl(mapUrl);
    setShowMobileMap(true);
  };
  const selectAct = (act: ChecklistAct) => {
    if (act === selectedAct) {
      return;
    }

    setSelectedAct(act);
    setQuery("");
    setSelectedItem(null);
    setShowMobileMap(false);
    startActTransition(() => {
      setActiveAct(act);
      setActiveMapUrl(DEFAULT_MAP_URLS[act]);
    });
  };
  const clearAllState = () => {
    clearProgress();
    clearCollapsedGroups();
    clearHideCompleted();
    setQuery("");
    setSelectedItem(null);
    setActiveMapUrl(DEFAULT_MAP_URLS[activeAct]);
    setShowClearProgressDialog(false);
    setShowMobileMap(false);
  };

  if (!hasMounted) {
    return <ChecklistLoading />;
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <ChecklistToolbar
        activeAct={activeAct}
        isSwitchingAct={isSwitchingAct}
        selectedAct={selectedAct}
        completedCount={completedCount}
        progress={progress}
        query={query}
        showIncompleteOnly={hideCompleted}
        totalCount={checklistItems.length}
        onClearProgress={() => setShowClearProgressDialog(true)}
        onQueryChange={setQuery}
        onSelectAct={selectAct}
        onShowIncompleteOnlyChange={setHideCompleted}
      />

      <div
        aria-busy={isSwitchingAct}
        className="relative mx-auto max-w-[1480px] px-4 py-8 sm:px-6"
      >
        {isSwitchingAct && <ChecklistActLoading />}
        {filteredGroups.length === 0 ? (
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-8 text-center text-stone-400">
            {t("noMatchingEntries")}
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
          {t.rich("footer", {
            act: checklistActNumbers[activeAct],
            source: (chunks) => (
              <a
                href={checklistSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 underline underline-offset-4 hover:text-amber-500"
              >
                {chunks}
              </a>
            ),
          })}
        </footer>
      </div>

      <ChecklistDetailsDialog
        key={selectedItem?.id ?? "closed"}
        completed={selectedItem ? completedItems.has(selectedItem.id) : false}
        item={selectedItem}
        onClose={closeDetails}
        onToggleItem={toggleItem}
      />
      <ChecklistClearProgressDialog
        act={activeAct}
        open={showClearProgressDialog}
        onClearProgress={clearAllState}
        onOpenChange={setShowClearProgressDialog}
      />
      {showMobileMap && (
        <ChecklistMobileMap mapUrl={activeMapUrl} onClose={() => setShowMobileMap(false)} />
      )}
    </main>
  );
};
