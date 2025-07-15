import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es-AR"> {/* Español de Argentina */}
      <Head>
        {/* Metadatos esenciales */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Favicon (reemplaza estos assets) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FFFFFF" />

        {/* SEO Primario */}
        <meta name="description" content="AsistPro: Tu asistente virtual por WhatsApp para gestionar citas, finanzas y productividad con IA. Prueba gratis 3 días." />
        <meta name="keywords" content="asistente virtual, WhatsApp bot, gestión de tiempo, finanzas personales, IA, recordatorios automáticos, Argentina" />
        <meta name="author" content="AsistPro" />

        {/* Open Graph (Redes Sociales) */}
        <meta property="og:title" content="AsistPro | Asistente Virtual por WhatsApp con IA" />
        <meta property="og:description" content="Organiza tu vida automáticamente: agenda citas, controla gastos y genera informes desde WhatsApp. ¡Prueba gratis!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://asistpro.app" />
        <meta property="og:image" content="https://asistpro.app/og-image.jpg" /> {/* Imagen 1200x630 */}
        <meta property="og:site_name" content="AsistPro" />
        <meta property="og:locale" content="es_AR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AsistPro | Automatiza tu vida desde WhatsApp" />
        <meta name="twitter:description" content="IA que gestiona tu agenda y finanzas por chat. ¡3 días gratis!" />
        <meta name="twitter:image" content="https://asistpro.app/twitter-card.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://asistpro.app" />

        {/* Preconexiones críticas */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.whatsapp.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
