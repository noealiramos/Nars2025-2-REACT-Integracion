import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import setupGlobalErrorHandlers from '../../../src/middlewares/globalErrorHandler.js';

vi.mock('fs');

describe('globalErrorHandler setup', () => {
    let processOnSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        processOnSpy = vi.spyOn(process, 'on').mockImplementation(() => { });
        fs.existsSync.mockReturnValue(true);
    });

    afterEach(() => {
        processOnSpy.mockRestore();
    });

    it('debe registrar manejadores para uncaughtException y unhandledRejection', () => {
        setupGlobalErrorHandlers();

        expect(processOnSpy).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
        expect(processOnSpy).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
    });

    it('el manejador de uncaughtException debe intentar escribir en el log', () => {
        setupGlobalErrorHandlers();

        // Obtener el callback registrado
        const uncaughtHandler = processOnSpy.mock.calls.find(call => call[0] === 'uncaughtException')[1];

        const error = new Error('Fatal crash');
        uncaughtHandler(error);

        expect(fs.appendFileSync).toHaveBeenCalledWith(
            expect.stringContaining('error.log'),
            expect.stringContaining('UNCAUGHT EXCEPTION | Fatal crash')
        );
    });

    it('el manejador de unhandledRejection debe intentar escribir en el log', () => {
        setupGlobalErrorHandlers();

        const rejectionHandler = processOnSpy.mock.calls.find(call => call[0] === 'unhandledRejection')[1];

        rejectionHandler('Promise failed', {});

        expect(fs.appendFileSync).toHaveBeenCalledWith(
            expect.stringContaining('error.log'),
            expect.stringContaining('UNHANDLED REJECTION | Promise failed')
        );
    });

    it('debe crear el directorio de logs si no existe', () => {
        fs.existsSync.mockReturnValue(false);
        setupGlobalErrorHandlers();
        expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ recursive: true }));
    });
});
