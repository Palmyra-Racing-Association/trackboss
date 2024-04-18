import { Request, Response, Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { getPool } from '../database/pool';
import logger from '../logger';
import { getLocations } from '../integrations/square';

const health = Router();

health.get('/', async (req: Request, res: Response) => {
    const squareLocations = await getLocations();
    const response = {
        ok: true,
        dbtime: '',
        squareLocationCount: squareLocations.length,
        commitId: '',
        githubCommitLink: '',
        error: undefined,
    };
    let status;
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select now() dbtime from dual');
        response.dbtime = results[0].dbtime;
        status = 200;
    } catch (e: any) {
        logger.error(e);
        response.ok = false;
        response.dbtime = '';
        response.error = e.getMessage();
        status = 500;
    }
    res.status(status);
    res.send(response);
});

export default health;
