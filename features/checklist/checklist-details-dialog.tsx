import { useEffect, useState } from "react";
import { Check, ExternalLink, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChecklistItemImage } from "@/features/checklist/checklist-item-image";
import type { ChecklistItem } from "@/features/checklist/types";

interface Props {
  completed: boolean;
  item: ChecklistItem | null;
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
}

export const ChecklistDetailsDialog = ({ completed, item, onClose, onToggleItem }: Readonly<Props>) => {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-xl border border-stone-700 bg-stone-900 p-0 text-stone-100 shadow-2xl sm:max-w-3xl">
        <DialogHeader className="flex-row items-start gap-4 border-b border-stone-800 p-5 pr-16 text-left">
          {item.imageUrl && <ChecklistItemImage imageUrl={item.imageUrl} size="large" />}
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Checklist details
            </p>
            <DialogTitle className="font-heading text-2xl font-semibold text-white">
              {item.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-5 p-5">
          <DialogDescription className="whitespace-pre-line text-sm leading-7 text-stone-300">
            {item.description || "No additional notes for this checklist item."}
          </DialogDescription>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={completed ? "secondary" : "default"}
              onClick={() => onToggleItem(item.id)}
            >
              <Check data-icon="inline-start" />
              {completed ? "Marked as found" : "Mark as found"}
            </Button>
            {item.mapUrl && (
              <Button
                type="button"
                variant="outline"
                className="border-stone-700 bg-stone-950 text-stone-200 hover:bg-stone-800 hover:text-white"
                onClick={() => setShowMap((currentValue) => !currentValue)}
              >
                <Map data-icon="inline-start" />
                {showMap ? "Hide map" : "Show map"}
              </Button>
            )}
            {item.itemUrl && (
              <Button
                asChild
                variant="outline"
                className="border-stone-700 bg-stone-950 text-stone-200 hover:bg-stone-800 hover:text-white"
              >
                <a href={item.itemUrl} target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" />
                  Open wiki
                </a>
              </Button>
            )}
          </div>

          {showMap && item.mapUrl && (
            <div className="overflow-hidden rounded-lg border border-stone-700 bg-stone-950">
              <iframe title={`${item.name} map`} src={item.mapUrl} className="h-[430px] w-full" loading="lazy" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
