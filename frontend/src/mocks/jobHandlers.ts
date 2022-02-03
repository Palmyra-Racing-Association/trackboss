import { rest } from 'msw';

const jobHandlers = [
    // createJob
    rest.post(`${process.env.REACT_APP_API_URL}/api/job/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.jobDate === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.jobDate === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.jobDate === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.jobDate === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ jobId: 1 }));
    }),

    // getJobList
    rest.get(`${process.env.REACT_APP_API_URL}/api/job/list`, (req, res, ctx) => {
        const queryType = req.url.searchParams.get('queryType');

        if (queryType === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (queryType === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (queryType === 'Not Found') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        } if (queryType === 'Internal Server Error') {
            return res(ctx.status(404), ctx.json({ reason: 'Internal Server Error' }));
        }
        return res(ctx.status(200), ctx.json([{ jobId: 1 }, { jobId: 2 }]));
    }),

    // getJob
    rest.get(`${process.env.REACT_APP_API_URL}/api/job/:jobID`, (req, res, ctx) => {
        const { jobID } = req.params;
        if (jobID === '1') {
            return res(ctx.status(200), ctx.json({ jobId: 1 }));
        } if (jobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (jobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (jobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateJob
    rest.patch(`${process.env.REACT_APP_API_URL}/api/job/:jobID`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (token === 'Bearer Not Found') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        } if (token === 'Bearer Forbidden') {
            return res(ctx.status(404), ctx.json({ reason: 'Forbidden' }));
        } if (token === 'Bearer Internal Server Error') {
            return res(ctx.status(404), ctx.json({ reason: 'Internal Server Error' }));
        }
        return res(ctx.status(200), ctx.json({ jobId: 1 }));
    }),

    // cloneJob
    rest.post(`${process.env.REACT_APP_API_URL}/api/job/:jobID`, (req, res, ctx) => {
        const { jobID } = req.params;
        if (jobID === '1') {
            return res(ctx.status(200), ctx.json({ jobId: 1 }));
        } if (jobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (jobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (jobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // deleteJob
    rest.delete(`${process.env.REACT_APP_API_URL}/api/job/:jobID`, (req, res, ctx) => {
        const { jobID } = req.params;
        if (jobID === '1') {
            return res(ctx.status(200), ctx.json({ jobId: 1 }));
        } if (jobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (jobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (jobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
];

export { jobHandlers as default };
