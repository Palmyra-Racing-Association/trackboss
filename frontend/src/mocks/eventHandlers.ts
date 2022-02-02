import { rest } from 'msw';

const eventHandlers = [
    // createEvent
    rest.post(`${process.env.REACT_APP_API_URL}/api/event/new`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ eventId: 1 }));
    }),

    // getEventList
    rest.get(`${process.env.REACT_APP_API_URL}/api/event/list`, (req, res, ctx) => {
        const status = req.headers.get('Authorization');
        if (status === 'Bearer Badrequest') {
            return res(ctx.status(400), ctx.json({ reason: 'Badrequest' }));
        } if (status === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (status === 'Bearer NotFound') {
            return res(ctx.status(404), ctx.json({ reason: 'NotFound' }));
        } if (status === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json([{ eventId: 1 }, { eventId: 2 }]));
        }
        return res(ctx.status(501), ctx.json({ reason: 'InternalServerError' }));
    }),

    // getEvent
    rest.get(`${process.env.REACT_APP_API_URL}/api/event/:eventID`, (req, res, ctx) => {
        const { eventID } = req.params;
        if (eventID === '1') {
            return res(ctx.status(200), ctx.json({ eventId: 1 }));
        } if (eventID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (eventID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (eventID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // deleteEvent
    rest.delete(`${process.env.REACT_APP_API_URL}/api/event/:eventID`, (req, res, ctx) => {
        const status = req.headers.get('Authorization');
        if (status === 'Bearer Bad request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (status === 'Bearer Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (status === 'Bearer Not Found') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        } if (status === 'Bearer TestingToken') {
            return res(ctx.status(200), ctx.json({ eventId: 1 }));
        }
        return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateEvent
    rest.patch(`${process.env.REACT_APP_API_URL}/api/event/:eventID`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ eventId: 1 }));
    }),
];
export { eventHandlers as default };
