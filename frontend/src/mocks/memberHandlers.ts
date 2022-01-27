import { rest } from 'msw';

const memberHandlers = [
    // createMember
    rest.post(`${process.env.REACT_APP_API_URL}/api/member/new`, (req, res, ctx) => {
        const bodyString = JSON.stringify(req.body);
        const body = JSON.parse(bodyString);

        if (body.address === 'Bad Request') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad Request' }));
        }
        if (body.address === 'Unauthorized') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        }
        if (body.address === 'Forbidden') {
            return res(ctx.status(403), ctx.json({ reason: 'Forbidden' }));
        }
        if (body.address === 'Internal Server Error') {
            return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
        }

        return res(ctx.status(201), ctx.json({ member_id: 1 }));
    }),

    // getMemberList
    rest.get(`${process.env.REACT_APP_API_URL}/api/member/list`, (req, res, ctx) => {
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
        return res(ctx.status(200), ctx.json([{ member_id: 1 }, { member_id: 2 }]));
    }),

    // getMember
    rest.get(`${process.env.REACT_APP_API_URL}/api/member/:memberID`, (req, res, ctx) => {
        const { memberID } = req.params;
        if (memberID === '1') {
            return res(ctx.status(200), ctx.json({ member_id: 1 }));
        } if (memberID === '-1') {
            return res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        } if (memberID === '-2') {
            return res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        } if (memberID === '-3') {
            return res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        }
        return res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
    }),

    // updateMember
    rest.patch(`${process.env.REACT_APP_API_URL}/api/member/:memberID`, (req, res, ctx) => {
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

        return res(ctx.status(201), ctx.json({ member_id: 1 }));
    }),

    

    

];

export { memberHandlers as default };