import { Html, Head, Main, NextScript } from "next/document";

// CONTROL INITIAL RESPONSE FROM SERVER
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#201F24" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
