import { Request, Response, Router } from 'express';
import { deleteBike, getBike, getBikeList, insertBike, patchBike } from '../database/bike';
import {
    Bike,
    DeleteBikeResponse,
    GetBikeListResponse,
    GetBikeResponse,
    PatchBikeResponse,
    PostNewBikeResponse,
} from '../typedefs/bike';
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
            const id = req.query.membershipID;
            let filterMembership: number | undefined;
            if (typeof id === 'undefined') {
                filterMembership = undefined;
            } else {
                filterMembership = Number(id);
                if (Number.isNaN(filterMembership)) {
                    throw new Error('user input error');
                }
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

bike.get('/:bikeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { bikeID } = req.params;
            response = await getBike(Number(bikeID));
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

bike.patch('/:bikeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { bikeID } = req.params;
            const bikeIdNum = Number(bikeID);
            if (Number.isNaN(bikeIdNum)) {
                throw new Error('not found');
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

bike.delete('/:bikeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: DeleteBikeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { bikeID } = req.params;
            const bikeIdNum = Number(bikeID);
            if (Number.isNaN(bikeIdNum)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Membership Admin');
            await deleteBike(bikeIdNum);
            response = { bikeId: bikeIdNum };
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
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

export default bike;
