import { rest } from 'msw';

const membershipHandlers = [
    // createBike
    rest.post(`${process.env.REACT_APP_API_URL}/api/bike/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.year === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.year === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.year === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.year === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ bike_id: 1 }));
    }),

    // getBikeList
    rest.get(`${process.env.REACT_APP_API_URL}/api/bike/list`, (req, res, ctx) => {
        const membershipID = req.url.searchParams.get('membershipID');
        if (membershipID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Badrequest' }));
        } if (membershipID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (membershipID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'NotFound' }));
        } if (membershipID === '-4') {
            return res(ctx.status(404), ctx.json({ reason: 'InternalServerError' }));
        }
        return res(ctx.status(200), ctx.json([{ bike_id: 1 }, { bike_id: 2 }]));
    }),

    // getBike
    rest.get(`${process.env.REACT_APP_API_URL}/api/bike/:bikeID`, (req, res, ctx) => {
        const { bikeID } = req.params;
        if (bikeID === '1') {
            return res(ctx.status(200), ctx.json({ bike_id: 1 }));
        } if (bikeID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (bikeID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (bikeID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateBike
    rest.patch(`${process.env.REACT_APP_API_URL}/api/bike/:bikeID`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.year === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.year === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.year === 'Forbidden') {
            return res(ctx.status(402), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.year === 'Internal Server Error') {
            return res(ctx.status(501), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ bike_id: 1 }));
    }),

    // deleteBike
    rest.delete(`${process.env.REACT_APP_API_URL}/api/bike/:bikeID`, (req, res, ctx) => {
        const { bikeID } = req.params;
        if (bikeID === '1') {
            return res(ctx.status(200), ctx.json({ bike_id: 1 }));
        } if (bikeID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (bikeID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (bikeID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),
];

export { membershipHandlers as default };
