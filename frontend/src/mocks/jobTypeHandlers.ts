import { rest } from 'msw';

const jobTypeHandlers = [
    // createJobType
    rest.post(`${process.env.REACT_APP_API_URL}/api/jobType/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.address === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.address === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.address === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.address === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ job_type_id: 1 }));
    }),

    // getJobTypeList
    rest.get(`${process.env.REACT_APP_API_URL}/api/jobType/list`, (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json([{ job_type_id: 1 }, { job_type_id: 2 }]));
        return response;
    }),

    // getJobType
    rest.get(`${process.env.REACT_APP_API_URL}/api/jobType/:jobTypeID`, (req, res, ctx) => {
        const { jobTypeID } = req.params;
        if (jobTypeID === '1') {
            return res(ctx.status(200), ctx.json({ job_type_id: 1 }));
        } if (jobTypeID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (jobTypeID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (jobTypeID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateJobType
    rest.patch(`${process.env.REACT_APP_API_URL}/api/jobType/:jobTypeID`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.address === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.address === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.address === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.address === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ job_type_id: 1 }));
    }),
];

export { jobTypeHandlers as default };
