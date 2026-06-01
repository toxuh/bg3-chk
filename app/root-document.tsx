import { DM_Sans, Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import { cn } from "@/lib/utils";

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Props {
  children: React.ReactNode;
  locale: string;
}

export const RootDocument = ({ children, locale }: Readonly<Props>) => (
  <html
    lang={locale}
    className={cn(
      "h-full",
      "antialiased",
      geistSans.variable,
      geistMono.variable,
      "font-sans",
      dmSans.variable,
      robotoSlabHeading.variable,
    )}
  >
    <body className="flex min-h-full flex-col">
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </body>
  </html>
);
