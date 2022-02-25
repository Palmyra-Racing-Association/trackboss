import { Request, Response, Router } from 'express';
import { getBike, getBikeList, insertBike, patchBike } from '../database/bike';
import { Bike, GetBikeListResponse, GetBikeResponse, PatchBikeResponse, PostNewBikeResponse } from '../typedefs/bike';
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

bike.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBikeListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            let filterMembership: number | undefined = Number(req.query.membershipID);
            if (Number.isNaN(filterMembership)) {
                filterMembership = undefined;
            }
            const bikeList: Bike[] = await getBikeList(filterMembership);
            res.status(200);
            response = bikeList;
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
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

bike.patch('/:bikeId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { bikeId } = req.params;
            const bikeIdNum = Number(bikeId);
            if (Number.isNaN(bikeIdNum)) {
                throw new Error('user input error');
            }
            await verify(headerCheck.token, 'Membership Admin');
            await patchBike(bikeIdNum, req.body);
            response = await getBike(bikeIdNum);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
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

bike.delete('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default bike;
