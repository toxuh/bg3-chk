import { ExternalLink, MapPinned, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  mapUrl: string;
}

interface MobileProps extends Props {
  onClose: () => void;
}

export const ChecklistMapPanel = ({ mapUrl }: Readonly<Props>) => (
  <aside className="sticky top-[137px] hidden self-start overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-lg shadow-black/10 lg:block">
    <div className="flex items-center gap-3 border-b border-stone-800 px-4 py-3">
      <MapPinned className="size-4 text-amber-500" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-500">Interactive map</p>
        <p className="truncate text-xs text-stone-500">Click any location marker to update</p>
      </div>
      <Button
        asChild
        variant="ghost"
        size="icon-sm"
        className="text-stone-500 hover:bg-stone-800 hover:text-white"
      >
        <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open current map in a new tab">
          <ExternalLink />
        </a>
      </Button>
    </div>
    <iframe title="Baldur's Gate 3 interactive map" src={mapUrl} className="h-[660px] w-full bg-stone-950" />
  </aside>
);

export const ChecklistMobileMap = ({ mapUrl, onClose }: Readonly<MobileProps>) => (
  <div className="fixed inset-x-3 bottom-3 top-24 z-40 overflow-hidden rounded-xl border border-stone-700 bg-stone-900 shadow-2xl lg:hidden">
    <div className="flex items-center gap-3 border-b border-stone-800 px-4 py-3">
      <MapPinned className="size-4 text-amber-500" />
      <p className="flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-500">
        Interactive map
      </p>
      <Button
        asChild
        variant="ghost"
        size="icon-sm"
        className="text-stone-500 hover:bg-stone-800 hover:text-white"
      >
        <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open current map in a new tab">
          <ExternalLink />
        </a>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Close map"
        className="text-stone-500 hover:bg-stone-800 hover:text-white"
        onClick={onClose}
      >
        <X />
      </Button>
    </div>
    <iframe title="Baldur's Gate 3 interactive map" src={mapUrl} className="h-[calc(100%-49px)] w-full bg-stone-950" />
  </div>
);
