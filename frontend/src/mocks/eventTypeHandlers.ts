import { rest } from 'msw';

const eventTypeHandlers = [
    // createJobType
    rest.post(`${process.env.REACT_APP_API_URL}/api/eventType/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.type === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.type === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.type === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.type === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ eventTypeId: 1 }));
    }),

    // getEventTypeList
    rest.get(`${process.env.REACT_APP_API_URL}/api/eventType/list`, (req, res, ctx) => {
        const token = req.headers.get('Authorization');
        if (token === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json([{ eventTypeId: 1 }, { eventTypeId: 2 }]));
        } if (token === 'Bearer Bad request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (token === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (token === 'Bearer Not Found') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(404), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // getEventType
    rest.get(`${process.env.REACT_APP_API_URL}/api/eventType/:eventTypeID`, (req, res, ctx) => {
        const { eventTypeID } = req.params;
        if (eventTypeID === '1') {
            return res(ctx.status(200), ctx.json({ eventTypeId: 1 }));
        } if (eventTypeID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (eventTypeID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (eventTypeID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateJobType
    rest.patch(`${process.env.REACT_APP_API_URL}/api/eventType/:eventTypeID`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.type === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.type === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.type === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.type === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ eventTypeId: 1 }));
    }),
];

export { eventTypeHandlers as default };
