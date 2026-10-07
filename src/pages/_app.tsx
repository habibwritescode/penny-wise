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
    <main className={publicSans.className}>
      <Head>
        <title>Pennywise</title>
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
        offset={{ bottom: 96, right: 24 }}
        mobileOffset={{ bottom: 68 }}
        style={{ fontFamily: "inherit" }}
      />
    </main>
  );
}
