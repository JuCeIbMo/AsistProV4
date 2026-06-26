import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, WHATSAPP_PHONE } from './whatsapp';

describe('whatsapp config', () => {
  it('builds the base contact URL from the centralized phone', () => {
    expect(WHATSAPP_PHONE).toBe('59175014755');
    expect(buildWhatsAppUrl()).toBe('https://wa.me/59175014755');
  });

  it('encodes the optional message in the contact URL', () => {
    expect(buildWhatsAppUrl('Hola mundo')).toBe('https://wa.me/59175014755?text=Hola%20mundo');
  });
});
