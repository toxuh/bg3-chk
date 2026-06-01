import { ChecklistApp } from "@/components/checklist-app";
import { routing } from "@/i18n/routing";

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export default function LocaleHome() {
  return <ChecklistApp />;
}
