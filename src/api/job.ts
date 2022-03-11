import { Request, Response, Router } from 'express';
import _ from 'lodash';
import {
    GetJobListResponse,
    PostNewJobResponse,
    GetJobListRequestFilters,
    Job,
    GetJobResponse,
    PatchJobResponse,
    DeleteJobResponse,
} from 'src/typedefs/job';
import { checkHeader, verify } from '../util/auth';

import { insertJob, getJob, getJobList, patchJob, deleteJob } from '../database/job';

const job = Router();

job.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewJobResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertJob(req.body);
            response = await getJob(insertId);
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

job.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetJobListResponse;
    const headerCheck = checkHeader(authorization);
    const verifyDate = (dateString: string) => {
        let valid = true;
        if (dateString === '') {
            valid = true;
        }
        const year = Number(dateString.slice(0, 4));
        const month = Number(dateString.slice(4, 6));
        const day = Number(dateString.slice(6, 8));
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
            valid = false;
        }
        return { valid, date: new Date(year, month - 1, day) };
    };
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);

            const { range } = req.headers;
            let startDate: string | undefined;
            let endDate: string | undefined;
            if (typeof range !== 'undefined') {
                const [start, end] = range.split('-');
                if (start === undefined || end === undefined) {
                    throw new Error('user input error');
                }
                const startData = verifyDate(start);
                const endData = verifyDate(end);
                if (!startData.valid || !endData.valid) {
                    throw new Error('user input error');
                } else {
                    if (start === '' && end !== '') {
                        endDate = end;
                    } else if (end === '' && start !== '') {
                        startDate = start;
                    } else {
                        startDate = start;
                        endDate = end;
                    }
                    res.status(206);
                }
            }
            const assignmentStatus: string | undefined = req.query.assignmentStatus as string;
            const verificationStatus: string | undefined = req.query.verificationStatus as string;
            const memberId: string | undefined = req.query.memberId as string;
            const membershipId: string | undefined = req.query.membershipId as string;
            const eventId: string | undefined = req.query.eventId as string;
            const filters: GetJobListRequestFilters = {};
            if (typeof assignmentStatus !== 'undefined' &&
            (assignmentStatus === 'open' || assignmentStatus === 'assigned')) {
                res.status(400);
                response = { reason: 'invalid assigment specified' };
            } else if (typeof verificationStatus !== 'undefined' &&
            (verificationStatus === 'pending' || verificationStatus === 'verified')) {
                res.status(400);
                response = { reason: 'invalid verification status' };
            } else if (Number.isNaN(Number(memberId)) && typeof memberId !== 'undefined') {
                res.status(400);
                response = { reason: 'invalid member id' };
            } else if (Number.isNaN(Number(membershipId)) && typeof membershipId !== 'undefined') {
                res.status(400);
                response = { reason: 'invalid membership id' };
            } else if (Number.isNaN(Number(eventId)) && typeof eventId !== 'undefined') {
                res.status(400);
                response = { reason: 'invalid event id' };
            } else {
                if (typeof assignmentStatus !== 'undefined') {
                    if (assignmentStatus === 'open') {
                        filters.assignmentStatus = 0;
                    } else {
                        filters.assignmentStatus = 1;
                    }
                }
                if (typeof verificationStatus !== 'undefined') {
                    if (verificationStatus === 'pending') {
                        filters.verificationStatus = 0;
                    } else {
                        filters.verificationStatus = 1;
                    }
                }
                if (typeof memberId !== 'undefined') {
                    filters.memberId = Number(memberId);
                }
                if (typeof membershipId !== 'undefined') {
                    filters.membershipId = Number(membershipId);
                }
                if (typeof eventId !== 'undefined') {
                    filters.eventId = Number(eventId);
                }
                if (typeof startDate !== 'undefined') {
                    filters.startDate = startDate;
                }
                if (typeof endDate !== 'undefined') {
                    filters.endDate = endDate;
                }
                const jobList: Job[] = await getJobList(filters);
                if (_.isEmpty(filters)) {
                    res.status(200);
                } else {
                    res.status(206);
                }
                response = jobList;
            }
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

job.get('/:jobId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetJobResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { jobId } = req.params;
            const id = Number(jobId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            response = await getJob(id);
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

job.patch('/:jobId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchJobResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { jobId } = req.params;
            await verify(headerCheck.token, 'Admin');
            const id = Number(jobId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await patchJob(Number(jobId), req.body);
            response = await getJob(id);
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

job.post('/:jobId', (req: Request, res: Response) => {
    res.status(501).send();
});

job.delete('/:jobId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: DeleteJobResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { jobId } = req.params;
            const id = Number(jobId);
            if (Number.isNaN(id)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Admin');
            await deleteJob(id);
            response = { jobId: id };
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

export default job;
