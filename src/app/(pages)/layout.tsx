import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import Header from "@/layout/Header/Header";
import Navigation from "@/components/navi/Navigation";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/ja";
import { createClient } from "@/lib/supabase/server";

const theme = createTheme({
  cursorType: "pointer",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "読書かんり ",
  description: "Generated by create next app",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data } = await (await createClient()).auth.getUser();
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <title>読書かんり</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme}>
          <DatesProvider settings={{ firstDayOfWeek: 0, locale: "ja" }}>
            <Header user={data.user} />
            <Navigation />
            <div className={`${styles.body_container}`}>{children}</div>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
