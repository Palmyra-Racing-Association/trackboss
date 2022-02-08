import { rest } from 'msw';

const billingHandlers = [
    // getYearlyThreshold
    rest.get(`${process.env.REACT_APP_API_URL}/api/billing/yearlyWorkPointThreshold`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json({ threshold: 1 }));
        }
        if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // getBills
    rest.get(`${process.env.REACT_APP_API_URL}/api/billing/list`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json([{}]));
        }
        if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (token === 'Bearer Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // generateBills
    rest.post(`${process.env.REACT_APP_API_URL}/api/billing`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json([{ billId: 1 }]));
        }
        if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (token === 'Bearer Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // getBillsForMembership
    rest.get(`${process.env.REACT_APP_API_URL}/api/billing/:memberID`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json([{ billId: 1 }]));
        }
        if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (token === 'Bearer Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // payBill
    rest.post(`${process.env.REACT_APP_API_URL}/api/billing/:memberID`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');

        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json({}));
        }
        if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (token === 'Bearer Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        if (token === 'Bearer Not Found') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
];
export { billingHandlers as default };
