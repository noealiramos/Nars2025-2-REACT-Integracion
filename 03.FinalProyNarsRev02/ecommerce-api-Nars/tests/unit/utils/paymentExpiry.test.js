import { describe, expect, it } from 'vitest';
import { isValidExpiryDate, normalizeExpiryDate } from '../../../src/utils/paymentExpiry.js';

describe('paymentExpiry', () => {
  it('acepta fechas canonicas MM/YY', () => {
    expect(normalizeExpiryDate('12/26')).toBe('12/26');
    expect(normalizeExpiryDate('01/30')).toBe('01/30');
    expect(isValidExpiryDate('12/26')).toBe(true);
    expect(isValidExpiryDate('01/30')).toBe(true);
  });

  it('normaliza MMYY a MM/YY', () => {
    expect(normalizeExpiryDate('1226')).toBe('12/26');
    expect(isValidExpiryDate(normalizeExpiryDate('1226'))).toBe(true);
  });

  it('rechaza formatos invalidos', () => {
    expect(isValidExpiryDate(normalizeExpiryDate('1/26'))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDate('13/26'))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDate('00/26'))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDate(''))).toBe(false);
  });
});
