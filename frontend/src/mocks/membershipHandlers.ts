import { rest } from 'msw';

const membershipHandlers = [
    // createMembership
    rest.post(`${process.env.REACT_APP_API_URL}/api/membership/new`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ membershipId: 1 }));
    }),

    // getMembershipList
    rest.get(`${process.env.REACT_APP_API_URL}/api/membership/list`, (req, res, ctx) => {
        const status = req.url.searchParams.get('status');

        if (status === 'Badrequest') {
            return res(ctx.status(400), ctx.json({ reason: 'Badrequest' }));
        } if (status === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (status === 'NotFound') {
            return res(ctx.status(404), ctx.json({ reason: 'NotFound' }));
        } if (status === 'InternalServerError') {
            return res(ctx.status(404), ctx.json({ reason: 'InternalServerError' }));
        }
        return res(ctx.status(200), ctx.json([{ membershipId: 1 }, { membershipId: 2 }]));
    }),

    // getMembership
    rest.get(`${process.env.REACT_APP_API_URL}/api/membership/:membershipID`, (req, res, ctx) => {
        const { membershipID } = req.params;
        if (membershipID === '1') {
            return res(ctx.status(200), ctx.json({ membershipId: 1 }));
        } if (membershipID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (membershipID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (membershipID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateMembership
    rest.patch(`${process.env.REACT_APP_API_URL}/api/membership/:membershipID`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ membershipId: 1 }));
    }),

    // createMembership
    rest.post(`${process.env.REACT_APP_API_URL}/api/membership/register`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ memberType: 'new member' }));
    }),
];

export default membershipHandlers;
