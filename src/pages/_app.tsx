import type { AppProps } from "next/app";
import Head from "next/head";
import { Public_Sans } from "next/font/google";

import Layout from "@/components/layout/main-layout";
import { hydrateStore } from "@/lib/store/store";
import StorageBanner from "@/components/storage-banner";
import AppErrorBoundary from "@/components/app-error-boundary";
import { Toaster } from "sonner";
import "@/styles/globals.css";

import { useEffect, type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";

const publicSans = Public_Sans({ subsets: ["latin"] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
// DEFINE GLOBAL LAYOUT

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // TODO: What is this doing? 
  useEffect(() => {
    hydrateStore();
  }, []);

  // Use the layout defined at the page level if available, else use main Layout
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    // A plain wrapper for the font: each layout renders the page's single <main>.
    <div className={publicSans.className}>
      <Head>
        <title>Pennywise</title>
        {/* viewport-fit=cover makes env(safe-area-inset-*) real (it's 0 without
            it). No interactive-widget=resizes-content: it would lift the fixed
            bottom nav above the Android keyboard. Zoom stays enabled: inputs
            are 16px on phones instead. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Browser chrome matches the top of the page: the beige background.
            AuthLayout overrides this on phones, where its top is the dark bar. */}
        <meta name="theme-color" content="#F8F4F0" key="theme-color" />
        <meta name="color-scheme" content="light" />
        <meta
          name="description"
          content="Track transactions, budgets, savings pots and recurring bills."
        />
      </Head>
      <AppErrorBoundary>{getLayout(<Component {...pageProps} />)}</AppErrorBoundary>
      <StorageBanner />
      {/* Lifted clear of the mobile bottom nav (52px, 74px from sm). */}
      <Toaster
        position="bottom-right"
        offset={{
          bottom: "calc(96px + env(safe-area-inset-bottom, 0px))",
          right: 24,
        }}
        mobileOffset={{ bottom: "calc(68px + env(safe-area-inset-bottom, 0px))" }}
        style={{ fontFamily: "inherit" }}
      />
    </div>
  );
}
