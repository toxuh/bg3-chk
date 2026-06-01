import { ListChecks, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ActNavigation } from "@/features/checklist/act-navigation";

interface Props {
  completedCount: number;
  progress: number;
  query: string;
  showIncompleteOnly: boolean;
  totalCount: number;
  onClearProgress: () => void;
  onQueryChange: (query: string) => void;
  onShowIncompleteOnlyChange: (showIncompleteOnly: boolean) => void;
}

export const ChecklistToolbar = ({
  completedCount,
  progress,
  query,
  showIncompleteOnly,
  totalCount,
  onClearProgress,
  onQueryChange,
  onShowIncompleteOnlyChange,
}: Readonly<Props>) => (
  <>
    <header className="border-b border-amber-950/70 bg-stone-950/95">
      <div className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">
              <ListChecks className="size-4" />
              Personal playthrough tracker
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-50 sm:text-5xl">
              Baldur&apos;s Gate 3
            </h1>
            <p className="mt-2 text-lg text-stone-400">Act 1 complete checklist</p>
            <div className="mt-5">
              <ActNavigation />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-fit border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 hover:text-white"
            onClick={onClearProgress}
          >
            <RotateCcw data-icon="inline-start" />
            Clear progress
          </Button>
        </div>
      </div>
    </header>

    <div className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/95 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-center gap-4">
          <Progress value={progress} className="h-2 flex-1 bg-stone-800" />
          <div className="shrink-0 text-sm font-medium text-stone-300">
            {completedCount} / {totalCount}
            <span className="ml-2 text-amber-500">{progress}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone-800 bg-stone-900 px-3 text-stone-400 focus-within:border-amber-700 focus-within:ring-2 focus-within:ring-amber-900/60">
            <Search className="size-4 shrink-0" />
            <span className="sr-only">Search checklist</span>
            <Input
              type="search"
              value={query}
              placeholder="Search items, quests, locations..."
              className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-sm text-stone-100 shadow-none outline-none placeholder:text-stone-600 focus-visible:ring-0"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-300 transition-colors hover:bg-stone-800">
            <Checkbox
              checked={showIncompleteOnly}
              className="border-stone-700 bg-stone-950 data-checked:border-amber-500 data-checked:bg-amber-600 data-checked:text-stone-950"
              onCheckedChange={(checked) => onShowIncompleteOnlyChange(checked === true)}
            />
            Hide completed
          </label>
        </div>
      </div>
    </div>
  </>
);
