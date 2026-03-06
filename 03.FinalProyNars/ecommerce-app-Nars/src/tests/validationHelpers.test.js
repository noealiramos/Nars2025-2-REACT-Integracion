import { describe, it, expect } from 'vitest';
import {
    validateEmail,
    validateCardNumber,
    validateExpiry,
    validateCVV
} from '../utils/validationHelpers';

describe('Validation Helpers', () => {
    describe('validateEmail', () => {
        it('debería retornar true para emails válidos', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name+label@provider.co.uk')).toBe(true);
        });

        it('debería retornar false para emails inválidos', () => {
            expect(validateEmail('test@example')).toBe(false);
            expect(validateEmail('testexample.com')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('validateCardNumber', () => {
        it('debería retornar true para 16 dígitos (con o sin espacios)', () => {
            expect(validateCardNumber('1234567812345678')).toBe(true);
            expect(validateCardNumber('1234 5678 1234 5678')).toBe(true);
        });

        it('debería retornar false para números incorrectos', () => {
            expect(validateCardNumber('1234')).toBe(false);
            expect(validateCardNumber('123456781234567a')).toBe(false);
        });
    });

    describe('validateExpiry', () => {
        it('debería retornar true para MM/AA válido en el futuro', () => {
            // Nota: Este test podría fallar en el futuro si no usamos una fecha dinámica, 
            // pero para el ejemplo MM/AA con año alto funciona
            expect(validateExpiry('12/29')).toBe(true);
        });

        it('debería retornar false para formatos inválidos o fechas pasadas', () => {
            expect(validateExpiry('13/25')).toBe(false); // Mes inválido
            expect(validateExpiry('01/20')).toBe(false); // Año pasado
            expect(validateExpiry('01-25')).toBe(false); // Mal separador
        });
    });

    describe('validateCVV', () => {
        it('debería retornar true para 3 o 4 dígitos', () => {
            expect(validateCVV('123')).toBe(true);
            expect(validateCVV('1234')).toBe(true);
        });

        it('debería retornar false para longitud incorrecta o no números', () => {
            expect(validateCVV('12')).toBe(false);
            expect(validateCVV('12345')).toBe(false);
            expect(validateCVV('abc')).toBe(false);
        });
    });
});
