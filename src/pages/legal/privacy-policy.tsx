import React from 'react';
import LegalHeader from '../../components/LegalHeader';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LegalHeader />
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-sm rounded-lg my-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Política de Privacidad</h1>      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
        <p className="mb-4">
          Bienvenido a AsistPro ("nosotros", "nuestro/a/s", "la App"). Valoramos tu privacidad y queremos que sepas cómo recogemos, utilizamos, almacenamos, compartimos y protegemos tus datos personales. Al usar nuestra aplicación o servicios relacionados, aceptas esta Política de Privacidad.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Definiciones</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Datos personales:</strong> información que permite identificar directa o indirectamente a una persona (nombre, correo electrónico, teléfono, etc.).</li>
          <li><strong>Usuario / Cliente:</strong> persona que usa AsistPro.</li>
          <li><strong>Servicios:</strong> las funciones que ofrece AsistPro — agendar citas, controlar gastos, generar informes, etc.</li>
          <li><strong>Tratamiento:</strong> cualquier operación sobre datos personales: recolección, almacenamiento, uso, modificación, transferencia, eliminación.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Datos que recolectamos</h2>
        <h3 className="text-xl font-semibold mb-3">3.1 Datos proporcionados por ti</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Nombre, correo electrónico, número telefónico (por ejemplo, tu WhatsApp).</li>
          <li>Datos de facturación (tarjeta, medio de pago, dirección de facturación).</li>
          <li>Información financiera que ingreses para registrar gastos/ingresos.</li>
          <li>Preferencias de uso (por ejemplo, idioma, ajustes).</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">3.2 Datos generados por el uso</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Registros de actividad (cuándo accedes, qué comandos/instrucciones das).</li>
          <li>Historial de uso (gastos registrados, citas programadas, informes generados).</li>
          <li>Metadatos técnicos (IP, tipo de dispositivo, sistema operativo, identificador del dispositivo).</li>
          <li>Datos de reconocimiento de voz o texto convertidos (cuando usas notas de voz).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Finalidades del tratamiento</h2>
        <p className="mb-4">Utilizamos los datos para:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Proporcionar, operar y mejorar AsistPro.</li>
          <li>Atender tus comandos (programar citas, registrar gastos, generar informes).</li>
          <li>Enviar comunicaciones relevantes, avisos, actualizaciones.</li>
          <li>Procesar pagos y facturación.</li>
          <li>Prevenir fraude, errores, abusos.</li>
          <li>Cumplir obligaciones legales o regulatorias.</li>
          <li>Realizar análisis internos, estadísticas, investigaciones de mercado.</li>
        </ul>
      </section>

      {/* Continuing with remaining sections */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Base legal / consentimiento</h2>
        <p className="mb-4">
          Cuando la ley lo exige, tu consentimiento explícito es la base para procesar ciertos datos (por ejemplo, reconocimiento de voz). En otros casos, la relación contractual (prestación del servicio) o el interés legítimo pueden ser bases legales para el tratamiento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Retención de datos</h2>
        <p className="mb-4">
          Conservaremos tus datos personales mientras mantengas tu cuenta activa o por el tiempo requerido por leyes aplicables. Cuando ya no sean necesarios, los eliminaremos o anonimaremos, salvo que debamos conservar cierta información por exigencia legal.
        </p>
      </section>

      {/* Add remaining sections following the same pattern */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
