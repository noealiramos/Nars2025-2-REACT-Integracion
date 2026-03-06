import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpieza automática después de cada prueba
afterEach(() => {
    cleanup();
});
