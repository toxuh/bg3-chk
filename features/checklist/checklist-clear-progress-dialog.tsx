import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { checklistActNumbers, type ChecklistAct } from "@/features/checklist/types";

interface Props {
  act: ChecklistAct;
  open: boolean;
  onClearProgress: () => void;
  onOpenChange: (open: boolean) => void;
}

export const ChecklistClearProgressDialog = ({
  act,
  open,
  onClearProgress,
  onOpenChange,
}: Readonly<Props>) => {
  const t = useTranslations("ClearProgress");
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-full border border-red-950 bg-red-950/40">
            <RotateCcw className="size-5 text-red-400" />
          </div>
          <AlertDialogTitle>{t("title", { act: checklistActNumbers[act] })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-stone-700 bg-stone-950 text-stone-200 hover:bg-stone-800 hover:text-white">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClearProgress}>{t("confirm")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
