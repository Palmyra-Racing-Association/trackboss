import { Request, Response, Router } from 'express';
import { getBike, insertBike } from '../database/bike';
import { GetBikeResponse, PostNewBikeResponse } from '../typedefs/bike';
import { checkHeader, verify } from '../util/auth';

const bike = Router();

bike.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Membership Admin');
            const insertId = await insertBike(req.body);
            response = await getBike(insertId);
            res.status(201);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

bike.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.get('/:bikeId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { bikeId } = req.params;
            response = await getBike(Number(bikeId));
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
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

bike.patch('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.delete('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default bike;
