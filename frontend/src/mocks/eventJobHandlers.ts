import { rest } from 'msw';

const eventJobHandlers = [
    // createEventJob
    rest.post(`${process.env.REACT_APP_API_URL}/api/eventJob/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.eventTypeId === 1) {
            return res(ctx.status(201), ctx.json({ eventJobId: 1 }));
        }
        if (body.eventTypeId === -1) {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.eventTypeId === -2) {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.eventTypeId === -3) {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // getEventJob
    rest.get(`${process.env.REACT_APP_API_URL}/api/eventJob/:eventJobID`, (req, res, ctx) => {
        const { eventJobID } = req.params;
        if (eventJobID === '1') {
            return res(ctx.status(200), ctx.json({ eventJobId: 1 }));
        } if (eventJobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (eventJobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (eventJobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateEventJob
    rest.patch(`${process.env.REACT_APP_API_URL}/api/eventJob/:eventJobID`, (req, res, ctx) => {
        const { eventJobID } = req.params;
        if (eventJobID === '1') {
            return res(ctx.status(200), ctx.json({ eventJobId: 1 }));
        } if (eventJobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (eventJobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (eventJobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Forbidden' }));
        } if (eventJobID === '-4') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // deleteEventJob
    rest.delete(`${process.env.REACT_APP_API_URL}/api/eventJob/:eventJobID`, (req, res, ctx) => {
        const { eventJobID } = req.params;
        if (eventJobID === '1') {
            return res(ctx.status(200), ctx.json({ eventJobId: 1 }));
        } if (eventJobID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        } if (eventJobID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (eventJobID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Forbidden' }));
        } if (eventJobID === '-4') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
];

export { eventJobHandlers as default };
