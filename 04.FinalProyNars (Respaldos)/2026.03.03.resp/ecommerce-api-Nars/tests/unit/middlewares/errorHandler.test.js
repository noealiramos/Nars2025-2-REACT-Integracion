import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../../../src/middlewares/errorHandler.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('fs');

describe('errorHandler middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NODE_ENV = 'development';
    });

    it('debe enviar 500 y stack trace en desarrollo si no hay status en error', () => {
        const { req, res, next } = createMockReqRes({});
        const err = new Error('Test Error');
        err.stack = 'stack trace';

        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'Test Error',
            stack: 'stack trace'
        }));
    });

    it('debe enviar status personalizado si el error lo tiene', () => {
        const { req, res, next } = createMockReqRes({});
        const err = new Error('Not Found');
        err.status = 404;

        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debe ocultar stack trace y mostrar mensaje genérico en producción (500)', () => {
        process.env.NODE_ENV = 'production';
        const { req, res, next } = createMockReqRes({});
        const err = new Error('Deep Internal Secret');

        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal Server Error'
        });
    });

    it('debe mantener el mensaje original en producción si el status no es 500', () => {
        process.env.NODE_ENV = 'production';
        const { req, res, next } = createMockReqRes({});
        const err = new Error('Validation Failed');
        err.status = 400;

        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Validation Failed'
        });
    });

    it('no debe enviar respuesta si res.headersSent es true', () => {
        const { req, res, next } = createMockReqRes({});
        res.headersSent = true;
        const err = new Error('Already Sent');

        errorHandler(err, req, res, next);
        expect(res.status).not.toHaveBeenCalled();
    });
});
