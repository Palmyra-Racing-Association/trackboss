import { Request, Response, Router } from 'express';
import { checkHeader, verify } from '../util/auth';
import logger from '../logger';
import { GetRidingAreaStatusRequest, GetRidingAreaStatusResponse } from '../typedefs/ridingAreaStatus';
import getRidingAreaStatuses from '../database/ridingAreaStatus';

const ridingAreaStatus = Router();

ridingAreaStatus.get('/', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetRidingAreaStatusResponse;
    const headerCheck = checkHeader(authorization);

    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            response = await getRidingAreaStatuses();
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
                logger.error('error getting track statuses', e);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default ridingAreaStatus;
