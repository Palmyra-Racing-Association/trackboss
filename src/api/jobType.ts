import { Request, Response, Router } from 'express';
import { checkHeader, verify } from '../util/auth';
import {
    GetJobTypeListResponse,
    GetJobTypeResponse,
    JobType,
    PatchJobTypeResponse,
    PostNewJobTypeResponse,
} from '../typedefs/jobType';
import { getJobType, getJobTypeList, insertJobType, patchJobType } from '../database/jobType';

const jobType = Router();

jobType.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewJobTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertJobType(req.body);
            response = await getJobType(insertId);
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

jobType.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetJobTypeListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const jobTypeList: JobType[] = await getJobTypeList();
            res.status(200);
            response = jobTypeList;
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
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

jobType.get('/:jobTypeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetJobTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { jobTypeID } = req.params;
            response = await getJobType(Number(jobTypeID));
            res.status(200);
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

jobType.patch('/:jobTypeID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchJobTypeResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { jobTypeID } = req.params;
            await verify(headerCheck.token, 'Admin');
            await patchJobType(Number(jobTypeID), req.body);
            response = await getJobType(Number(jobTypeID));
            res.status(200);
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
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default jobType;
