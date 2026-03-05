import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import setupGlobalErrorHandlers from '../../../src/middlewares/globalErrorHandler.js';
import logger from '../../../src/middlewares/logger.js';

vi.mock('../../../src/middlewares/logger.js', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn()
    },
    requestLogger: vi.fn()
}));

describe('globalErrorHandler setup', () => {
    let processOnSpy;
    let processExitSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        processOnSpy = vi.spyOn(process, 'on').mockImplementation(() => { });
        processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { });
    });

    afterEach(() => {
        processOnSpy.mockRestore();
        processExitSpy.mockRestore();
    });

    it('debe registrar manejadores para uncaughtException y unhandledRejection', () => {
        setupGlobalErrorHandlers();

        expect(processOnSpy).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
        expect(processOnSpy).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
    });

    it('el manejador de uncaughtException debe intentar escribir en el log y salir', () => {
        setupGlobalErrorHandlers();

        // Obtener el callback registrado
        const uncaughtHandler = processOnSpy.mock.calls.find(call => call[0] === 'uncaughtException')[1];

        const error = new Error('Fatal crash');
        uncaughtHandler(error);

        expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
            message: 'UNCAUGHT EXCEPTION',
            error: 'Fatal crash'
        }));
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('el manejador de unhandledRejection debe intentar escribir en el log', () => {
        setupGlobalErrorHandlers();

        const rejectionHandler = processOnSpy.mock.calls.find(call => call[0] === 'unhandledRejection')[1];

        rejectionHandler('Promise failed', {});

        expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
            message: 'UNHANDLED REJECTION',
            reason: 'Promise failed'
        }));
    });
});
