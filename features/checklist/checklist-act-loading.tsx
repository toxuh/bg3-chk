import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const ChecklistActLoading = () => {
  const t = useTranslations("Loading");

  return (
    <div
      role="status"
      className="absolute inset-0 z-10 flex items-start justify-center bg-stone-950/75 px-4 pt-12 backdrop-blur-[2px]"
    >
      <div className="sticky top-44 flex items-center gap-3 rounded-xl border border-amber-950/80 bg-stone-900 px-5 py-4 shadow-xl shadow-black/30">
        <LoaderCircle className="size-5 animate-spin text-amber-500" />
        <div>
          <p className="font-heading text-base font-semibold text-stone-100">
            {t("switchingTitle")}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">{t("switchingDescription")}</p>
        </div>
      </div>
    </div>
  );
};
