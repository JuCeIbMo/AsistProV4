import App from '../App';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>AsistPro | Gestión Automatizada por WhatsApp</title>
        <meta name="description" content="IA que organiza tus citas y finanzas por chat. Prueba 3 días gratis. +10,000 usuarios en Argentina." />
        {/* Meta tags específicos para esta página */}
        <meta property="og:url" content="https://asistpro.app" />
      </Head>
      <App />
    </>
  );
}
