import { LoaderCircle } from "lucide-react";

export const ChecklistLoading = () => (
  <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 text-stone-100">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-amber-900/70 bg-stone-900">
        <LoaderCircle className="size-6 animate-spin text-amber-500" />
      </div>
      <div>
        <p className="font-heading text-xl font-semibold text-stone-100">Loading your checklist</p>
        <p className="mt-1 text-sm text-stone-500">Restoring progress and section state...</p>
      </div>
    </div>
  </main>
);
