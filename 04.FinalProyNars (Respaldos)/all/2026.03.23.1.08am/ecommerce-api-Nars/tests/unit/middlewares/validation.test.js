import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validationResult } from 'express-validator';
import validateMiddleware from '../../../src/middlewares/validation.js';
import { createMockReqRes } from '../../testUtils.js';

vi.mock('express-validator');

describe('validationMiddleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe retornar 422 si hay errores de validacion', () => {
        const mockErrors = [
            { msg: 'Invalid email', param: 'email' },
            { msg: 'Password too short', param: 'password' }
        ];

        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => mockErrors
        });

        const { req, res, next } = createMockReqRes();

        validateMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ errors: mockErrors });
        expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar a next() si no hay errores', () => {
        validationResult.mockReturnValue({
            isEmpty: () => true
        });

        const { req, res, next } = createMockReqRes();

        validateMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
