import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../../../src/middlewares/errorHandler.js';
import { createMockReqRes } from '../../testUtils.js';
import fs from 'fs';

vi.mock('fs');

describe('errorHandler middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe registrar el error en log y retornar 500', async () => {
        const err = new Error('Test Error');
        err.stack = 'stack trace';
        const { req, res, next } = createMockReqRes({
            requestId: 'rid-123',
            method: 'GET',
            url: '/test'
        });

        fs.existsSync.mockReturnValue(true);
        fs.appendFile.mockImplementation((path, msg, cb) => cb(null));

        await errorHandler(err, req, res, next);

        expect(fs.appendFile).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal Server Error'
        });
    });
});
