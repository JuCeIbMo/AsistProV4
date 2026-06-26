export const WHATSAPP_PHONE = '59175014755';

export function buildWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${WHATSAPP_PHONE}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOtpRecoveryUrl(phone?: string) {
  const normalizedPhone = (phone || '').replace(/[^\d]/g, '');
  const lines = [
    normalizedPhone ? `Mi numero es ${normalizedPhone}.` : null,
    'Hola, quiero reabrir la conversacion para recibir mi codigo de acceso.',
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join('\n'));
}
