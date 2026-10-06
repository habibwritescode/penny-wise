import type { AppProps } from "next/app";
import { Public_Sans } from "next/font/google";

import Layout from "@/components/layout/main-layout";
import useBoundStore from "@/lib/store/store";
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
    useBoundStore.persist.rehydrate();
  }, []);

  // Use the layout defined at the page level if available, else use main Layout
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <main className={publicSans.className}>
      {getLayout(<Component {...pageProps} />)}
    </main>
  );
}
