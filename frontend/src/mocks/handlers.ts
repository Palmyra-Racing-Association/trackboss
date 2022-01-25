import { rest } from 'msw';

const handlers = [
    // byMemberShip
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/1`, (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 3 }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/-1`, (req, res, ctx) => {
        const response = res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/-2`, (req, res, ctx) => {
        const response = res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/-3`, (req, res, ctx) => {
        const response = res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/-4`, (req, res, ctx) => {
        const response = res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
        return response;
    }),
    // byMember
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/1`, (req, res, ctx) => {
        const response = res(ctx.status(200), ctx.json({ total: 5 }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/-1`, (req, res, ctx) => {
        const response = res(ctx.status(400), ctx.json({ reason: 'Bad request' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/-2`, (req, res, ctx) => {
        const response = res(ctx.status(401), ctx.json({ reason: 'Unauthorized' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/-3`, (req, res, ctx) => {
        const response = res(ctx.status(404), ctx.json({ reason: 'Not Found' }));
        return response;
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/-4`, (req, res, ctx) => {
        const response = res(ctx.status(500), ctx.json({ reason: 'Internal Server Error' }));
        return response;
    }),
];

export { handlers as default };
