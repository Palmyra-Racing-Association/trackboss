import { Request, Response, Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { execSync } from 'child_process';
import { getPool } from '../database/pool';
import logger from '../logger';

const health = Router();

health.get('/', async (req: Request, res: Response) => {
    const response = {
        ok: true,
        dbtime: '',
        commitId: '',
        githubCommitLink: '',
    };
    let status;
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select now() dbtime from dual');
        response.dbtime = results[0].dbtime;
        response.commitId = execSync('git rev-parse HEAD').toString().replace(/\n/, '');
        // eslint-disable-next-line max-len
        response.githubCommitLink = `https://github.com/Palmyra-Racing-Association/clubmanager-2.0/commit/${response.commitId}`;
        status = 200;
    } catch (e: any) {
        logger.error(e);
        response.ok = false;
        response.dbtime = '';
        status = 500;
    }
    res.status(status);
    res.send(response);
});

export default health;
