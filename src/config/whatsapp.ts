export const WHATSAPP_PHONE = '59175014755';

export function buildWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${WHATSAPP_PHONE}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
