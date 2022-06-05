import { Request, Response, Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { GetGateCodeResponse, PostGateCodeResponse } from '../typedefs/gateCode';
import { checkHeader, verify } from '../util/auth';
import { getPool } from '../database/pool';
import logger from '../logger';

const gateCode = Router();

gateCode.get('/:year', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetGateCodeResponse;
    const headerCheck = checkHeader(authorization);
    const { year } = req.params;

    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const [results] =
                await getPool().query<RowDataPacket[]>('select * from gate_code where year = ?', [year]);
            response = {
                id: results[0].gate_code_id,
                year: results[0].year,
                gateCode: results[0].gate_code,
            };
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                logger.error(`error getting gate code for ${year}`, e);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

gateCode.post('/:year', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostGateCodeResponse;
    const headerCheck = checkHeader(authorization);
    const { year } = req.params;

    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const sql =
                'insert into gate_code (year, gate_code) values (?, ?)';
            const values = [req.body.year, req.body.gateCode];
            const [results] =
                await getPool().query<RowDataPacket[]>(sql, values);
            response = {
                id: results[0].gate_code_id,
                year: results[0].year,
                gateCode: results[0].gate_code,
            };
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                logger.error(`error getting gate code for ${year}`, e);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default gateCode;
