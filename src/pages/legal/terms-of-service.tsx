import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import LegalHeader from '../../components/LegalHeader';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-light-bg overflow-x-hidden">
      <LegalHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="bg-light-white rounded-xl shadow-sm border border-light-border p-6 sm:p-10 overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-light-text font-display">
            Términos y Condiciones del Servicio
          </h1>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              1. Aceptación de los términos
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Al acceder, usar o contratar los servicios de AsistPro, aceptas estos Términos de Uso (también llamados "Condiciones de Servicio"), así como nuestra Política de Privacidad. Si no estás de acuerdo con alguno de ellos, no uses la aplicación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              2. Servicios ofrecidos
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              AsistPro ofrece, entre otros:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-light-secondary">
              <li>Programación/redacción de citas y recordatorios por comandos de WhatsApp.</li>
              <li>Registro y clasificación de gastos e ingresos.</li>
              <li>Generación de informes financieros.</li>
              <li>Reconocimiento de notas de voz para comandos y dictado.</li>
              <li>Integraciones con servicios externos (p.ej. Google Calendar).</li>
            </ul>
            <p className="mt-4 text-light-secondary leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar algún servicio o funcionalidad, total o parcialmente, temporal o permanentemente, con o sin aviso previo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              3. Registro, cuenta y seguridad
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              3.1 Registro de usuario
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Para usar ciertos servicios, deberás registrarte y proporcionar datos veraces, completos y actualizados.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              3.2 Cuenta y acceso
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Eres responsable de mantener la confidencialidad de tus credenciales (usuario, contraseña). Debes notificarnos de inmediato si sospechas que alguien usa tu cuenta sin autorización. No podrás permitir que otros usen tu cuenta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              4. Uso permitido y prohibido
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              4.1 Uso permitido
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Podrás usar la App para los fines establecidos: organizar citas, controlar finanzas, recibir informes, etc., conforme a estos Términos.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              4.2 Uso prohibido
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Queda estrictamente prohibido (entre otros):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-light-secondary">
              <li>Usar AsistPro para fines ilegales, difamatorios, inmorales o no autorizados.</li>
              <li>Ingresar datos que violen derechos de terceros.</li>
              <li>Intentar vulnerar la seguridad o integridad del sistema.</li>
              <li>Interferir, dañar o deshabilitar la App, servidores o redes conectadas.</li>
              <li>Revertir ingeniería del software, descompilar, desmontar, extraer código.</li>
              <li>Distribuir malware, virus u otros componentes dañinos.</li>
              <li>Usar bots, scrapers o herramientas automáticas para invocar el servicio sin autorización.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              5. Suscripción y pagos
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              5.1 Planes y precios
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Ofrecemos diferentes planes (Starter, Pro, Premium). Los precios y características se describen en el sitio web o dentro de la app.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              5.2 Prueba gratuita
            </h3>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Se puede ofrecer un período de prueba gratuito (por ejemplo, 3 días). Durante ese lapso, tendrás acceso parcial o total del servicio, sin tener que pagar. Al final del período de prueba, se te facturará si no cancelaste.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              6. Propiedad intelectual
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              7. Limitación de responsabilidad
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              8. Rescisión y suspensión
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              9. Modificaciones a los términos
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              10. Ley aplicable y jurisdicción
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              11. Contacto
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          {/* Navigation to Privacy Policy */}
          <div className="mt-12 pt-8 border-t border-light-border">
            <Link
              href="/legal/privacy-policy"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-light-accent-light text-light-accent-dark rounded-lg hover:bg-light-accent hover:text-light-white transition-colors duration-200 font-medium"
            >
              <Shield className="w-5 h-5" aria-hidden="true" />
              Ver Política de Privacidad
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default TermsOfService;
