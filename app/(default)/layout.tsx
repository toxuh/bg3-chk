import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { RootDocument } from "@/app/root-document";
import { routing } from "@/i18n/routing";

import "../globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "Metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  setRequestLocale(routing.defaultLocale);

  return <RootDocument locale={routing.defaultLocale}>{children}</RootDocument>;
}
