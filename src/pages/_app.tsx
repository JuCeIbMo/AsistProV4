import type { AppProps } from "next/app";
import Script from "next/script";

import Head from "next/head";
import "../index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* --- 1. Favicon y PWA --- */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* --- 2. Meta Tags para iOS --- */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFFFFF" />

        {/* --- 3. Metadatos Globales --- */}
        <title>AsistPro</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* --- 4. Precarga de Recursos --- */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* --- 5. Google Analytics (Reemplaza G-XXXXXXXXXX) --- 
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />*/}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-B1774KRD3H`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-B1774KRD3H');`}
        </Script>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
