import { Request, Response, Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { getPool } from '../database/pool';
import logger from '../logger';

const health = Router();

health.get('/', async (req: Request, res: Response) => {
    const response = {
        ok: true,
        dbtime: '',
    };
    let status;
    const { echo } = req.params;
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select now() dbtime from dual');
        response.dbtime = results[0].dbtime;
        status = 200;
    } catch (e: any) {
        logger.error(e);
        response.dbtime = '';
        status = 500;
    }
    res.status(200);
    res.send(response);
});

export default health;
