import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import LegalHeader from '../../components/LegalHeader';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-light-bg overflow-x-hidden">
      <LegalHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="bg-light-white rounded-xl shadow-sm border border-light-border p-6 sm:p-10 overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-light-text font-display">
            Política de Privacidad
          </h1>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              1. Introducción
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Bienvenido a AsistPro ("nosotros", "nuestro/a/s", "la App"). Valoramos tu privacidad y queremos que sepas cómo recogemos, utilizamos, almacenamos, compartimos y protegemos tus datos personales. Al usar nuestra aplicación o servicios relacionados, aceptas esta Política de Privacidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              2. Definiciones
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-light-secondary">
              <li><strong className="text-light-text">Datos personales:</strong> información que permite identificar directa o indirectamente a una persona (nombre, correo electrónico, teléfono, etc.).</li>
              <li><strong className="text-light-text">Usuario / Cliente:</strong> persona que usa AsistPro.</li>
              <li><strong className="text-light-text">Servicios:</strong> las funciones que ofrece AsistPro — agendar citas, controlar gastos, generar informes, etc.</li>
              <li><strong className="text-light-text">Tratamiento:</strong> cualquier operación sobre datos personales: recolección, almacenamiento, uso, modificación, transferencia, eliminación.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              3. Datos que recolectamos
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              3.1 Datos proporcionados por ti
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-light-secondary">
              <li>Nombre, correo electrónico, número telefónico (por ejemplo, tu WhatsApp).</li>
              <li>Datos de facturación (tarjeta, medio de pago, dirección de facturación).</li>
              <li>Información financiera que ingreses para registrar gastos/ingresos.</li>
              <li>Preferencias de uso (por ejemplo, idioma, ajustes).</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text">
              3.2 Datos generados por el uso
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-light-secondary">
              <li>Registros de actividad (cuándo accedes, qué comandos/instrucciones das).</li>
              <li>Historial de uso (gastos registrados, citas programadas, informes generados).</li>
              <li>Metadatos técnicos (IP, tipo de dispositivo, sistema operativo, identificador del dispositivo).</li>
              <li>Datos de reconocimiento de voz o texto convertidos (cuando usas notas de voz).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              4. Finalidades del tratamiento
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Utilizamos los datos para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-light-secondary">
              <li>Proporcionar, operar y mejorar AsistPro.</li>
              <li>Atender tus comandos (programar citas, registrar gastos, generar informes).</li>
              <li>Enviar comunicaciones relevantes, avisos, actualizaciones.</li>
              <li>Procesar pagos y facturación.</li>
              <li>Prevenir fraude, errores, abusos.</li>
              <li>Cumplir obligaciones legales o regulatorias.</li>
              <li>Realizar análisis internos, estadísticas, investigaciones de mercado.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              5. Base legal / consentimiento
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Cuando la ley lo exige, tu consentimiento explícito es la base para procesar ciertos datos (por ejemplo, reconocimiento de voz). En otros casos, la relación contractual (prestación del servicio) o el interés legítimo pueden ser bases legales para el tratamiento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              6. Retención de datos
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              Conservaremos tus datos personales mientras mantengas tu cuenta activa o por el tiempo requerido por leyes aplicables. Cuando ya no sean necesarios, los eliminaremos o anonimaremos, salvo que debamos conservar cierta información por exigencia legal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              7. Compartir datos con terceros
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              8. Seguridad de la información
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              9. Derechos del usuario
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              10. Cookies y tecnologías similares
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              11. Cambios a esta política
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-text">
              12. Contacto
            </h2>
            <p className="mb-4 text-light-secondary leading-relaxed">
              [Insertar texto legal aquí]
            </p>
          </section>

          {/* Navigation to Terms of Service */}
          <div className="mt-12 pt-8 border-t border-light-border">
            <Link
              href="/legal/terms-of-service"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-light-accent-light text-light-accent-dark rounded-lg hover:bg-light-accent hover:text-light-white transition-colors duration-200 font-medium"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              Ver Términos y Condiciones
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
